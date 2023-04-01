const { verificaSessao } = require("../helpers/sessao");
const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");

router.get("/",verificaSessao,ProdutoController.mostrarProdutos);
router.get("/criar", verificaSessao,ProdutoController.criarProduto);
router.post("/criarPost", verificaSessao,ProdutoController.criarProdutoPost);
router.get("/editar/:id", verificaSessao,ProdutoController.editarProduto);
router.post("/editarPost", verificaSessao,ProdutoController.editarProdutoPost);
router.post("/remover", verificaSessao,ProdutoController.removerProduto);

module.exports = router;
