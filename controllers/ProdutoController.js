const { Op } = require('sequelize')
const Produto = require('../models/Produto.js')

module.exports = class ProdutoController {
    static mostrarProdutos(req, res) {
        try {
            // order resultados, novos registros primeiro
            let order = 'DESC'

            Produto.findAll({
                order: [['createdAt', order]],
                limit: 1000,
            })
                .then((data) => {
                    let qtd = data.length

                    if (qtd === 0) {
                        qtd = false
                    }

                    const resultado = data.map((result) => result.get({ plain: true }))

                    res.render('produto/listar', { resultado, qtd })
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message)
        }
    }

    static criarProduto(req, res) {
        try {
            res.render('produto/criar')
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

    static criarProdutoPost(req, res) {
        try {
            // console.log(req.body)
            const produto = {
                nomeProduto: req.body.nomeProduto,
                descricao: req.body.descricao,
                qtd: req.body.qtd,
                valorUnitario: req.body.valorUnitario,
            }
            Produto.create(produto)
                .then(() => {
                    res.redirect('/produto/')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

    static editarProduto(req, res) {
        try {
            const id = req.params.id
            Produto.findOne({ where: { id: id }, raw: true })
                .then((produto) => {
                    res.render('produto/editar', { produto })
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

    static editarProdutoPost(req, res) {
        try {
            const id = req.body.id
            const produto = {
                nomeProduto: req.body.nomeProduto,
                descricao: req.body.descricao,
                qtd: req.body.qtd,
                valorUnitario: req.body.valorUnitario,
            }
            Produto.update(produto, { where: { id: id } })
                .then(() => {
                    res.redirect('/produto')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

    static removerProduto(req, res) {
        try {
            const id = req.body.id
            Produto.destroy({ where: { id: id } })
                .then(() => {
                    res.redirect('/produto')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

}
