const Venda = require('../models/Venda');

async function getVendaAtiva(req, res, next) {

    let vendaAtiva = await Venda.findOne({
      where: {
          status: true
      },
  })
     
    req.vendaAtiva = vendaAtiva;
    next();
}

module.exports = getVendaAtiva;