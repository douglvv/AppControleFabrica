const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

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
//middleware do controle de sessão
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);
  // flash messages
app.use(flash());

// Importa os Models para a criação das tabelas
const Cliente = require("./models/Cliente");
const Produto = require("./models/Produto");
const Usuario = require("./models/Usuario");

//importa verifica sessao

const verificaSessao = require("./helpers/sessao").verificaSessao;

//Rota inicial da aplicação - antes do listen
// const newLocal = app.get('/', function (req, res) {
//   if (!req.session.user) {
//     res.redirect('/login');
//   } else {
//     res.render('views\home');
//   }
// });

app.get('/', function (req, res) {
  if (verificaSessao) {
    res.render('home');
  } else {
    res.redirect('/login');
  
  }
});

app.get('/login', function (req, res) {
  res.render('login', { layout: false });
});

// Logout
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login');
});

//Rotas dos models
const clienteRoutes = require("./routes/clienteRoutes");
app.use("/cliente", clienteRoutes);

const produtoRoutes = require("./routes/produtoRoutes");
app.use("/produto", produtoRoutes);

const usuarioRoutes = require("./routes/usuarioRoutes");
app.use("/usuario", usuarioRoutes);


//Inicia (escuta) a aplicação somente depois de conectar ao BD
conn
  .sync()
  .then(() => {
    app.listen(8080);
    console.log("Servidor rodando!")
  })
  .catch((err) => console.log(err));