const { Op } = require('sequelize')
const Cliente = require('../models/Cliente.js')
const Produto = require('../models/Produto.js')
const Venda = require('../models/Venda.js')

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
        console.log(req.body)
        const venda = {
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
            res.render('venda/venda', {produtos})
        })
        .catch((err) => console.log(err))
        // res.render('venda/venda', { produtos });

    }
      
        


    // async addProduto(req, res) {
    //     const { ProdutoId } = req.body.ProdutoId;
    //     const produto = await Produto.findByPk(ProdutoId);

    //     // Check if the produto exists
    //     if (!produto) {
    //         res.status(404).send('Produto não encontrado');
    //         return;
    //     }
    //     // Create or find the user's active sale
    //     const venda = await Venda.findByPk(58)
        
    //     const vendaProduto = await VendaProduto.findAll({
    //         where: {
    //           VendaId: venda.id,
    //           produtoId: produto.id
    //         }
    //       });
    
    // }

    // static async detalhesVenda(req, res) {
    //     vendaProdutos = VendaProdutos.findAll()
    //     let ordenar = 'ASC'
    //     Produtos.findAll({
    //         order: [['nome', ordenar]],
    //         limit: 1000,
    //     })
    //         .then((data) => {
    //             res.render('venda/criar', {
    //                 clientes, data_atual
    //             })
    //         })
    //         .catch((err) => console.log(err))
    // }

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
