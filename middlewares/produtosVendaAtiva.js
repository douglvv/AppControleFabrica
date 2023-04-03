const VendaProduto = require('../models/VendaProduto');
const Produto = require('../models/Produto');

async function getProdutosVendaAtiva(req, res, next) {
    vendaAtiva = req.vendaAtiva

    if (vendaAtiva) {
        await VendaProduto.findAll({
            where: {
                VendaId: vendaAtiva.id// replace with the ID of the venda you want to map
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