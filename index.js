const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
let produtos = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'meuSegredo', resave: false, saveUninitialized: true }));

// ⚠️ Tornar tudo estático somente após validar sessão
app.use('/public', express.static(path.join(__dirname, 'pages/public')));

function validarSessao(req, res, next) {
  if (req.session.usuario) next();
  else res.redirect('/');
}

// Página de login (liberada)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/public', 'login.html'));
});

// Página de cadastro (protegida)
app.get('/cadastro', validarSessao, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/public', 'cadastro.html'));
});

// Login
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === 'admin' && senha === '123') {
    req.session.usuario = usuario;
    res.cookie('ultimoAcesso', new Date().toLocaleString());
    res.redirect('/cadastro');
  } else {
    res.send('Login inválido!');
  }
});

// API protegida
app.get('/produtos', validarSessao, (req, res) => {
  res.json({
    produtos,
    ultimoAcesso: req.cookies.ultimoAcesso || 'Primeiro acesso'
  });
});

app.post('/produtos', validarSessao, (req, res) => {
  produtos.push(req.body);
  res.status(200).send('Produto cadastrado');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
