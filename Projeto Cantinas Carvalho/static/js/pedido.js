const inputPesquisa = document.querySelector('.search-bar input');
const filtroGeral = document.getElementById('filtroGeral');
const containerListagem = document.getElementById('container-listagem');
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
        filtrar(); 
    });
}

const mensagemVazia = document.createElement('div');
mensagemVazia.id = 'msg-vazio';
mensagemVazia.innerHTML = `
    <div style="text-align:center; padding: 4rem 1rem; color: var(--cor-da-aba-de-navegacao-modo-claro);">
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Nenhum pedido encontrado</h3>
        <p style="opacity: 0.8;">De acordo com os filtros aplicados, não houve resultados para esta busca.</p>
    </div>
`;
mensagemVazia.style.display = 'none';
containerListagem?.appendChild(mensagemVazia);

function getItens() {
    return Array.from(containerListagem?.querySelectorAll('.item-lista') || [])
        .filter(i => i.id !== 'msg-vazio');
}

function filtrar() {
    const termo = (inputPesquisa?.value || '').toLowerCase().trim();
    const filtro = filtroGeral?.value || 'todos';
    const isDark = document.body.classList.contains('dark-theme');

    let encontrou = false;

    getItens().forEach(item => {
        const nome = item.querySelector('h3')?.innerText.toLowerCase() || '';
        const id = item.querySelector('small')?.innerText.toLowerCase().replace('#', '').trim() || '';
        const data = item.querySelector('.descricao p')?.innerText.toLowerCase().replace('data:', '').trim() || '';
        
        const statusEl = item.querySelector('.select-personalizado');
        const status = statusEl?.value || '';

        const matchTexto = nome.includes(termo) || id.includes(termo) || data.includes(termo);
        const matchStatus = filtro === 'todos' || status === filtro;

        const show = matchTexto && matchStatus;
        item.style.display = show ? 'flex' : 'none';

        if (show) encontrou = true;
    });

    const itensVisiveis = getItens().filter(item => item.style.display !== 'none');
    const corBorda = isDark ? 'rgba(255, 255, 255, .1)' : 'rgba(101, 42, 14, .1)';

    getItens().forEach(item => {
        item.style.borderTop = "none"; 
    });

    if (itensVisiveis.length > 1) {
        for (let i = 1; i < itensVisiveis.length; i++) {
            itensVisiveis[i].style.borderTop = `.125rem solid ${corBorda}`;
        }
    }

    if (mensagemVazia) {
        mensagemVazia.style.display = encontrou ? 'none' : 'block';
        
        if (isDark) {
            mensagemVazia.querySelector('div').style.color = '#F0ECE1';
        } else {
            mensagemVazia.querySelector('div').style.color = 'var(--cor-da-aba-de-navegacao-modo-claro)';
        }
    }
}

inputPesquisa?.addEventListener('input', filtrar);
filtroGeral?.addEventListener('change', filtrar);
filtrar();