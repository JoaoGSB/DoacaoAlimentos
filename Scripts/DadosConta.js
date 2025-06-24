document.addEventListener("DOMContentLoaded", () => {
    const contaId = localStorage.getItem('conta_id');
    if (!contaId) {
        alert('Usuário não autenticado!');
        window.location.href = '/Views/Login.html';
        return;
    }

    // Buscar dados da conta
    fetch(`/api/contas/${contaId}`)
        .then(res => res.json())
        .then(conta => {
            document.getElementById("nome").value = conta.nome || "";
            document.getElementById("email").value = conta.email || "";
            document.getElementById("telefone").value = conta.telefone || "";
            document.getElementById("endereco").value = conta.endereco || "";

            // Buscar preferências separadamente (se existir no backend)
            if (document.getElementById("emailNotificacoes") && document.getElementById("smsNotificacoes")) {
                fetch(`/api/preferencias/${contaId}`)
                    .then(res => res.json())
                    .then(pref => {
                        document.getElementById("emailNotificacoes").checked = !!(pref.receber_notificacoes ?? pref.receberNotificacoes);
                        document.getElementById("smsNotificacoes").checked = !!(pref.sms_notificacoes ?? pref.smsNotificacoes);
                    })
                    .catch(() => {
                        document.getElementById("emailNotificacoes").checked = false;
                        document.getElementById("smsNotificacoes").checked = false;
                    });
            }
        });

    // Salvar alterações de telefone/endereço
    const btnSalvar = document.getElementById("btnSalvar");
    if (btnSalvar) {
        btnSalvar.onclick = () => {
            fetch(`/api/contas/${contaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    telefone: document.getElementById("telefone").value,
                    endereco: document.getElementById("endereco").value
                })
            })
            .then(res => res.json())
            .then(data => {
                alert(data.mensagem || "Alterações salvas!");
                // Opcional: recarregar dados
                // location.reload();
            });
        };
    }

    // Salvar preferências
    const btnSalvarPreferencias = document.getElementById("btnSalvarPreferencias");
    if (btnSalvarPreferencias) {
        btnSalvarPreferencias.onclick = () => {
            fetch(`/api/preferencias/${contaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receber_notificacoes: document.getElementById("emailNotificacoes").checked,
                    sms_notificacoes: document.getElementById("smsNotificacoes").checked
                })
            })
            .then(res => res.json())
            .then(data => alert(data.mensagem || "Preferências salvas!"));
        };
    }

    // Alterar senha
    const btnAlterarSenha = document.getElementById("btnAlterarSenha");
    if (btnAlterarSenha) {
        btnAlterarSenha.onclick = () => {
            fetch(`/api/contas/${contaId}/senha`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senhaAtual: document.getElementById("senhaAtual").value,
                    novaSenha: document.getElementById("novaSenha").value
                })
            })
            .then(res => res.json())
            .then(data => alert(data.mensagem || "Senha alterada!"));
        };
    }
});