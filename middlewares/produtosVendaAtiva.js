const VendaProduto = require('../models/VendaProduto');
const Produto = require('../models/Produto');

async function getProdutosVendaAtiva(req, res, next) {
    vendaAtiva = req.vendaAtiva

    // Se existir uma venda ativa mapeia os produtos, caso não apenas continua
    if (vendaAtiva) {
        await VendaProduto.findAll({
            where: {
                VendaId: vendaAtiva.id
            },
            include: [{
                model: Produto
            }]
        }).then((data) => {
            const produtos = data.map((result) => result.get({ plain: true }))
            req.produtosVendaAtiva = produtos
        })
    }

    next();
}

module.exports = getProdutosVendaAtiva;