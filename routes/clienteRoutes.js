const express = require("express");
const router = express.Router();
const ClienteController = require("../controllers/ClienteController");
<<<<<<< HEAD
const verificaSessao = require("../middlewares/verificaSessao")

router.get("/", verificaSessao, ClienteController.mostrarClientes);
=======
const { verificaSessao } = require("../helpers/sessao");

router.get("/",verificaSessao, ClienteController.mostrarClientes);
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
router.get("/criar",verificaSessao, ClienteController.criarCliente);
router.post("/criarPost", verificaSessao, ClienteController.criarClientePost);
router.get("/editar/:id", verificaSessao, ClienteController.editarCliente);
router.post("/editarPost", verificaSessao, ClienteController.editarClientePost);
<<<<<<< HEAD
router.post("/remover", verificaSessao, ClienteController.removerCliente);
=======
router.post("/remover",ClienteController.removerCliente);
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763

module.exports = router;
