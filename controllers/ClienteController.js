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
                req.flash('mensagem', 'Produto criado com sucesso!')
            req.session.save(() => {
                res.redirect('/cliente/')
            })
        })
            .catch((err) => console.log(err))
    }

    static editarCliente(req, res) {
        const id = req.params.id
        Cliente.findOne({ where: { id: id }, raw: true })
            .then((cliente) => {
                res.render('cliente/editar', { cliente })
            })
            .catch((err) => console.log(err))
    }

    static editarClientePost(req, res) {
        const id = req.body.id
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
        Cliente.update(cliente, { where: { id: id } })
            .then(() => {
                req.flash('mensagem', 'Cliente editado com sucesso!')
                req.session.save(() => {
                res.redirect('/cliente')
            })
        })
            .catch((err) => console.log(err))
    }

    static removerCliente(req, res) {
        const id = req.body.id
        Cliente.destroy({ where: { id: id } })
            .then(() => {
                req.flash('mensagem', 'Cliente removido com sucesso!')
                req.session.save(() => {
                res.redirect('/cliente')
            })
        })
            .catch((err) => console.log(err))
    }

}
