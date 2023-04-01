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
        };
            res.render('venda/venda', { produtos, vendaAtiva: vendaAtiva});
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

        // Criar um middleware para executar na route antes do add produto para sempre ter o objeto de venda ativa
        // Encontra a venda ativa
        const vendaAtiva = req.vendaAtiva

        // Verifica se o produto já está na venda ativa
        const vendaProdutoExistente = await VendaProduto.findOne({
            where: {
                VendaId: vendaAtiva.id ,
                ProdutoId: produto.id
            }
        })

        if (vendaProdutoExistente) {
            // O produto já está na venda, incrementa a quantidade
            vendaProdutoExistente.qtd += req.body.qtd;
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

        // vendaproduto findall where idvenda = vendativa.id
        res.render('venda/venda',{vendaAtiva: vendaAtualizada})
        console.log(vendaAtiva)
        
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
