// Verificação de autenticação e tipo de usuário para página de doação
const contaId = localStorage.getItem('conta_id');
const contaTipo = localStorage.getItem('conta_tipo');
if (!contaId) {
  window.location.href = '/Views/Login.html';
} else if (contaTipo !== 'doador') {
  alert('Você precisa estar logado como doador para realizar a doação.');
  window.location.href = '/Views/Login.html';
}

document.addEventListener('DOMContentLoaded', function () {
  // Preenche o select de ONGs dinamicamente
  fetch('/api/ongs')
    .then(res => res.json())
    .then(ongs => {
      const selectOng = document.getElementById('ong');
      ongs.forEach(ong => {
        const option = document.createElement('option');
        option.value = ong.id || ong.IDong;
        option.textContent = ong.nome;
        selectOng.appendChild(option);
      });
    });

  const form = document.getElementById('formDoacao');
  const inputVencimento = document.getElementById('vencimento');
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.color = 'red';
  errorElement.style.marginTop = '5px';
  inputVencimento.parentNode.appendChild(errorElement);

  // Adiciona feedback visual
  inputVencimento.addEventListener('input', function () {
    this.style.borderColor = '';
    errorElement.textContent = '';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;
    const vencimento = inputVencimento.value.trim();
    const dataVencimento = new Date(vencimento);
    const dataAtual = new Date();

    // Resetando os estilos e erros
    inputVencimento.style.borderColor = '';
    errorElement.textContent = '';

    // Validando se a data foi inserida
    if (!vencimento) {
      showError("Por favor, insira a data de vencimento do alimento.");
      isValid = false;
    }
    // Validando se a data é inválida
    else if (isNaN(dataVencimento.getTime())) {
      showError("Data de vencimento inválida. Use o formato AAAA-MM-DD.");
      isValid = false;
    }
    else {
      // Resetando as horas para comparar apenas as datas
      dataAtual.setHours(0, 0, 0, 0);
      dataVencimento.setHours(0, 0, 0, 0);

      // Verificando se o alimento está vencido
      if (dataVencimento < dataAtual) {
        showError("Não é possível doar alimentos vencidos.");
        isValid = false;
      }
      // Verificando se a validade é de pelo menos 2 dias
      else {
        const diffEmMs = dataVencimento - dataAtual;
        const diffEmDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

        if (diffEmDias <= 1) {
          showError("A validade do alimento deve ser de pelo menos 2 dias a partir de hoje.");
          isValid = false;
        }
      }
    }

    // Se tudo estiver válido, envia para o backend
    if (isValid) {
      const selectOng = document.getElementById('ong');
      const id_ong = selectOng.value;
      const nome_ong = selectOng.options[selectOng.selectedIndex].textContent; // Corrigido para garantir o nome

      const nome_doador = localStorage.getItem('conta_nome') || '';
      const email_doador = localStorage.getItem('conta_email') || '';

      const data = {
        alimento: document.getElementById('alimento').value,
        quantidade: document.getElementById('quantidade').value,
        tipo: document.getElementById('tipo').value,
        vencimento: document.getElementById('vencimento').value,
        id_ong: id_ong,
        nome_ong: nome_ong, // Salva o nome da ONG beneficiada
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        observacoes: document.getElementById('observacoes').value,
        status: 'Pendente',
        id_doador: contaId, // <-- ESSA LINHA GARANTE QUE A DOAÇÃO FICA VINCULADA AO USUÁRIO LOGADO
        nome_doador: nome_doador,
        email_doador: email_doador
      };

      fetch('/api/doacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(response => {
          alert(response.mensagem || "Doação registrada com sucesso!");
          form.reset();
        })
        .catch(() => {
          alert("Erro ao registrar doação.");
        });
    }

    // Função para mostrar erro
    function showError(message) {
      inputVencimento.style.borderColor = 'red';
      errorElement.textContent = message;
      inputVencimento.focus();
    }
  });
});