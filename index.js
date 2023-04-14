const express = require("express");
const exphbs = require("express-handlebars");
// const session = require("express-session");
// const FileStore = require("session-file-store")(session);
// const flash = require("express-flash");

//Instancia o express
const app = express();

const conn = require("./db/conn");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(express.static('public'))


// Models
const Cliente = require("./models/Cliente");
const Produto = require("./models/Produto")
const Venda = require("./models/Venda")
const VendaProduto = require("./models/VendaProduto")


//Rota inicial
app.get('/', function (req, res) {
  res.render('home')
})

//Rotas dos models
const clienteRoutes = require("./routes/clienteRoutes");
app.use("/cliente", clienteRoutes);

const produtoRoutes = require("./routes/produtoRoutes");
app.use("/produto", produtoRoutes);

const vendaRoutes = require("./routes/vendaRoutes");
app.use("/venda", vendaRoutes);


//Inicia a aplicação somente depois de conectar na DB
conn
  .sync()
  .then(() => {
    app.listen(8080);
    console.log("Servidor rodando!")
  })
  .catch((err) => console.log(err));