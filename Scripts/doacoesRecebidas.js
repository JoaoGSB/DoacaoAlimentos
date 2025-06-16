document.addEventListener('DOMContentLoaded', function () {
  // Verifica se é uma ONG logada
  const contaTipo = localStorage.getItem('conta_tipo');
  const ongId = localStorage.getItem('conta_id');
  if (contaTipo !== 'ong' || !ongId) {
    alert('Acesso restrito. Faça login como ONG.');
    window.location.href = '/Views/Login.html';
    return;
  }

  let todasDoacoes = [];

  // Função para buscar e exibir as doações recebidas
  function carregarDoacoes() {
    fetch(`/api/doacoes/ong/${ongId}`)
      .then(res => res.json())
      .then(doacoes => {
        todasDoacoes = doacoes;
        aplicarFiltros();
      });
  }

  // Função para aplicar os filtros e exibir as doações filtradas
  function aplicarFiltros() {
    const statusFiltro = document.getElementById('filtroStatus').value;
    const dataFiltro = document.getElementById('filtroData').value;
    const tipoFiltro = document.getElementById('filtroTipo').value;

    let filtradas = todasDoacoes.slice();

    // Filtro de status
    if (statusFiltro) {
      filtradas = filtradas.filter(d => {
        const status = (d.status || '').toLowerCase();
        if (statusFiltro === 'pendente') return status === 'pendente';
        if (statusFiltro === 'confirmado') return ['entregue', 'recebida', 'confirmado'].includes(status);
        if (statusFiltro === 'retirado') return status === 'retirado';
        if (statusFiltro === 'cancelado') return ['cancelada', 'cancelado'].includes(status);
        return true;
      });
    }

    // Filtro de período
    if (dataFiltro) {
      const dias = parseInt(dataFiltro, 10);
      const agora = new Date();
      filtradas = filtradas.filter(d => {
        if (!d.criado_em) return false;
        const dataCriado = new Date(d.criado_em);
        const diffDias = (agora - dataCriado) / (1000 * 60 * 60 * 24);
        return diffDias <= dias;
      });
    }

    // Filtro de tipo de alimento (campo "tipo" no banco)
    if (tipoFiltro) {
      filtradas = filtradas.filter(d => {
        if (!d.tipo) return false;
        // Normaliza para comparar com as opções do filtro
        if (tipoFiltro === 'seco') return d.tipo.toLowerCase().includes('seco');
        if (tipoFiltro === 'perecivel') return d.tipo.toLowerCase().includes('perecível') || d.tipo.toLowerCase().includes('perecivel');
        if (tipoFiltro === 'industrializado') return d.tipo.toLowerCase().includes('industrializado');
        return false;
      });
    }

    exibirDoacoes(filtradas);
  }

  // Função para exibir as doações (igual ao seu forEach atual)
  function exibirDoacoes(doacoes) {
    const lista = document.querySelector('.lista-doacoes');
    lista.innerHTML = '';

    // Atualiza os resumos dinamicamente
    document.getElementById('totalRecebido').textContent = doacoes.length;
    document.getElementById('totalConfirmadas').textContent = doacoes.filter(d => d.status === 'Entregue' || d.status === 'Recebida' || d.status === 'Confirmado').length;
    document.getElementById('totalPendentes').textContent = doacoes.filter(d => d.status === 'Pendente').length;
    document.getElementById('totalCanceladas').textContent = doacoes.filter(d => d.status === 'Cancelada' || d.status === 'Cancelado').length;

    if (!doacoes.length) {
      lista.innerHTML = '<div class="alert alert-info">Nenhuma doação recebida ainda.</div>';
      return;
    }

    doacoes.forEach(doacao => {
      // Badge de status com cores e nomes amigáveis para a ONG
      let statusBadge = '';
      if (doacao.status === 'Entregue' || doacao.status === 'Recebida' || doacao.status === 'Confirmado') {
        statusBadge = '<span class="badge bg-success">Recebida</span>';
      } else if (doacao.status === 'Pendente') {
        statusBadge = '<span class="badge bg-warning text-dark">Pendente</span>';
      } else if (doacao.status === 'Cancelada' || doacao.status === 'Cancelado') {
        statusBadge = '<span class="badge bg-danger">Cancelada</span>';
      } else if (doacao.status === 'Retirado') {
        statusBadge = '<span class="badge bg-primary">Retirada</span>';
      } else {
        statusBadge = `<span class="badge bg-secondary">${doacao.status}</span>`;
      }

      const card = document.createElement('div');
      card.className = 'card card-doacao mt-3';
      card.innerHTML = `
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="m-0">Doação #${doacao.id}</h5>
            ${statusBadge}
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong><i class="fas fa-utensils me-2"></i>Alimento:</strong> ${doacao.alimento}</p>
              <p><strong><i class="fas fa-boxes me-2"></i>Quantidade:</strong> ${doacao.quantidade} unidades</p>
              <p><strong><i class="fas fa-calendar-alt me-2"></i>Validade:</strong> ${doacao.vencimento ? new Date(doacao.vencimento).toLocaleDateString('pt-BR') : ''}</p>
            </div>
            <div class="col-md-6">
              <p><strong><i class="fas fa-user me-2"></i>Doador:</strong> ${doacao.nome_doador || ''}</p>
              <p><strong><i class="fas fa-phone me-2"></i>Contato:</strong> ${doacao.telefone || ''}</p>
              <p><strong><i class="fas fa-map-marker-alt me-2"></i>Endereço:</strong> ${doacao.endereco || ''}</p>
            </div>
          </div>
        </div>
        <div class="card-footer bg-light">
          <div class="d-flex justify-content-between">
            <small class="text-muted">Recebido em: ${doacao.criado_em ? new Date(doacao.criado_em).toLocaleString('pt-BR') : ''}</small>
            <div class="acoes-doacao">
              ${doacao.status === 'Pendente' ? `
                <button type="button" class="btn btn-sm btn-success me-2" onclick="confirmarDoacao(${doacao.id})">
                  <i class="fas fa-check me-1"></i>Confirmar recebimento
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="recusarDoacao(${doacao.id})">
                  <i class="fas fa-times me-1"></i>Recusar
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
      lista.appendChild(card);
    });
  }

  // Eventos para os filtros
  document.getElementById('filtroStatus').addEventListener('change', aplicarFiltros);
  document.getElementById('filtroData').addEventListener('change', aplicarFiltros);
  document.getElementById('filtroTipo').addEventListener('change', aplicarFiltros);

  // Função para confirmar doação (marca como Recebida/Entregue)
  window.confirmarDoacao = function(id) {
    fetch(`/api/doacoes/${id}/confirmar`, { method: 'PUT' })
      .then(res => res.json())
      .then(() => carregarDoacoes());
  };

  // Função para recusar doação (marca como Cancelada)
  window.recusarDoacao = function(id) {
    fetch(`/api/doacoes/${id}/cancelar`, { method: 'PUT' })
      .then(res => res.json())
      .then(() => carregarDoacoes());
  };

  // Carrega as doações ao abrir a página
  carregarDoacoes();
});