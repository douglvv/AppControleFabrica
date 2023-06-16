const express = require("express");
const router = express.Router();
const VendaController = require("../controllers/VendaController");
const getVendaAtiva = require("../middlewares/vendaAtiva")
const getProdutosVendaAtiva = require("../middlewares/produtosVendaAtiva")
const verificaSessao = require("../middlewares/verificaSessao")


router.get("/",verificaSessao, VendaController.mostrarVendas);
router.get("/criar",verificaSessao, VendaController.criarVenda);
router.get("/criar/procurarCliente",verificaSessao, VendaController.procurarCliente)
router.post("/criar/detalhes",verificaSessao, VendaController.criarVendaPost);
router.get("/criar/detalhes",verificaSessao,getVendaAtiva, getProdutosVendaAtiva, VendaController.mostrarDetalhesVendaAtiva)
router.get('/criar/detalhes/procurar',verificaSessao,getVendaAtiva, getProdutosVendaAtiva, VendaController.procurarProduto);
router.post('/criar/detalhes/add/:id',verificaSessao,getVendaAtiva, VendaController.addProduto);
router.post('/criar/detalhes/remover/:produtoId',verificaSessao,getVendaAtiva, VendaController.removerProduto)
router.post('/finalizar',verificaSessao,getVendaAtiva, VendaController.finalizarVenda)
router.post("/cancelar", verificaSessao,VendaController.cancelarVenda);
router.get("/visualizar/:id",verificaSessao, VendaController.mostrarDetalhes)
router.post("/remover",verificaSessao, VendaController.removerVenda);


module.exports = router;
