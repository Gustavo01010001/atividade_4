const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

let produtos = [];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: true
}));

// Rota inicial: Login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Login POST com usuário e senha fixos
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  // Simulando usuário e senha "salvos"
  const usuarioSalvo = {
    usuario: "admin",
    senha: "123"
  };

  if (usuario === usuarioSalvo.usuario && senha === usuarioSalvo.senha) {
    req.session.usuario = usuario;
    res.cookie('ultimoAcesso', new Date().toLocaleString());
    return res.redirect('/cadastro');
  }

  res.send('⚠️ Usuário ou senha inválidos. <a href="/">Tente novamente</a>');
});

// Página de Cadastro
app.get('/cadastro', (req, res) => {
  if (!req.session.usuario) {
    return res.send('⚠️ Você precisa estar logado para cadastrar um produto. <a href="/">Voltar</a>');
  }
  res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

// Cadastro de produto
app.post('/cadastrar-produto', (req, res) => {
  if (!req.session.usuario) return res.redirect('/');

  produtos.push(req.body);
  res.redirect('/produtos');
});

// Exibição dos produtos
app.get('/produtos', (req, res) => {
  if (!req.session.usuario) return res.redirect('/');

  const ultimo = req.cookies.ultimoAcesso || 'Nunca acessou antes';

  let html = `
    <h2>Olá, ${req.session.usuario}</h2>
    <p>🕓 Último acesso: ${ultimo}</p>
    <a href="/cadastro">Cadastrar novo produto</a><br><br>
    <table border="1" cellpadding="6">
      <tr>
        <th>Código</th><th>Descrição</th><th>Preço Custo</th><th>Preço Venda</th>
        <th>Validade</th><th>Estoque</th><th>Fabricante</th>
      </tr>
  `;
  

  produtos.forEach(p => {
    html += `
      <tr>
        <td>${p.codigo}</td>
        <td>${p.descricao}</td>
        <td>${p.preco_custo}</td>
        <td>${p.preco_venda}</td>
        <td>${p.validade}</td>
        <td>${p.estoque}</td>
        <td>${p.fabricante}</td>
      </tr>
    `;
  });

  html += '</table>';
  res.send(html);
});


if (require.main === module) {
  app.listen(PORT, () => console.log(`🟢 Servidor rodando em http://localhost:${PORT}`));
} else {
  module.exports = app;
}
