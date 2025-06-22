document.getElementById('formLogin').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      fetch('/api/contas/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          localStorage.setItem('conta_id', data.id);
          localStorage.setItem('conta_tipo', data.tipo);
          localStorage.setItem('conta_nome', data.nome);   // Salva nome
          localStorage.setItem('conta_email', data.email); // Salva email
          window.location.href = '/Views/Conta.html';
        } else {
          document.getElementById('loginErro').textContent = data.mensagem || 'Usuário ou senha inválidos!';
        }
      })
      .catch(() => {
        document.getElementById('loginErro').textContent = 'Erro ao tentar logar. Tente novamente.';
      });
    });