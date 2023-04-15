const express = require("express");
const router = express.Router();
const VendaController = require("../controllers/VendaController");
const getVendaAtiva = require("../middlewares/vendaAtiva")
const getProdutosVendaAtiva = require("../middlewares/produtosVendaAtiva")


router.get("/", VendaController.mostrarVendas);

// Rotas criação da venda
router.get("/criar", VendaController.criarVenda);
// router.get("/criar/procurarCliente", VendaController.procurarCliente)
router.post("/criar/detalhes", VendaController.criarVendaPost);
router.get("/criar/detalhes",getVendaAtiva, getProdutosVendaAtiva, VendaController.mostrarDetalhesVendaAtiva)
router.get('/criar/detalhes/procurar',getVendaAtiva, getProdutosVendaAtiva, VendaController.procurarProduto);
router.post('/criar/detalhes/add/:id',getVendaAtiva, VendaController.addProduto);
router.post('/criar/detalhes/remover/:produtoId',getVendaAtiva, VendaController.removerProduto)
router.post('/finalizar',getVendaAtiva, VendaController.finalizarVenda)
router.post("/cancelar", VendaController.cancelarVenda);



router.get("/editar/:id", VendaController.editarVenda);
router.post("/editarPost", VendaController.editarVendaPost);
router.post("/remover", VendaController.removerVenda);


module.exports = router;
