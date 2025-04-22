document.addEventListener('DOMContentLoaded', function () {
    // Script para mostrar ou esconder campo de CPF ou CNPJ com base na escolha do tipo de cadastro
    document.getElementById('tipoCadastro').addEventListener('change', function() {
      const tipo = this.value;
      const cpfDoador = document.getElementById('cpfDoador');
      const cnpjOng = document.getElementById('cnpjOng');
      const inputCpf = document.getElementById('cpf');
      const inputCnpj = document.getElementById('cnpj');
  
      if (tipo === 'ong') {
        cnpjOng.style.display = 'block';  // Mostrar CNPJ para ONG
        inputCnpj.required = true;
  
        cpfDoador.style.display = 'none'; // Esconder CPF para Doador
        inputCpf.required = false;
        inputCpf.value = '';
      } else if (tipo === 'doador') {
        cpfDoador.style.display = 'block'; // Mostrar CPF para Doador
        inputCpf.required = true;
  
        cnpjOng.style.display = 'none';    // Esconder CNPJ para ONG
        inputCnpj.required = false;
        inputCnpj.value = '';
      } else {
        // Nenhuma seleção
        cpfDoador.style.display = 'none';
        inputCpf.required = false;
        inputCpf.value = '';
  
        cnpjOng.style.display = 'none';
        inputCnpj.required = false;
        inputCnpj.value = '';
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', function (e) {
      const email = document.getElementById('email').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const cpf = document.getElementById('cpf')?.value.trim() || '';
      const cnpj = document.getElementById('cnpj')?.value.trim() || '';
      const tipoCadastro = document.getElementById('tipoCadastro').value;
  
      // Validação do e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('E-mail inválido!');
        e.preventDefault();
        return;
      }
  
      // Validação do telefone (mínimo 10 dígitos)
      const telefoneNumerico = telefone.replace(/\D/g, '');
      if (telefoneNumerico.length < 10) {
        alert('Telefone inválido! Deve conter ao menos 10 números.');
        e.preventDefault();
        return;
      }
  
      // Validação do CPF se for doador
      if (tipoCadastro === 'doador') {
        if (!validarCPF(cpf)) {
          alert('CPF inválido!');
          e.preventDefault();
          return;
        }
      }
  
      // Validação do CNPJ se for ONG
      if (tipoCadastro === 'ong') {
        if (!validarCNPJ(cnpj)) {
          alert('CNPJ inválido!');
          e.preventDefault();
          return;
        }
      }
    });
  
    // Função para validar CPF
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
  
    // Função para validar CNPJ
    function validarCNPJ(cnpj) {
      cnpj = cnpj.replace(/[^\d]+/g, '');
      if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
      const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const pesos2 = [6].concat(pesos1);
  
      const calcularDigito = (base, pesos) => {
        let soma = 0;
        for (let i = 0; i < pesos.length; i++) {
          soma += parseInt(base[i]) * pesos[i];
        }
        let resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
      };
  
      const base = cnpj.substring(0, 12);
      const digito1 = calcularDigito(base, pesos1);
      const digito2 = calcularDigito(base + digito1, pesos2);
  
      return cnpj === base + digito1 + digito2;
    }
  });
  