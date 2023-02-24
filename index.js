const express = require("express");
const exphbs = require("express-handlebars");
// const session = require("express-session");
// const FileStore = require("session-file-store")(session);
// const flash = require("express-flash");

//Instancia o express,handlebars e mid dos formulários
const app = express();

const conn = require("./db/conn");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static('public'))

// Importa os Models para a criação das tabelas
const Cliente = require("./models/Cliente");
// const Usuario = require("./models/Usuario");
// const Produto = require("./models/Produto");
// const Pedido = require("./models/Pedido");
// const Pedido_Detalhe = require("./models/Pedido_Detalhe");

//Rota inicial da aplicação - antes do listen
app.get('/', function (req, res) {
    res.render('home')
   })

// Rota dos Models
const clienteRoutes = require("./routes/clienteRoutes");
app.use("/cliente", clienteRoutes);



//Inicia (escuta) a aplicação somente depois de conectar ao BD
conn
  .sync()
  .then(() => {
    app.listen(8080);
    console.log("Servidor rodando!")
  })
  .catch((err) => console.log(err));