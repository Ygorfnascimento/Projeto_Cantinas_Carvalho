document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.querySelector('.search-bar input');
    const containerListagem = document.getElementById('container-listagem');
    const qtdAtivos = document.querySelectorAll('.numero-stats')[0];
    const qtdInativos = document.querySelectorAll('.numero-stats')[1];

    function atualizarContadores() {
        const ativos = document.querySelectorAll('.badge-status.ativo').length;
        const inativos = document.querySelectorAll('.badge-status.inativo').length;

        if (qtdAtivos) qtdAtivos.textContent = ativos;
        if (qtdInativos) qtdInativos.textContent = inativos;
    }

    if (inputBusca) {
        inputBusca.addEventListener('input', () => {
            const termo = inputBusca.value.toLowerCase().trim();
            const cardsUsuarios = document.querySelectorAll('.dados');

            let encontrouQualquer = false;

            cardsUsuarios.forEach(card => {
                const nome = card.querySelector('.txt-principal')?.textContent.toLowerCase() || '';
                const email = card.querySelector('.txt-secundario')?.textContent.toLowerCase() || '';
                const match = nome.includes(termo) || email.includes(termo);

                card.style.display = match ? 'flex' : 'none';

                if (match) encontrouQualquer = true;
            });

            let msgErro = document.getElementById('mensagem-pesquisa-vazia');

            if (!encontrouQualquer) {
                if (!msgErro && containerListagem) {
                    msgErro = document.createElement('div');
                    msgErro.id = 'mensagem-pesquisa-vazia';
                    msgErro.innerHTML = `
                        <div class="container-msg-vazia" style="text-align:center; padding:3rem 1rem; width:100%;">
                            <h3 class="txt-principal" style="margin:0; color:#6b3f2a;"> Nenhum usuário encontrado </h3>
                            <p class="txt-secundario" style="margin:0.5rem 0 0 0; color:#6b3f2a;"> Não encontramos  resultados para sua busca. Tente outro nome ou e-mail.</p>
                        </div>
                    `;

                    containerListagem.appendChild(msgErro);
                }
            } else {
                msgErro?.remove();
            }
        });
    }

    if (containerListagem) {
        containerListagem.addEventListener('change', (event) => {
            const checkbox = event.target.closest('.status-toggle input');
            if (!checkbox) return;

            const card = checkbox.closest('.dados');
            if (!card) return;

            const badgeStatus = card.querySelector('.badge-status');
            if (!badgeStatus) return;

            if (checkbox.checked) {
                badgeStatus.textContent = 'Ativo';
                badgeStatus.classList.remove('inativo');
                badgeStatus.classList.add('ativo');
            } else {
                badgeStatus.textContent = 'Inativo';
                badgeStatus.classList.remove('ativo');
                badgeStatus.classList.add('inativo');
            }

            atualizarContadores();
        });
    }

    atualizarContadores();
});