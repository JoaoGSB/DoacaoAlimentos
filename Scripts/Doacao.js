document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formDoacao');
    const inputVencimento = document.getElementById('vencimento');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '5px';
    inputVencimento.parentNode.appendChild(errorElement);

    // Adiciona feedback visual
    inputVencimento.addEventListener('input', function() {
        this.style.borderColor = '';
        errorElement.textContent = '';
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;
        const vencimento = inputVencimento.value.trim();
        const dataVencimento = new Date(vencimento);
        const dataAtual = new Date();

        // Resetando os estilos e erros
        inputVencimento.style.borderColor = '';
        errorElement.textContent = '';

        // Validando se a data foi inserida
        if (!vencimento) {
            showError("Por favor, insira a data de vencimento do alimento.");
            isValid = false;
        }
        // Validando se a data é inválida
        else if (isNaN(dataVencimento.getTime())) {
            showError("Data de vencimento inválida. Use o formato AAAA-MM-DD.");
            isValid = false;
        }
        else {
            // Resetando as horas para comparar apenas as datas
            dataAtual.setHours(0, 0, 0, 0);
            dataVencimento.setHours(0, 0, 0, 0);

            // Verificando se o alimento está vencido
            if (dataVencimento < dataAtual) {
                showError("Não é possível doar alimentos vencidos.");
                isValid = false;
            }
            // Verificando se a validade é de pelo menos 2 dias
            else {
                const diffEmMs = dataVencimento - dataAtual;
                const diffEmDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

                if (diffEmDias <= 1) {
                    showError("A validade do alimento deve ser de pelo menos 2 dias a partir de hoje.");
                    isValid = false;
                }
            }
        }

        // Se tudo estiver válido
        if (isValid) {
            // Feedback visual
            form.style.border = '2px solid green';
            setTimeout(() => {
                form.style.border = '';
            }, 2000);

            alert("Obrigado pela doação!");
            form.reset();
        }

        // Função para mostrar erro
        function showError(message) {
            inputVencimento.style.borderColor = 'red';
            errorElement.textContent = message;
            inputVencimento.focus();
        }
    });
});
