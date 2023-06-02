const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

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

// Middleware controle de sessão
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () { },
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
)
// Flash messages
app.use(flash());


// Models
const Cliente = require("./models/Cliente");
const Produto = require("./models/Produto")
const Venda = require("./models/Venda")
const VendaProduto = require("./models/VendaProduto")
const Usuario = require("./models/Usuario")


//Rota inicial
const verificaSessao = require("./middlewares/verificaSessao")
const DashboardController = require("./controllers/DashboardController")
app.get('/', verificaSessao , DashboardController.mostrarDashboard)

app.get('/login', function (req, res) {
  res.render('login', { layout: false })
})


//Rotas
const clienteRoutes = require("./routes/clienteRoutes");
app.use("/cliente", clienteRoutes);

const produtoRoutes = require("./routes/produtoRoutes");
app.use("/produto", produtoRoutes);

const vendaRoutes = require("./routes/vendaRoutes");
app.use("/venda", vendaRoutes);

const relatorioRoutes = require("./routes/relatorioRoutes")
app.use("/relatorio", relatorioRoutes)

const usuarioRoutes = require("./routes/usuarioRoutes")
app.use("/usuario", usuarioRoutes)

// Rota para fazer o fetch dos dados para preencher o 
app.use("/dadosChart", DashboardController.dadosChart)


//Inicia a aplicação somente depois de conectar na DB
conn
  .sync()
  .then(() => {
    app.listen(8080);
    console.log("Servidor rodando!")
  })
  .catch((err) => console.log(err));