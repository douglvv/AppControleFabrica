const { Op } = require('sequelize')
const Cliente = require('../models/Cliente.js')

module.exports = class ClienteController {
    static mostrarClientes(req, res) {

        // order resultados, novos registros primeiro
        let order = 'DESC'

        Cliente.findAll({
            order: [['createdAt', order]],
            limit: 1000,
        })
            .then((data) => {
                let qtd = data.length

                if (qtd === 0) {
                    qtd = false
                }

                const resultado = data.map((result) => result.get({ plain: true }))

                res.render('cliente/listar', { resultado, qtd })
            })
            .catch((err) => console.log(err))
    }

    static criarCliente(req, res) {
        res.render('cliente/criar')
    }

    static criarClientePost(req, res) {
        console.log(req.body)
        const cliente = {
            tipo: req.body.tipo,
            nome: req.body.nome,
            cpfCnpj: req.body.cpfCnpj,
            rua: req.body.rua,
            numeroCasa: req.body.numeroCasa,
            complemento: req.body.complemento,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            uf: req.body.uf,
            email: req.body.email,
            telefone: req.body.telefone,
        }
        Cliente.create(cliente)
            .then(() => {
                res.redirect('/cliente/')
            })
            .catch((err) => console.log(err))
    }



}
