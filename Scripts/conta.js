// Verifica se o usuário está logado
if (!localStorage.getItem('conta_id')) {
  window.location.href = '/Views/Login.html';
}

document.addEventListener("DOMContentLoaded", () => {
  // Recupera id e tipo da conta do localStorage
  const contaId = localStorage.getItem('conta_id');
  const contaTipo = localStorage.getItem('conta_tipo');

  // Função para buscar dados da conta
  function carregarConta() {
    if (!contaId) {
      alert('Usuário não autenticado!');
      window.location.href = '/Views/Login.html';
      return;
    }
    fetch(`/api/contas/${contaId}`)
      .then(res => res.json())
      .then(conta => {
        document.getElementById("nomeUsuario").textContent = conta.nome || "Usuário";
        document.getElementById("emailUsuario").textContent = conta.email || "";
        document.getElementById("avatarLetra").textContent = (conta.nome ? conta.nome.charAt(0).toUpperCase() : "U");
        document.getElementById("infoNome").textContent = conta.nome || "";
        document.getElementById("infoEmail").textContent = conta.email || "";
        document.getElementById("infoTelefone").textContent = conta.telefone || "";
        document.getElementById("infoEndereco").textContent = conta.endereco || "";
        document.getElementById("infoCpfCnpj").innerHTML = conta.cpf
          ? `<strong>CPF:</strong> <span>${conta.cpf}</span>`
          : (conta.cnpj ? `<strong>CNPJ:</strong> <span>${conta.cnpj}</span>` : "");
      });

    document.getElementById('btnSairConta').addEventListener('click', function() {
      localStorage.removeItem('conta_id');
      localStorage.removeItem('conta_tipo');
      localStorage.removeItem('conta_nome');
      localStorage.removeItem('conta_email');
      window.location.href = '/Views/Login.html';
    });
  }

  carregarConta();

  // Mostrar dados da conta
  document.getElementById("btnVerDados").onclick = () => {
    window.location.href = "/Views/DadosConta.html";
  };
  document.getElementById("btnFecharDados").onclick = () => {
    document.getElementById("dadosConta").style.display = "none";
  };

  // Alterar senha (implemente depois)
  document.getElementById("btnAlterarSenha").onclick = () => {
    alert("Funcionalidade de alteração de senha em breve!");
  };

  // Redireciona para a página de doações correta conforme o tipo de conta
  document.getElementById("btnVerDoacoes").onclick = () => {
    const contaTipo = localStorage.getItem('conta_tipo');
    if (contaTipo === 'ong') {
      window.location.href = "/Views/doacoesRecebidas.html";
    } else {
      window.location.href = `/Views/ListarDoacao.html?tipo=${contaTipo}`;
    }
  };
});