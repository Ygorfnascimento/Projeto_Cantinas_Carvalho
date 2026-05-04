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
    });
}

const mensagemVazia = document.createElement('div');
mensagemVazia.id = 'msg-vazio';
mensagemVazia.innerHTML = `
    <div style="text-align:center;padding:3rem 1rem;">
        <h3>Pedido não encontrado</h3>
        <p>Verifique os filtros ou tente outra busca</p>
    </div>
`;

mensagemVazia.style.display = 'none';
containerListagem.appendChild(mensagemVazia);

function getItens() {
    return Array.from(containerListagem.querySelectorAll('.item-lista'))
        .filter(i => i.id !== 'msg-vazio');
}

function filtrar() {
    const termo = inputPesquisa?.value.toLowerCase().trim() || '';
    const filtro = filtroGeral?.value || 'todos';

    let encontrou = false;

    getItens().forEach(item => {
        const nome = item.querySelector('h3')?.innerText.toLowerCase() || '';

        const id = item
            .querySelector('small')
            ?.innerText.toLowerCase()
            .replace('#', '')
            .trim() || '';

        const data = item
            .querySelector('.descricao p')
            ?.innerText.toLowerCase()
            .replace('data:', '')
            .trim() || '';

        const status = item.querySelector('.select-personalizado')?.value || '';

        const matchTexto =
            nome.includes(termo) ||
            id.includes(termo) ||
            data.includes(termo);

        const matchStatus = filtro === 'todos' || status === filtro;

        const show = matchTexto && matchStatus;

        item.style.display = show ? 'flex' : 'none';

        if (show) encontrou = true;
    });

    mensagemVazia.style.display = encontrou ? 'none' : 'block';
}

inputPesquisa?.addEventListener('input', filtrar);
filtroGeral?.addEventListener('change', filtrar);