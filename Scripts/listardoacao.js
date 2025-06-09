document.addEventListener('DOMContentLoaded', function () {
    const tabelaDoacoes = document.getElementById('tabelaDoacoes');

    // Função para retornar badge com cor conforme status
    function gerarBadgeStatus(status) {
        let corClasse = 'secondary'; // default

        if (!status) return '';
        switch (status.toLowerCase()) {
            case 'pendente':
                corClasse = 'warning';
                break;
            case 'entregue':
                corClasse = 'success';
                break;
            case 'cancelado':
                corClasse = 'danger';
                break;
            default:
                corClasse = 'secondary';
        }

        return `<span class="badge bg-${corClasse}">${status}</span>`;
    }

    // Busca as doações do backend
    fetch('/api/doacoes')
        .then(res => res.json())
        .then(doacoes => {
            tabelaDoacoes.innerHTML = '';
            doacoes.forEach(doacao => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${doacao.nome}</td>
                    <td>${doacao.alimento}</td>
                    <td>${doacao.quantidade}</td>
                    <td>${doacao.ong}</td>
                    <td>${doacao.vencimento ? new Date(doacao.vencimento).toLocaleDateString() : ''}</td>
                    <td>${gerarBadgeStatus(doacao.status)}</td>
                `;
                tabelaDoacoes.appendChild(tr);
            });
        });
});