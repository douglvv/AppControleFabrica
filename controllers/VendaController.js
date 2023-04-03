const { Op } = require('sequelize')
const Cliente = require('../models/Cliente.js')
const Produto = require('../models/Produto.js')
const Venda = require('../models/Venda.js')
const VendaProduto = require('../models/VendaProduto.js')
const getProdutosVendaAtiva = require("../middlewares/produtosVendaAtiva")

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

    static criarVendaPost(req, res) {
        const venda = {
            status: true,
            data: req.body.data,
            valorTotal: 0.00,
            ClienteId: req.body.cliente
        }
        Venda.create(venda)
            .then(() => {
                res.render('venda/venda', { vendaAtiva: venda })
            })
            .catch((err) => console.log(err))
    }

    static async procurarProduto(req, res) {
        let nomeProduto = '';
        if (req.body.nomeProduto) {
            nomeProduto = req.body.nomeProduto.trim();
        }
        await Produto.findAll({
            where: {
                nomeProduto: {
                    [Op.like]: `%${nomeProduto}%` // case-insensitive search
                },
            }
        }).then((data) => {
            const produtos = data.map((result) => result.get({ plain: true }))
            const vendaAtiva = {
                status: req.vendaAtiva.status,
                data: req.vendaAtiva.data,
                valorTotal: req.vendaAtiva.valorTotal,
                ClienteId: req.vendaAtiva.ClienteId
            }
            let produtosVendaAtiva = req.produtosVendaAtiva
            // console.log(produtosVendaAtiva)
            res.render('venda/venda', { produtos, vendaAtiva: vendaAtiva, produtosVendaAtiva: produtosVendaAtiva });
        })
            .catch((err) => console.log(err))
    }

    static async addProduto(req, res) {
        const id = req.body.id; //id do produto
        const produto = await Produto.findByPk(id);

        // Verifica se o produto existe
        if (!produto) {
            res.status(404).send('Produto não encontrado.');
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

        // Atualiza o valor total da venda
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

        let produtosVendaAtiva = req.produtosVendaAtiva

        res.render('venda/venda', { vendaAtiva: vendaAtualizada, produtosVendaAtiva: produtosVendaAtiva })

    }

    // static async removerProduto(req, res){
    //     let VendaId = req.vendaAtiva.id
    //     const ProdutoId = req.body.id
    //     await VendaProduto.destroy({where: { VendaId: VendaId, ProdutoId: ProdutoId }}).then(() => {
    //         res.render('venda/venda')
    //     })
    //     .catch((err) => console.log(err))

    // }

    static async removerProduto(req, res) {
        try {
            const vendaId = req.vendaAtiva.id;
            const produtoId = req.body.ProdutoId;
            console.log(produtoId)

            await VendaProduto.destroy({
                where: {
                    VendaId: vendaId,
                    ProdutoId: produtoId
                }
            })

            // Atualiza o valor total da venda
            let vendaAtualizada = req.vendaAtiva;
            const produtoRemovido = await Produto.findByPk(produtoId);
            const valorRemovido = parseFloat(produtoRemovido.valorUnitario * req.body.qtd);
            console.log('valor Removido = '+ valorRemovido)

            // Atualiza o valor total da venda
            let valorTotal = parseFloat(req.vendaAtiva.valorTotal)
            valorTotal = parseFloat(req.vendaAtiva.valorTotal) - valorRemovido;

            vendaAtualizada = {
                id: vendaAtiva.id,
                status: vendaAtiva.status,
                data: vendaAtiva.data,
                valorTotal: valorTotal
            };

            await Venda.update(vendaAtualizada, { where: { status: true } })
            vendaAtiva.save()

            vendaAtualizada = await Venda.findByPk(vendaAtualizada.id);

            let produtosVendaAtiva = await VendaProduto.findAll({
                where: { VendaId: vendaId },
                include: [Produto]
            });

            res.render('venda/venda', { vendaAtiva: vendaAtualizada, produtosVendaAtiva: produtosVendaAtiva });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }


    static finalizarVenda(req, res) {
        vendaAtiva = {
            status: false
        }
        Venda.update(vendaAtiva, { where: { status: true } }).then(() => {
            res.redirect('/venda')
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
}
