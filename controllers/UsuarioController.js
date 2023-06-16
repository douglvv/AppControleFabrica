const { Op } = require('sequelize')
const Usuario = require('../models/Usuario.js')
const bcrypt = require('bcryptjs') // Criptografa a senha via hashmap


module.exports = class UsuarioController {
    static mostrarUsuarios(req, res) {
        try {
            // order resultados, novos registros primeiro
            let order = 'DESC'

            Usuario.findAll({
                order: [['createdAt', order]],
                limit: 1000,
            })
                .then((data) => {
                    let qtd = data.length

                    if (qtd === 0) {
                        qtd = false
                    }

                    const resultado = data.map((result) => result.get({ plain: true }))

                    res.render('usuario/listar', { resultado, qtd })
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }

    }

    static criarUsuario(req, res) {
        try {
            res.render('usuario/criar')
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

    static criarUsuarioPost(req, res) {
        try {
            // console.log(req.body)

            const salt = bcrypt.genSaltSync(10)
            const hashSenha = bcrypt.hashSync(req.body.senha, salt) //Cria o hash

            const usuario = {
                nome: req.body.nome,
                senha: hashSenha,
            }
            Usuario.create(usuario)
                .then(() => {
                    res.redirect('/usuario/')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

    static editarUsuario(req, res) {
        try {
            const id = req.params.id
            Usuario.findOne({ where: { id: id }, raw: true })
                .then((usuario) => {
                    res.render('usuario/editar', { usuario })
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

    static editarUsuarioPost(req, res) {
        const id = req.body.id

        const salt = bcrypt.genSaltSync(10)
        const hashSenha = bcrypt.hashSync(req.body.senha, salt) //cria o hash

        const usuario = {
            nome: req.body.nome,
            senha: hashSenha,
        }
        Usuario.update(usuario, { where: { id: id } })
            .then(() => {
                res.redirect('/usuario')
            })
            .catch((err) => console.log(err))
    }

    static removerUsuario(req, res) {
        try {
            const id = req.body.id
            Usuario.destroy({ where: { id: id } })
                .then(() => {
                    res.redirect('/usuario')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

    static async loginPost(req, res) {
        const nome = req.body.nome;
        const senha = req.body.senha;

        try {
            const usuario = await Usuario.findOne({ where: { nome: nome } });
            if (!usuario) {
                //req.flash('error', 'Usuário não encontrado!');
                res.redirect(303, '/login');

                return;
            }

            const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
            if (!senhaCorreta) {
                //req.flash('error', 'Senha inválida!');
                res.redirect(303, '/login');

                return;
            }

            req.session.userid = usuario.id;
            req.session.save(() => {
                res.redirect('/');
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro durante o login. Por favor, tente novamente.');
            res.redirect('/login');
        }
    }
} //Fim
