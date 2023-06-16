<<<<<<< HEAD
const { Op } = require('sequelize')
const Usuario = require('../models/Usuario.js')
const bcrypt = require('bcryptjs') // Criptografa a senha via hashmap

=======
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs') //importa o bcrypt para criptografar

const { Op } = require('sequelize')
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763

module.exports = class UsuarioController {
    static mostrarUsuarios(req, res) {

        // order resultados, novos registros primeiro
<<<<<<< HEAD
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
    }

    static criarUsuario(req, res) {
        res.render('usuario/criar')
    }

    static criarUsuarioPost(req, res) {
        console.log(req.body)

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
    }

    static editarUsuario(req, res) {
        const id = req.params.id
        Usuario.findOne({ where: { id: id }, raw: true })
            .then((usuario) => {
                res.render('usuario/editar', { usuario })
            })
            .catch((err) => console.log(err))
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
        const id = req.body.id
        Usuario.destroy({ where: { id: id } })
            .then(() => {
                res.redirect('/usuario')
            })
            .catch((err) => console.log(err))
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
=======
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
}

static criarUsuario(req, res) {
    res.render('usuario/criar')
}

static criarUsuarioPost(req, res) {
    const salt = bcrypt.genSaltSync(10)
    const hashSenha = bcrypt.hashSync(req.body.senha, salt) //Cria o hash

    const usuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: hashSenha,
    }
    Usuario.create(usuario)
        .then(() => {
            res.redirect('/usuario/')
        
    })
        .catch((err) => console.log(err))
}

static editarUsuario(req, res) {
    const id = req.params.id
    Usuario.findOne({ where: { id: id }, raw: true })
        .then((usuario) => {
            res.render('usuario/editar', { usuario })
        })
        .catch((err) => console.log(err))
}

static editarUsuarioPost(req, res) {
    const id = req.body.id
    const salt = bcrypt.genSaltSync(10) 
    const hashSenha = bcrypt.hashSync(req.body.senha, salt) //Cria o hash


    const usuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: hashSenha,
    }
    Usuario.update(usuario, { where: { id: id } })
        .then(() => {
            res.redirect('/usuario')
        })
        .catch((err) => console.log(err))
}

static removerUsuario(req, res) {
    const id = req.body.id
    Usuario.destroy({ where: { id: id } })
        .then(() => {
            res.redirect('/usuario')
        })
        .catch((err) => console.log(err))
    

}

static async loginPost(req, res) {
    const email = req.body.email
    const senha = req.body.senha
// localiza o usuario
    const usuario = await Usuario.findOne({ where: { email: email } })
    if (!usuario) {
        res.render('login', {
            mensagem: 'usuário não encontrado!', layout: false,
        })
    return
}
// compara a senha
const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)
if (!senhaCorreta) {
    res.render('login', {
        mensagem: 'Senha inválida!', layout: false,
    })
    return
}
// cria sessão do usuário
req.session.userid = usuario.id
req.session.save(() => {
    res.redirect('/')
})
}
}
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
