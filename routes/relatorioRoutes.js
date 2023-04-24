const express = require("express");
const router = express.Router();
const RelatorioController = require("../controllers/RelatorioController");

router.get('/', function(req, res){res.render('relatorio/criar')})
router.get('/faturamento', RelatorioController.gerarRelatorioFaturamento)
// router.get("/criar", RelatorioController.criarRelatorio);
// router.post("/criarPost", RelatorioController.criarRelatorioPost);
// router.get("/editar/:id", RelatorioController.editarRelatorio);
// router.post("/editarPost", RelatorioController.editarRelatorioPost);
// router.post("/remover", RelatorioController.removerRelatorio);

module.exports = router;
