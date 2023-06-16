const { Op } = require('sequelize')
const Venda = require('../models/Venda.js')
const Cliente = require('../models/Cliente.js')

module.exports = class ProdutoController {

    static async gerarRelatorioFaturamento(req, res) {
        try {
            const dataInicial = req.query.dataInicial
            const dataFinal = req.query.dataFinal
            // console.log('data inicial: ' + dataInicial + "\tdata final: " + dataFinal + "\n")

            const data = await Venda.findAll({
                where: {
                    data: {
                        [Op.between]: [dataInicial, dataFinal],
                    },
                },
                include: [
                    {
                        model: Cliente
                    },
                ],
            })

            const resultado = data.map((result) => result.get({ plain: true }))
            // console.log(resultado)
            res.render('relatorio/relatorio', { resultado: resultado })
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }

}// Fim da classe
