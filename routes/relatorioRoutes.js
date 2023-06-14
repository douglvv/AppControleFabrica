const express = require("express");
const router = express.Router();
const RelatorioController = require("../controllers/RelatorioController");
const verificaSessao = require("../middlewares/verificaSessao")

router.get('/',verificaSessao, function(req, res){res.render('relatorio/criar')})
router.get('/faturamento', verificaSessao, RelatorioController.gerarRelatorioFaturamento)


module.exports = router;
