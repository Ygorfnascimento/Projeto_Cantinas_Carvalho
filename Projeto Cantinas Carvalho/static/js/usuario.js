const themeToggle = document.getElementById('theme-switch');

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggle) themeToggle.checked = true;
}

if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');

        localStorage.setItem(
            'theme',
            document.body.classList.contains('dark-theme') ? 'dark' : 'light'
        );
    });
}

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
                            <h3 class="txt-principal" style="margin:0;">Usuário não encontrado</h3>
                            <p class="txt-secundario" style="margin:0.5rem 0 0 0;">
                                Verifique a ortografia ou tente outro termo.
                            </p>
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