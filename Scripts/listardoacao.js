document.addEventListener('DOMContentLoaded', function () {
    const tabelaDoacoes = document.getElementById('tabelaDoacoes');
    
    // Suponhamos que temos um array com doações já registradas (pode ser substituído por uma chamada a um backend)
    const doacoes = [
        {
            nome: 'João Silva',
            alimento: 'Arroz',
            quantidade: 5,
            ong: 'ONG Esperança',
            vencimento: '2025-04-30',
            status: 'Pendente', // Status da doação
        },
        {
            nome: 'Maria Oliveira',
            alimento: 'Feijão',
            quantidade: 3,
            ong: 'Projeto Alimento Solidário',
            vencimento: '2025-04-20',
            status: 'Entregue', // Status da doação
        }
    ];

    // Preenche a tabela com as doações
    doacoes.forEach(doacao => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${doacao.nome}</td>
            <td>${doacao.alimento}</td>
            <td>${doacao.quantidade}</td>
            <td>${doacao.ong}</td>
            <td>${doacao.vencimento}</td>
            <td>${doacao.status}</td> <!-- Exibe o status -->
        `;
        
        tabelaDoacoes.appendChild(tr);
    });
});
