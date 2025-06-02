document.addEventListener('DOMContentLoaded', function () {
    const tabelaDoacoes = document.getElementById('tabelaDoacoes');
    
    // Exemplo de array de doações
    const doacoes = [
        {
            nome: 'João Silva',
            alimento: 'Arroz',
            quantidade: 5,
            ong: 'ONG Esperança',
            vencimento: '2025-04-30',
            status: 'Pendente',
        },
        {
            nome: 'Maria Oliveira',
            alimento: 'Feijão',
            quantidade: 3,
            ong: 'Projeto Alimento Solidário',
            vencimento: '2025-04-20',
            status: 'Entregue',
        }
    ];

    // Função para retornar badge com cor conforme status
    function gerarBadgeStatus(status) {
        let corClasse = 'secondary'; // default

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

    // Preenche a tabela com as doações
    doacoes.forEach(doacao => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${doacao.nome}</td>
            <td>${doacao.alimento}</td>
            <td>${doacao.quantidade}</td>
            <td>${doacao.ong}</td>
            <td>${doacao.vencimento}</td>
            <td>${gerarBadgeStatus(doacao.status)}</td>
        `;
        
        tabelaDoacoes.appendChild(tr);
    });
});
