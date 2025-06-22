document.addEventListener('DOMContentLoaded', function () {
  const tipoCadastro = document.getElementById('tipoCadastro');
  const cpfDoador = document.getElementById('cpfDoador');
  const cnpjOng = document.getElementById('cnpjOng');
  const cpfInput = document.getElementById('cpf');
  const cnpjInput = document.getElementById('cnpj');
  const labelNome = document.getElementById('labelNome');
  const form = document.getElementById('formCadastro');
  const mensagemDiv = document.getElementById('mensagemCadastro');
  const telefoneInput = document.getElementById('telefone');

  tipoCadastro.addEventListener('change', function () {
    if (this.value === 'doador') {
      cpfDoador.style.display = 'block';
      cnpjOng.style.display = 'none';
      cpfInput.required = true;
      cnpjInput.required = false;
      cnpjInput.value = '';
      labelNome.textContent = 'Nome Completo';
    } else if (this.value === 'ong') {
      cpfDoador.style.display = 'none';
      cnpjOng.style.display = 'block';
      cpfInput.required = false;
      cnpjInput.required = true;
      cpfInput.value = '';
      labelNome.textContent = 'Nome da ONG';
    } else {
      cpfDoador.style.display = 'none';
      cnpjOng.style.display = 'none';
      cpfInput.required = false;
      cnpjInput.required = false;
      cpfInput.value = '';
      cnpjInput.value = '';
      labelNome.textContent = 'Nome Completo';
    }
  });

  // Máscara para telefone (formato brasileiro com DDD)
  telefoneInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 0) v = '(' + v;
    if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
    if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
    this.value = v;
  });

  // Força exibir os campos certos ao recarregar com opção já selecionada
  tipoCadastro.dispatchEvent(new Event('change'));

  // Função para converter telefone para formato internacional (+55)
  function formatarTelefoneParaInternacional(telefone) {
    let v = telefone.replace(/\D/g, '');
    if (v.length === 10 || v.length === 11) {
      return '+55' + v;
    }
    return telefone; // Retorna como está se não bater
  }

  // Validação do formulário e envio com fetch
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const telefone = formatarTelefoneParaInternacional(document.getElementById('telefone').value.trim());
    const endereco = document.getElementById('endereco').value.trim();
    const cpf = cpfInput.value.trim();
    const cnpj = cnpjInput.value.trim();
    const tipo = tipoCadastro.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mensagemDiv.innerHTML = '<div class="alert alert-danger">E-mail inválido!</div>';
      return;
    }

    const telefoneNumerico = telefone.replace(/\D/g, '');
    if (telefoneNumerico.length < 12) { // +55 + DDD + número = 12 ou 13 dígitos
      mensagemDiv.innerHTML = '<div class="alert alert-danger">Telefone inválido! Deve conter DDD e número válido.</div>';
      return;
    }

    if (tipo === 'doador' && !validarCPF(cpf)) {
      mensagemDiv.innerHTML = '<div class="alert alert-danger">CPF inválido!</div>';
      return;
    }

    if (tipo === 'ong' && !validarCNPJ(cnpj)) {
      mensagemDiv.innerHTML = '<div class="alert alert-danger">CNPJ inválido!</div>';
      return;
    }

    // Monta o objeto de dados para envio
    const data = {
      nome,
      email,
      senha,
      telefone,
      endereco,
      cpf: tipo === 'doador' ? cpf : undefined,
      cnpj: tipo === 'ong' ? cnpj : undefined,
      tipo // Inclua o tipo no corpo da requisição
    };

    const url = '/api/contas';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(async response => {
        const resJson = await response.json();
        if (response.ok) {
          mensagemDiv.innerHTML = `<div class="alert alert-success">${resJson.mensagem || 'Cadastro realizado com sucesso!'}</div>`;
          setTimeout(() => { window.location.href = '/Views/Login.html'; }, 2000);
        } else {
          mensagemDiv.innerHTML = `<div class="alert alert-danger">${resJson.mensagem || 'Erro ao cadastrar.'}</div>`;
        }
      })
      .catch(error => {
        mensagemDiv.innerHTML = '<div class="alert alert-danger">Erro ao cadastrar. Tente novamente.</div>';
        console.error(error);
      });
  });

  // Funções de validação
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;
    return cpf.charAt(9) == digito1 && cpf.charAt(10) == digito2;
  }

  function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesos2 = [6].concat(pesos1);
    const calcularDigito = (base, pesos) => {
      let soma = 0;
      for (let i = 0; i < pesos.length; i++) soma += parseInt(base[i]) * pesos[i];
      let resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };
    const base = cnpj.substring(0, 12);
    const digito1 = calcularDigito(base, pesos1);
    const digito2 = calcularDigito(base + digito1, pesos2);
    return cnpj === base + digito1 + digito2;
  }
});