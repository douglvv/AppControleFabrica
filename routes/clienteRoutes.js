const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/ClienteController");
const verificaSessao = require("../middlewares/verificaSessao")

router.get("/", verificaSessao, ClienteController.mostrarClientes);
router.get("/criar",verificaSessao, ClienteController.criarCliente);
router.post("/criarPost", verificaSessao, ClienteController.criarClientePost);
router.get("/editar/:id", verificaSessao, ClienteController.editarCliente);
router.post("/editarPost", verificaSessao, ClienteController.editarClientePost);
router.post("/remover", verificaSessao, ClienteController.removerCliente);

module.exports = router;
