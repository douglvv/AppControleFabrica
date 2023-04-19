const { Op } = require('sequelize')
const Cliente = require('../models/Cliente.js')
const Produto = require('../models/Produto.js')
const Venda = require('../models/Venda.js')
const VendaProduto = require('../models/VendaProduto.js')

module.exports = class VendaController {
    static mostrarVendas(req, res) {

        // order resultados, novos registros primeiro
        let order = 'DESC'

        Venda.findAll({
            include: [{
                model: Cliente,
                required: true
            }],
            order: [['createdAt', order]],
            limit: 1000,
        })
            .then((data) => {
                let qtd = data.length

                if (qtd === 0) {
                    qtd = false
                }

                const resultado = data.map((result) => result.get({ plain: true }))                
                res.render('venda/listar', { resultado, qtd })
            })
            .catch((err) => console.log(err))
    }

    static async criarVenda(req, res) {

        let ordenar = 'ASC'
        Cliente.findAll({
            order: [['nome', ordenar]],
            limit: 1000,
        })
            .then((data) => {
                const clientes = data.map((result) => result.get({ plain: true }))
                const data_atual = new Date().toISOString().slice(0, 10)
                res.render('venda/criar', {
                    clientes, data_atual
                })
            })
            .catch((err) => console.log(err))
    }

    // static async procurarCliente(req, res) {
    //     let cliente = '';
    //     if (req.query.cliente) {
    //         cliente = req.query.cliente.trim();
    //     }
    //     await Cliente.findAll({
    //         where: {
    //             [Op.or]: [
    //               {
    //                 nome: {
    //                   [Op.like]: `%${cliente}%`
    //                 }
    //               },
    //               {
    //                 cpfCnpj: {
    //                   [Op.like]: `%${cliente}%`
    //                 }
    //               }
    //             ]
    //           }
    //     }).then((data) => {
    //         const clientes = data.map((result) => result.get({ plain: true }))
    //         const data_atual = new Date().toISOString().slice(0, 10)
    //         res.render('venda/criar', { clientes, data_atual });
    //     })
    //         .catch((err) => console.log(err))
    // }

    static criarVendaPost(req, res) {
        const venda = {
            status: true,
            data: req.body.data,
            valorTotal: 0.00,
            ClienteId: req.body.cliente
        }
        Venda.create(venda)
            .then(() => {
                res.redirect(303, "/venda/criar/detalhes")
            })
            .catch((err) => console.log(err))
    }

    static async mostrarDetalhesVendaAtiva(req, res) {
        // Encontra a venda ativa e os produtos da venda
        let vendaAtiva = req.vendaAtiva.toJSON()
        let produtos = req.produtosVendaAtiva

        res.render("venda/venda", { vendaAtiva: vendaAtiva, produtosVendaAtiva: produtos })

    }

    static async procurarProduto(req, res) {
        let produto = '';
        if (req.query.produto) {
            produto = req.query.produto.trim();
        }
        await Produto.findAll({
            where: {
                nomeProduto: {
                    [Op.like]: `%${produto}%` // case-insensitive search
                },
            }
        }).then((data) => {
            const produtos = data.map((result) => result.get({ plain: true }))
            const vendaAtiva = req.vendaAtiva.toJSON()
            let produtosVendaAtiva = req.produtosVendaAtiva
            res.render('venda/venda', { produtos, vendaAtiva: vendaAtiva, produtosVendaAtiva: produtosVendaAtiva });
        })
            .catch((err) => console.log(err))
    }

    static async addProduto(req, res) {
        // Encontra o produto
        const id = req.body.id; //id do produto
        const produto = await Produto.findByPk(id)

        // Verifica se o produto existe
        if (!produto) {
            res.status(404).send('Produto não encontrado.')
            return
        }

        // Encontra a venda ativa
        const vendaAtiva = req.vendaAtiva

        // Verifica se o produto já está na venda ativa
        const vendaProdutoExistente = await VendaProduto.findOne({
            where: {
                VendaId: vendaAtiva.id,
                ProdutoId: produto.id
            }
        })

        if (vendaProdutoExistente) {
            // O produto já está na venda, incrementa a quantidade
            let qtd = parseFloat(vendaProdutoExistente.qtd)
            qtd += parseFloat(req.body.qtd)
            vendaProdutoExistente.qtd = qtd
            await vendaProdutoExistente.save();
        } else {
            // Adiciona o produto a venda
            const vendaProduto = {
                qtd: req.body.qtd,
                valor: produto.valorUnitario,
                VendaId: vendaAtiva.id,
                ProdutoId: produto.id
            };

            await VendaProduto.create(vendaProduto);
        }

        // Atualiza a qtd de produtos em estoque
        let qtdEstoque = parseInt(produto.qtd)
        let qtdVenda = parseInt(req.body.qtd)
        let qtdEstoqueAtualizada = qtdEstoque - qtdVenda
        produto.qtd = qtdEstoqueAtualizada
        produto.save()


        let valorTotal = parseFloat(vendaAtiva.valorTotal)
        valorTotal += parseFloat(produto.valorUnitario * req.body.qtd)

        const vendaAtualizada = {
            id: vendaAtiva.id,
            status: vendaAtiva.status,
            data: vendaAtiva.data,
            valorTotal: valorTotal
        };

        await Venda.update(vendaAtualizada, { where: { status: true } })
        vendaAtiva.save()

        // Envia todos os produtos da venda atiava para a view
        await VendaProduto.findAll({
            where: {
                VendaId: vendaAtiva.id
            },
            include: [{
                model: Produto
            }]
        }).then((data) => {
            const produtos = data.map((result) => result.get({ plain: true }))
            res.redirect(303, "/venda/criar/detalhes")
        })

    }

    static async removerProduto(req, res) {
        try {
            // Encontra a venda e o produto e destroi
            const vendaId = req.vendaAtiva.id;
            const produtoId = req.params.produtoId
            // console.log("ProdutoID:    " + produtoId)

            await VendaProduto.destroy({
                where: {
                    VendaId: vendaId,
                    ProdutoId: produtoId
                }
            })

            // Atualiza o valor total da venda
            let vendaAtualizada = req.vendaAtiva;
            let produtoRemovido = await Produto.findByPk(produtoId);
            const valorRemovido = parseFloat(produtoRemovido.valorUnitario * req.body.qtd);
            // console.log('valor Removido = ' + valorRemovido)

            let valorTotal = parseFloat(req.vendaAtiva.valorTotal)
            valorTotal = parseFloat(req.vendaAtiva.valorTotal) - valorRemovido;

            vendaAtualizada = {
                id: vendaAtiva.id,
                status: vendaAtiva.status,
                data: vendaAtiva.data,
                valorTotal: valorTotal
            };

            await Venda.update(vendaAtualizada, { where: { status: true } })

            // Atualiza a qtd do produto em estoque            
            let qtdEstoque = parseInt(produtoRemovido.qtd)
            let qtdVenda = parseInt(req.body.qtd)
            let qtdAtualizada = qtdEstoque + qtdVenda
            produtoRemovido.qtd = qtdAtualizada
            produtoRemovido.save()

            vendaAtualizada = await Venda.findByPk(vendaAtualizada.id);

            await VendaProduto.findAll({
                where: {
                    VendaId: vendaAtiva.id
                },
                include: [{
                    model: Produto
                }]
            }).then((data) => {
                const produtos = data.map((result) => result.get({ plain: true }))
                // res.render('venda/venda', { vendaAtiva: vendaAtualizada, produtosVendaAtiva: produtos });
                res.redirect(303, "/venda/criar/detalhes")
            })
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    static finalizarVenda(req, res) {
        // Encontra a venda ativa e o desconto 
        vendaAtiva = req.vendaAtiva.toJSON()
        const id = req.vendaAtiva.id // id da venda
        const desconto = parseFloat(req.body.desconto)

        // Se houver desconto, aplica na venda
        if (desconto) {
            let valorFinal = parseFloat(vendaAtiva.valorTotal - desconto)
            console.log("AAAAAAAAAAAAA " + valorFinal)
            vendaAtiva = {
                status: false,
                valorTotal: valorFinal
            }
        } else { // Caso não haja, finaliza a venda
            vendaAtiva = {
                status: false
            }
        }

        // Altera o status da venda para false
        Venda.update(vendaAtiva, { where: { status: true } }).then(() => {
            res.redirect('/venda/visualizar/'+id)
        })
            .catch((err) => console.log(err))
    }

    static editarVenda(req, res) {
        const id = req.params.id
        Venda.findOne({ where: { id: id }, raw: true })
            .then((venda) => {
                res.render('venda/editar', { venda })
            })
            .catch((err) => console.log(err))
    }

    static editarVendaPost(req, res) {
        const id = req.body.id
        const venda = {
            nomeVenda: req.body.nomeVenda,
            descricao: req.body.descricao,
            qtd: req.body.qtd,
            valorUnitario: req.body.valorUnitario,
        }
        Venda.update(venda, { where: { id: id } })
            .then(() => {
                res.redirect('/venda/')
            })
            .catch((err) => console.log(err))
    }

    static removerVenda(req, res) {
        const id = req.body.id
        Venda.destroy({ where: { id: id } })
            .then(() => {
                res.redirect('/venda')
            })
            .catch((err) => console.log(err))
    }

    static cancelarVenda(req, res) {
        Venda.destroy({ where: { status: true } })
            .then(() => {
                res.redirect('/venda')
            })
            .catch((err) => console.log(err))
    }

    static async mostrarDetalhes(req, res) {
        try {
            // Encontra a venda
            const id = req.params.id;
            let venda = await Venda.findOne({
                where: {
                    id: id,
                },
                include: [{
                    model: Cliente
                }]
            });

            let dadosVenda = {
                id: venda.id,
                status: venda.status,
                data: venda.data,
                valorTotal: venda.valorTotal,
                ClienteId: venda.ClienteId,
            }
            
            const dadosCliente = {
                id: venda.Cliente.id,
                nome: venda.Cliente.nome,
                cpfCnpj: venda.Cliente.cpfCnpj,
                telefone: venda.Cliente.telefone
            }

            const data = await VendaProduto.findAll({
                where: {
                    VendaId: venda.id
                },
                include: [{
                    model: Produto
                }]
            })

            const produtos = data.map((result) => result.get({ plain: true }))


            res.render("venda/visualizar", { venda: dadosVenda, cliente: dadosCliente, produtos: produtos });

        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }
} // Fim
