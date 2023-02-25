const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/ClienteController");

router.get("/", ClienteController.mostrarClientes);
router.get("/criar", ClienteController.criarCliente);
router.post("/criarPost", ClienteController.criarClientePost);
router.get("/editar/:id", ClienteController.editarCliente);
router.post("/editarPost", ClienteController.editarClientePost);
router.post("/remover", ClienteController.removerCliente);

module.exports = router;
