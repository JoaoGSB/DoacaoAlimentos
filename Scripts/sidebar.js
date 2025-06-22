// Dinamiza os botões da sidebar e navbar conforme o tipo de usuário
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar dinâmica
  const tipo = localStorage.getItem('conta_tipo');
  const menuDoacoes = document.getElementById('menuDoacoes');
  const textoMenu = document.getElementById('textoMenuDoacoes');
  const itemFazerDoacao = document.getElementById('itemFazerDoacao');

  if (tipo === 'ong') {
    if (menuDoacoes && textoMenu) {
      menuDoacoes.href = '/Views/DoacoesRecebidas.html';
      textoMenu.textContent = 'Doações Recebidas';
    }
    if (itemFazerDoacao) itemFazerDoacao.style.display = 'none';
  } else if (tipo === 'doador') {
    if (menuDoacoes && textoMenu) {
      menuDoacoes.href = '/Views/ListarDoacao.html';
      textoMenu.textContent = 'Minhas Doações';
    }
    if (itemFazerDoacao) itemFazerDoacao.style.display = '';
  } else {
    if (menuDoacoes && textoMenu) {
      menuDoacoes.href = '/Views/ListarDoacao.html';
      textoMenu.textContent = 'Doações';
    }
    if (itemFazerDoacao) itemFazerDoacao.style.display = 'none';
  }

  // Sidebar: Esconde Login/Cadastro se logado
  const contaId = localStorage.getItem('conta_id');
  const sidebarEntrar = document.getElementById('sidebarEntrar');
  const sidebarCadastro = document.getElementById('sidebarCadastro');
  if (contaId) {
    if (sidebarEntrar) sidebarEntrar.parentElement.style.display = 'none';
    if (sidebarCadastro) sidebarCadastro.parentElement.style.display = 'none';
  } else {
    if (sidebarEntrar) sidebarEntrar.parentElement.style.display = '';
    if (sidebarCadastro) sidebarCadastro.parentElement.style.display = '';
  }

  // Navbar dinâmica (navbar)
  const navbarConta = document.getElementById('navbarConta');
  const navbarNomeUsuario = document.getElementById('navbarNomeUsuario');
  const navbarAvatar = document.getElementById('navbarAvatar');
  const btnCadastro = document.getElementById('btnCadastro');
  const btnEntrar = document.getElementById('btnEntrar');

  if (contaId) {
    // Esconde botões de cadastro/entrar da navbar
    if (btnCadastro) btnCadastro.style.display = 'none';
    if (btnEntrar) btnEntrar.style.display = 'none';
    // Mostra avatar/nome
    if (navbarConta) navbarConta.style.display = 'flex';

    fetch(`/api/contas/${contaId}`)
      .then(res => res.json())
      .then(conta => {
        const nome = conta.nome || "Usuário";
        const email = conta.email || "";
        const foto = conta.foto && conta.foto.trim() !== "" ? conta.foto : null;

        if (navbarNomeUsuario) {
          navbarNomeUsuario.textContent = nome;
        }
        if (navbarAvatar) {
          if (foto) {
            navbarAvatar.innerHTML = `<img src="${foto}" alt="Foto do usuário" class="rounded-circle border border-2 border-white" width="40" height="40">`;
          } else {
            let letra = nome && nome.trim() ? nome.trim().charAt(0) : (email ? email.trim().charAt(0) : "U");
            navbarAvatar.textContent = letra.toUpperCase();
          }
        }
      });

    // Clique leva para a página da conta
    if (navbarConta) {
      navbarConta.onclick = () => {
        window.location.href = "/Views/Conta.html";
      };
    }
  } else {
    // Se não logado, mostra botões normais e esconde avatar/nome
    if (navbarConta) navbarConta.style.display = 'none';
    if (btnCadastro) btnCadastro.style.display = '';
    if (btnEntrar) btnEntrar.style.display = '';
  }
});