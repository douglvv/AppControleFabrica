const { Op } = require('sequelize')
const Cliente = require('../models/Cliente.js')

module.exports = class ClienteController {
    static mostrarClientes(req, res) {

        try {
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
        } catch (error) {
            console.log(error.message);
            res.send(error.message)
        }
    }

    static criarCliente(req, res) {
        try {
            res.render('cliente/criar')
        } catch (error) {
            console.log(error.message)
            res.send(error.message)
        }
    }

    static criarClientePost(req, res) {
        try {
            // console.log(req.body)
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
        } catch (error) {
            console.log(error.message)
            res.send(error.message)
        }
    }

    static editarCliente(req, res) {
        try {
            const id = req.params.id
            Cliente.findOne({ where: { id: id }, raw: true })
                .then((cliente) => {
                    res.render('cliente/editar', { cliente })
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message)
        }
    }

    static editarClientePost(req, res) {
        try {
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
                    res.redirect('/cliente')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message)
            res.send(error.message)
        }
    }

    static removerCliente(req, res) {
        try {
            const id = req.body.id
            Cliente.destroy({ where: { id: id } })
                .then(() => {
                    res.redirect('/cliente')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message)
        }
    }

}
