const express = require("express");
const router = express.Router();
const VendaController = require("../controllers/VendaController");
const getVendaAtiva = require("../middlewares/vendaAtiva")
const getProdutosVendaAtiva = require("../middlewares/produtosVendaAtiva")

router.get("/", VendaController.mostrarVendas);
router.get("/criar", VendaController.criarVenda);
router.post("/criarPost", VendaController.criarVendaPost);
router.get("/editar/:id", VendaController.editarVenda);
router.post("/editarPost", VendaController.editarVendaPost);
router.post("/remover", VendaController.removerVenda);
router.post('/procurarProduto',getVendaAtiva, getProdutosVendaAtiva, VendaController.procurarProduto);
router.post('/addProduto',getVendaAtiva, getProdutosVendaAtiva, VendaController.addProduto);
router.post('/finalizar', VendaController.finalizarVenda)
router.post('/removerProduto',getVendaAtiva, VendaController.removerProduto)


module.exports = router;
