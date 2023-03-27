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
            valorTotal: 0,
            ClienteId: req.body.cliente
        }
        Venda.create(venda)
            .then(() => {
                res.render('venda/venda', { venda })
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
            res.render('venda/venda', { produtos })
        })
            .catch((err) => console.log(err))
    }

    static async addProduto(req, res) {
        const id = req.body.id; //id do produto
        const produto = await Produto.findByPk(id);

        // Verifica se o produto existe
        if (!produto) {
            res.status(404).send('Produto não encontrado.');
            return;
        }

        // Encontra a venda ativa
        const vendaAtiva = await Venda.findOne({
            where: {
                status: true
            }
        })
        // console.log(vendaAtiva)

        // Adiciona o produto a venda
        var vendaProduto = {
            qtd: 2,
            valor: produto.valorUnitario,
            VendaId: vendaAtiva.id,
            ProdutoId: produto.id
        }

        VendaProduto.create(vendaProduto)

        // Atualiza o valor total da venda
        var valorTotal = parseFloat(vendaAtiva.valorTotal);
        // console.log(valorTotal)
        
        valorTotal += (parseFloat(vendaProduto.qtd) * parseFloat(vendaProduto.valor))
        // console.log(valorTotal)

        const vendaAtualizada = {
            id: vendaAtiva.id,
            status: vendaAtiva.status,
            data: vendaAtiva.data,
            valorTotal: valorTotal
        }

        Venda.update(vendaAtualizada, {where: { status: true}})
            .then(() => {
            res.render('venda/venda', {vendaAtiva: vendaAtualizada})
            console.log("Deu boa")
        })
            .catch((err) => console.log(err))

        // // Update the quantity if the sale item already exists
        // if (!created2) {
        //     saleItem.quantity += 1;
        //     await saleItem.save();
        // }
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
                res.redirect('/venda')
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

    async buscarProduto(req, res) {
        let produto = await Produto.find({
            nomeProduto: req.body.nomeProduto
        });
        res.render('venda/criar', { produto })
    }

}
