const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
<<<<<<< HEAD
const bcrypt = require('bcryptjs')
//ol
//Instancia o express
=======

//Instancia o express,handlebars e mid dos formulários
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
const app = express();

const conn = require("./db/conn");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

<<<<<<< HEAD
// Middlewares
=======
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
<<<<<<< HEAD
app.use(express.static('public'))

// Middleware controle de sessão
=======

app.use(express.static('public'))
//middleware do controle de sessão
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
<<<<<<< HEAD
      logFn: function () { },
=======
      logFn: function () {},
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
<<<<<<< HEAD
  }),
)

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
app.get('/', verificaSessao, DashboardController.mostrarDashboard)

// Login
=======
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

>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
app.get('/login', function (req, res) {
  res.render('login', { layout: false });
});

// Logout
app.get('/logout', function (req, res) {
<<<<<<< HEAD
  req.session.destroy()
  res.redirect('/login')
})

// Função para criar um usuário temporário para o primeiro acesso
app.get('/primeiroAcesso', function(req, res) {
  const nome = 'modafoker' // Escolher nome do primeiro acesso
  const senha = 'modafoker' // Escolher senha do primeiro acesso
  const salt = bcrypt.genSaltSync(10)
  const hashSenha = bcrypt.hashSync(senha, salt) //Cria o hash

  const usuario = {
      nome: nome,
      senha: hashSenha,
  }
  Usuario.create(usuario)
      .then(() => {
          res.redirect('/')
      })
      .catch((err) => console.log(err))
})


//Rotas
=======
  req.session.destroy();
  res.redirect('/login');
});

//Rotas dos models
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
const clienteRoutes = require("./routes/clienteRoutes");
app.use("/cliente", clienteRoutes);

const produtoRoutes = require("./routes/produtoRoutes");
app.use("/produto", produtoRoutes);

<<<<<<< HEAD
const vendaRoutes = require("./routes/vendaRoutes");
app.use("/venda", vendaRoutes);

const relatorioRoutes = require("./routes/relatorioRoutes")
app.use("/relatorio", relatorioRoutes)

const usuarioRoutes = require("./routes/usuarioRoutes")
app.use("/usuario", usuarioRoutes)

// Rota para fazer o fetch dos dados para preencher o 
app.use("/dadosChart", verificaSessao, DashboardController.dadosChart)



//Inicia a aplicação somente depois de conectar na DB
=======
const usuarioRoutes = require("./routes/usuarioRoutes");
app.use("/usuario", usuarioRoutes);


//Inicia (escuta) a aplicação somente depois de conectar ao BD
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
conn
  .sync()
  .then(() => {
    app.listen(8080);
    console.log("Servidor rodando!")
  })
  .catch((err) => console.log(err));