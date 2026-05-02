let itemSendoEditado = null;
let itemParaDeletar = null;
let itens = [];
let indiceOriginal = null;

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const getCampos = () => ({
    nome: qs('[name="nome"]'),
    preco: qs('[name="preco"]'),
    quantidade: qs('[name="quantidade"]'),
    descricao: qs('[name="descricao"]'),
    categoria: qs('[name="categoria"]'),
    disponivel: qs('[name="disponivel"]')
});

const containerListagem = qs('#container-listagem');
const modalNovo = qs('#modalNovoProduto');
const modalExcluir = qs('#modalExcluir');
const formCadastro = qs('#formCadastro');
const dropzone = qs('.dropzone-imagem');

const btnNovo = qs('#btnAbrirNovo');
const btnFecharNovo = qs('#btnFecharNovo');
const btnSubmit = qs('#btnSalvar');

const btnConfirmarExcluir = qs('#btnConfirmarExcluir');
const btnCancelarExcluir = qs('#btnCancelarExcluir');

const inputPesquisa = qs('.search-bar input');

const refreshItens = () => {
    itens = qsa('.item-lista', containerListagem);
};

const themeToggle = qs('#theme-switch');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggle) themeToggle.checked = true;
}

themeToggle?.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem(
        'theme',
        document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    );
});

const inputFile = document.createElement('input');
inputFile.type = 'file';
inputFile.accept = 'image/*';

dropzone?.addEventListener('click', () => inputFile.click());

inputFile.addEventListener('change', () => {
    const file = inputFile.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert('Imagem muito grande (máx: 2MB)');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        dropzone.innerHTML = `<img src="${e.target.result}" id="img-atual">`;
    };
    reader.readAsDataURL(file);
});

const mensagemVazia = document.createElement('div');
mensagemVazia.id = 'mensagem-pesquisa-vazia';
mensagemVazia.innerHTML = `
    <div style="text-align:center;padding:3rem 1rem;">
        <h3 class="msg-titulo">Produto não encontrado</h3>
        <p class="msg-sub">Verifique a ortografia ou tente outro termo.</p>
    </div>
`;
mensagemVazia.style.display = 'none';

containerListagem?.appendChild(mensagemVazia);

inputPesquisa?.addEventListener('input', () => {
    const termo = inputPesquisa.value.toLowerCase().trim();
    let encontrou = false;

    itens.forEach(item => {
        if (item.id === 'mensagem-pesquisa-vazia') return;

        const nome = qs('h3', item)?.innerText.toLowerCase() || '';
        const match = nome.includes(termo);

        item.style.display = match ? 'flex' : 'none';
        if (match) encontrou = true;
    });

    mensagemVazia.style.display = (!encontrou && termo) ? 'block' : 'none';
});

function vincularEventos(item) {
    const btnEditar = qs('.btn-editar', item);
    const btnLixeira = qs('.btn-lixeira', item);

    btnEditar?.addEventListener('click', () => {
        itemSendoEditado = item;

        const lista = qsa('.item-lista', containerListagem);
        indiceOriginal = lista.indexOf(item);

        const campos = getCampos();

        const nome = qs('h3', item)?.innerText || '';
        const preco = qs('.nome-preco p', item)?.innerText.replace('R$ ', '') || '';
        const desc = qs('.descricao', item)?.innerText || '';
        const qtd = qs('.badge-unidade', item)?.innerText.replace(/\D/g, '') || '';
        const img = qs('img', item)?.src || '';
        const categoria = item.dataset.categoria || '';

        const indisponivel = item.classList.contains('indisponivel');

        campos.nome.value = nome;
        campos.preco.value = preco;
        campos.quantidade.value = qtd;
        campos.descricao.value = desc;
        campos.categoria.value = categoria;
        campos.disponivel.checked = !indisponivel;

        if (img) {
            dropzone.innerHTML = `<img src="${img}" id="img-atual">`;
        }

        btnSubmit.innerText = 'SALVAR ALTERAÇÕES';
        modalNovo.style.display = 'flex';
    });

    btnLixeira?.addEventListener('click', () => {
        itemParaDeletar = item;
        modalExcluir.style.display = 'flex';
    });
}

refreshItens();
itens.forEach(vincularEventos);

btnConfirmarExcluir?.addEventListener('click', () => {
    itemParaDeletar?.remove();
    modalExcluir.style.display = 'none';
    refreshItens();
});

btnCancelarExcluir?.addEventListener('click', () => {
    modalExcluir.style.display = 'none';
});

btnNovo?.addEventListener('click', () => {
    itemSendoEditado = null;
    indiceOriginal = null;

    formCadastro.reset();
    getCampos().disponivel.checked = true;

    dropzone.innerHTML = '<p>Clique para adicionar a imagem</p>';
    btnSubmit.innerText = 'CADASTRAR';
    modalNovo.style.display = 'flex';
});

const fecharModal = () => {
    modalNovo.style.display = 'none';
    formCadastro.reset();
    itemSendoEditado = null;
    indiceOriginal = null;
};

btnFecharNovo?.addEventListener('click', fecharModal);

formCadastro?.addEventListener('submit', (e) => {
    e.preventDefault();

    const campos = getCampos();
    const img = qs('#img-atual')?.src || '/front-end/assets/images/img_produto_hamburger.png';

    const indisponivel = !campos.disponivel.checked;

    const html = `
    <div class="card-produto-visual">
        <div class="info-basica">
            <img src="${img}">
            <div class="nome-preco">
                <h3>${campos.nome.value}</h3>
                <p>R$ ${campos.preco.value}</p>
            </div>
        </div>

        <div class="divisor-vertical"></div>

        <p class="descricao">${campos.descricao.value}</p>

        <div class="area-extra">
            <span class="categoria-produto">${campos.categoria.value}</span>
            ${indisponivel ? `<span class="status-indisponivel">Indisponível</span>` : ''}
        </div>
    </div>

    <div class="controles-externos">
        <div class="badge-unidade">${campos.quantidade.value}</div>
        <button class="btn-circular btn-editar"><img src="/front-end/assets/icons/lapis.png"></button>
        <button class="btn-circular btn-lixeira"><img src="/front-end/assets/icons/lixeira.png"></button>
    </div>
    `;

    if (itemSendoEditado) {

        itemSendoEditado.innerHTML = html;
        itemSendoEditado.classList.toggle('indisponivel', indisponivel);
        itemSendoEditado.dataset.categoria = campos.categoria.value;

        vincularEventos(itemSendoEditado);

        const lista = qsa('.item-lista', containerListagem);

        if (indiceOriginal !== null) {
            if (indiceOriginal >= lista.length) {
                containerListagem.appendChild(itemSendoEditado);
            } else {
                containerListagem.insertBefore(
                    itemSendoEditado,
                    lista[indiceOriginal]
                );
            }
        }

    } else {

        const novo = document.createElement('article');
        novo.className = 'item-lista';
        novo.innerHTML = html;

        if (indisponivel) novo.classList.add('indisponivel');

        novo.dataset.categoria = campos.categoria.value;

        containerListagem.insertBefore(novo, containerListagem.firstChild);

        vincularEventos(novo);
    }

    refreshItens();
    fecharModal();
});

window.addEventListener('click', (e) => {
    if (e.target === modalNovo) fecharModal();
    if (e.target === modalExcluir) modalExcluir.style.display = 'none';
});