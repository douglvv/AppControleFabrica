const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const Venda = require('../models/Venda');

async function getVendaAtiva(req, res, next) {
  try {
    let vendaAtiva = await Venda.findOne({
      where: {
        status: true,
        UsuarioId: req.session.userid
      },
      include: [
        {
          model: Cliente
        },
        {
          model: Usuario
        }
      ]
    });

    req.vendaAtiva = vendaAtiva;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = getVendaAtiva;
