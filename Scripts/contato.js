document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formContato');
  const mensagemDiv = document.getElementById('mensagemContato');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) {
      mensagemDiv.innerHTML = '<div class="alert alert-danger">Preencha todos os campos.</div>';
      return;
    }

    fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, mensagem })
    })
      .then(res => res.json())
      .then(data => {
        if (data.mensagem) {
          mensagemDiv.innerHTML = `<div class="alert alert-success">${data.mensagem}</div>`;
          form.reset();
        } else {
          mensagemDiv.innerHTML = `<div class="alert alert-danger">Erro ao enviar mensagem.</div>`;
        }
      })
      .catch(() => {
        mensagemDiv.innerHTML = '<div class="alert alert-danger">Erro ao enviar mensagem.</div>';
      });
  });
});