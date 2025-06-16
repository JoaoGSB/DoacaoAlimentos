document.addEventListener('DOMContentLoaded', function () {
  const contaId = localStorage.getItem('conta_id');
  carregarDoacoes();

  function carregarDoacoes() {
    fetch(`/api/doacoes?conta_id=${contaId}`)
      .then(res => res.json())
      .then(doacoes => {
        const tabela = document.getElementById('tabelaDoacoes');
        tabela.innerHTML = '';

        // Define as cores para cada status
        const statusColor = {
          'Entregue': 'background-color: #2ecc71; color: #fff;',
          'Pendente': 'background-color: #f39c12; color: #212529;',
          'Cancelada': 'background-color: #e74c3c; color: #fff;'
        };

        doacoes.forEach(doacao => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td data-label="Doador">${doacao.nome_doador || ''}</td>
            <td data-label="E-mail">${doacao.email_doador || ''}</td>
            <td data-label="Itens Doados">${doacao.alimento || ''}</td>
            <td data-label="Quantidade">${doacao.quantidade || ''}</td>
            <td data-label="ONG Beneficiada">${doacao.nome_ong || ''}</td>
            <td data-label="Validade">${doacao.vencimento ? new Date(doacao.vencimento).toLocaleDateString('pt-BR') : ''}</td>
            <td data-label="Status">
              <span class="badge" style="${statusColor[doacao.status] || 'background-color: #adb5bd; color: #fff;'}">
                ${doacao.status || ''}
              </span>
            </td>
            <td data-label="Ações">
              ${
                doacao.status !== 'Entregue' && doacao.status !== 'Cancelada'
                  ? `<button class="btn btn-sm btn-outline-danger btn-cancelar-doacao" data-id="${doacao.id}" title="Cancelar/Excluir Doação">
                      <i class="fas fa-trash"></i>
                    </button>`
                  : ''
              }
            </td>
          `;
          tabela.appendChild(tr);
        });

        // Evento para cancelar doação
        document.querySelectorAll('.btn-cancelar-doacao').forEach(btn => {
          btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            // Popup de confirmação
            if (confirm('Deseja cancelar esta doação?')) {
              fetch(`/api/doacoes/${id}/cancelar`, {
                method: 'PUT'
              })
                .then(res => res.json())
                .then(data => {
                  alert(data.mensagem || 'Doação cancelada!');
                  carregarDoacoes();
                });
            }
          });
        });
      })
      .catch(() => {
        const tabela = document.getElementById('tabelaDoacoes');
        tabela.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Erro ao carregar doações.</td></tr>';
      });
  }
});