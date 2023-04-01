const Venda = require('../models/Venda');

async function getVendaAtiva(req, res, next) {

    let vendaAtiva = await Venda.findOne({
      where: {
          status: true
      },
      //adicionar aqui vendaProduto {{tem que fazer o relacionamento superManytoMany}}
  })
    
    req.vendaAtiva = vendaAtiva;
    res.locals.vendaAtiva = vendaAtiva
    next();

}

module.exports = getVendaAtiva;