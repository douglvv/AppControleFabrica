const express = require("express");
const router = express.Router();
const VendaController = require("../controllers/VendaController");
const getVendaAtiva = require("../middlewares/vendaAtiva")

router.get("/", VendaController.mostrarVendas);
router.get("/criar", VendaController.criarVenda);
router.post("/criarPost", VendaController.criarVendaPost);
router.get("/editar/:id", VendaController.editarVenda);
router.post("/editarPost", VendaController.editarVendaPost);
router.post("/remover", VendaController.removerVenda);
router.post('/procurarProduto',getVendaAtiva, VendaController.procurarProduto);
router.post('/addProduto',getVendaAtiva, VendaController.addProduto);

module.exports = router;
