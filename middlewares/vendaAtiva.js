const Cliente = require('../models/Cliente');
const Venda = require('../models/Venda');

async function getVendaAtiva(req, res, next) {
    
    let vendaAtiva = await Venda.findOne({
      where: {
          status: true
      },
      include: [{
        model: Cliente
      }]
  })
     
    req.vendaAtiva = vendaAtiva;
    next();
}

module.exports = getVendaAtiva;