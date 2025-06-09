document.addEventListener('DOMContentLoaded', function () {
  const tipoCadastro = document.getElementById('tipoCadastro');
  const cpfDoador = document.getElementById('cpfDoador');
  const cnpjOng = document.getElementById('cnpjOng');
  const cpfInput = document.getElementById('cpf');
  const cnpjInput = document.getElementById('cnpj');
  const labelNome = document.getElementById('labelNome');
  const form = document.getElementById('formCadastro');

  tipoCadastro.addEventListener('change', function () {
    if (this.value === 'doador') {
      form.action = '/api/doadores/cadastrar';
      cpfDoador.style.display = 'block';
      cnpjOng.style.display = 'none';
      cpfInput.required = true;
      cnpjInput.required = false;
      cnpjInput.value = '';
      labelNome.textContent = 'Nome Completo';
    } else if (this.value === 'ong') {
      form.action = '/api/ongs/cadastrar';
      cpfDoador.style.display = 'none';
      cnpjOng.style.display = 'block';
      cpfInput.required = false;
      cnpjInput.required = true;
      cpfInput.value = '';
      labelNome.textContent = 'Nome da ONG';
    } else {
      form.action = '';
      cpfDoador.style.display = 'none';
      cnpjOng.style.display = 'none';
      cpfInput.required = false;
      cnpjInput.required = false;
      cpfInput.value = '';
      cnpjInput.value = '';
      labelNome.textContent = 'Nome Completo';
    }
  });

  // Força exibir os campos certos ao recarregar com opção já selecionada
  tipoCadastro.dispatchEvent(new Event('change'));

  // Validação do formulário e envio com redirecionamento
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // evita envio automático

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const cpf = cpfInput.value.trim();
    const cnpj = cnpjInput.value.trim();
    const tipo = tipoCadastro.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('E-mail inválido!');
      return;
    }

    const telefoneNumerico = telefone.replace(/\D/g, '');
    if (telefoneNumerico.length < 10) {
      alert('Telefone inválido! Deve conter ao menos 10 números.');
      return;
    }

    if (tipo === 'doador' && !validarCPF(cpf)) {
      alert('CPF inválido!');
      return;
    }

    if (tipo === 'ong' && !validarCNPJ(cnpj)) {
      alert('CNPJ inválido!');
      return;
    }

    // Monta o objeto de dados para envio
    const data = {
      nome,
      email,
      senha,
      telefone,
      endereco,
      tipoCadastro: tipo,
      cpf: tipo === 'doador' ? cpf : undefined,
      cnpj: tipo === 'ong' ? cnpj : undefined
    };

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) throw new Error('Erro no cadastro.');
        return response.json();
      })
      .then(data => {
        alert(data.mensagem || 'Cadastro realizado com sucesso!');
        window.location.href = '/Views/Login.html'; // redireciona para login
      })
      .catch(error => {
        alert('Erro ao cadastrar. Tente novamente.');
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