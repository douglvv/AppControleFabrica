const { Op } = require('sequelize')
const Cliente = require('../models/Cliente.js')
const Usuario = require('../models/Usuario.js')
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
            },
            {
                model: Usuario,
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
                resultado.forEach((item) => {
                    item.data = item.data.toLocaleString('pt-br')
                })
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

    static async procurarCliente(req, res) {
        try {
            let cliente = '';
            if (req.query.cliente) {
                cliente = req.query.cliente.trim();
            }
            const clientes = await Cliente.findAll({
                where: {
                    [Op.or]: [
                        {
                            nome: {
                                [Op.like]: `%${cliente}%`
                            }
                        },
                        {
                            cpfCnpj: {
                                [Op.like]: `%${cliente}%`
                            }
                        }
                    ]
                }
            });
            res.json({ clientes: clientes });
        } catch (error) {
            res.status(500).send("Erro interno, por favor tente novamente")
            console.log(error)
        }
    }

    static criarVendaPost(req, res) {
        const venda = {
            status: true,
            data: req.body.data,
            valorTotal: 0.00,
            UsuarioId: req.session.userid,
            ClienteId: req.body.clienteId,
            formaPagamento: ""
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
        console.log(vendaAtiva)
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
                [Op.or]: [
                    { nomeProduto: { [Op.like]: `%${produto}%` } },
                    { id: { [Op.like]: `%${produto}%` } }
                ]
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

        await Venda.update(vendaAtualizada, { where: { status: true, UsuarioId: req.session.userid } })
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

            await Venda.update(vendaAtualizada, { where: { status: true, UsuarioId: req.session.userid } })

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
        // Encontra a venda ativa ,desconto  e forma de pagamento
        vendaAtiva = req.vendaAtiva.toJSON()
        const id = req.vendaAtiva.id // id da venda
        const desconto = parseFloat(req.body.desconto)
        const formaPagamento = req.body.formaPagamento

        // Se houver desconto, aplica na venda
        if (desconto) {
            let valorFinal = parseFloat(vendaAtiva.valorTotal - desconto)
            vendaAtiva = {
                status: false,
                valorTotal: valorFinal,
                formaPagamento: formaPagamento
            }
        } else { // Caso não haja, finaliza a venda
            vendaAtiva = {
                status: false,
                formaPagamento: formaPagamento
            }
        }

        // Altera o status da venda para false
        Venda.update(vendaAtiva, { where: { status: true, UsuarioId: req.session.userid } }).then(() => {
            res.redirect('/venda/visualizar/' + id)
        })
            .catch((err) => console.log(err))
    }

    static async removerVenda(req, res) {
        const vendaId = req.body.id;

        try { // Encontra os produtos da venda a ser excluida
            const response = await VendaProduto.findAll({
                where: {
                    VendaId: vendaId
                },
                include: [{
                    model: Produto
                }]
            });

            const produtos = response.map((result) => result.get({ plain: true })); // Mapeia os produtos numa array
            // console.log(produtos)

            for (const item of produtos) { // Loop para percorrer todos os produtos
                const qtd = item.qtd;
                let qtdEstoque = item.Produto.qtd
                const qtdAtualizada = qtdEstoque += qtd
                const produtoId = item.ProdutoId;

                await Produto.update( // Adiciona novamente os produtos ao estoque
                    { qtd: qtdAtualizada },
                    { where: { id: produtoId } }
                )
            }

            await Venda.destroy({ where: { id: vendaId } }); // Excluida a venda

            res.redirect('/venda');
        } catch (error) {
            console.log(error);
            res.status(404).send('Erro ao excluir a venda. \n' + error)
        }
    }

    static cancelarVenda(req, res) {
        Venda.destroy({ where: { status: true, UsuarioId: req.session.userid } })
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
                },
                {
                    model: Usuario
                },
                ]
            });

            let dadosVenda = {
                id: venda.id,
                status: venda.status,
                data: venda.data,
                valorTotal: venda.valorTotal,
                formaPagamento: venda.formaPagamento,
                ClienteId: venda.ClienteId,
            }

            const dadosCliente = {
                id: venda.Cliente.id,
                nome: venda.Cliente.nome,
                cpfCnpj: venda.Cliente.cpfCnpj,
                telefone: venda.Cliente.telefone
            }

            const dadosUsuario = {
                id: venda.Usuario.id,
                nome: venda.Usuario.nome
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


            res.render("venda/visualizar", { venda: dadosVenda, cliente: dadosCliente, produtos: produtos, vendedor: dadosUsuario });

        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }
} // Fim
