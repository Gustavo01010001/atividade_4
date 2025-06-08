
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastro');
  const tabela = document.getElementById('tabelaProdutos');
  const ultimoAcesso = document.getElementById('ultimoAcesso');

  fetch('/produtos')
    .then(res => res.json())
    .then(data => {
      if (data.ultimoAcesso) {
        ultimoAcesso.innerText = "Último acesso: " + data.ultimoAcesso;
      }
      data.produtos.forEach(prod => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${prod.codigo}</td>
          <td>${prod.descricao}</td>
          <td>${prod.precoCusto}</td>
          <td>${prod.precoVenda}</td>
          <td>${prod.validade}</td>
          <td>${prod.estoque}</td>
          <td>${prod.fabricante}</td>
        `;
        tabela.appendChild(tr);
      });
    });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    fetch('/produtos', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    }).then(() => location.reload());
  });
});
