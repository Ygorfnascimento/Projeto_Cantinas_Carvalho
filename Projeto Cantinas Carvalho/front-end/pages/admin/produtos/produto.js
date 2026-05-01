let itemSendoEditado = null;
let itemParaDeletar = null;
let itens = [];

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const getCampos = () => ({
    nome: qs('[name="nome"]'),
    preco: qs('[name="preco"]'),
    quantidade: qs('[name="quantidade"]'),
    descricao: qs('[name="descricao"]'),
    categoria: qs('[name="categoria"]') 
});

const refreshItens = () => {
    itens = qsa('.item-lista', containerListagem);
};

const themeToggle = document.getElementById('theme-switch');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggle) themeToggle.checked = true;
}

if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
}

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

if (!containerListagem || !formCadastro) {
    console.warn('Elementos essenciais não encontrados. Verifique IDs "container-listagem" e "formCadastro".');
}

const inputFile = document.createElement('input');
inputFile.type = 'file';
inputFile.accept = 'image/*';

if (dropzone) {
    dropzone.addEventListener('click', () => inputFile.click());
}

inputFile.addEventListener('change', () => {
    const file = inputFile.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert('Imagem muito grande (máx: 2MB)');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        if (!dropzone) return;
        dropzone.innerHTML = `
            <img src="${e.target.result}" id="img-atual" style="max-height:100%;border-radius:0.625rem;">
        `;
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
if (containerListagem) containerListagem.appendChild(mensagemVazia);

if (inputPesquisa) {
    inputPesquisa.addEventListener('input', () => {
        const termo = inputPesquisa.value.toLowerCase().trim();
        let encontrou = false;

        itens.forEach(item => {
            if (item.id === 'mensagem-pesquisa-vazia') return;
            const nomeEl = qs('h3', item);
            if (!nomeEl) return;

            const match = nomeEl.innerText.toLowerCase().includes(termo);
            item.style.display = match ? 'flex' : 'none';
            if (match) encontrou = true;
        });

        mensagemVazia.style.display = (!encontrou && termo) ? 'block' : 'none';
    });
}

function vincularEventos(item) {
    const btnEditar = qs('.btn-editar', item);
    const btnLixeira = qs('.btn-lixeira', item);

    if (btnEditar) {
        btnEditar.onclick = (e) => {
            e.preventDefault();
            itemSendoEditado = item;

            const nome = qs('h3', item)?.innerText || '';
            const preco = qs('.nome-preco p', item)?.innerText.replace('R$ ', '').trim() || '';
            const desc = qs('.descricao', item)?.innerText || '';
            const qtd = qs('.badge-unidade', item)?.innerText.trim() || '';
            const img = qs('.info-basica img', item)?.src || '';

            const campos = getCampos();

            if (campos.nome) campos.nome.value = nome;
            if (campos.preco) campos.preco.value = preco;
            if (campos.quantidade) campos.quantidade.value = qtd;
            if (campos.descricao) campos.descricao.value = desc;

            if (dropzone && img) {
                dropzone.innerHTML = `<img src="${img}" id="img-atual" style="max-height:100%;border-radius:0.625rem;">`;
            }

            if (btnSubmit) btnSubmit.innerText = 'SALVAR ALTERAÇÕES';
            if (modalNovo) modalNovo.style.display = 'flex';
        };
    }

    if (btnLixeira) {
        btnLixeira.onclick = (e) => {
            e.preventDefault();
            itemParaDeletar = item;
            if (modalExcluir) modalExcluir.style.display = 'flex';
        };
    }
}

refreshItens();
itens.forEach(vincularEventos);

btnConfirmarExcluir?.addEventListener('click', () => {
    if (itemParaDeletar) {
        itemParaDeletar.remove();
        refreshItens();
    }
    if (modalExcluir) modalExcluir.style.display = 'none';
});

btnCancelarExcluir?.addEventListener('click', () => {
    if (modalExcluir) modalExcluir.style.display = 'none';
});

btnNovo?.addEventListener('click', () => {
    itemSendoEditado = null;
    formCadastro.reset();
    if (btnSubmit) btnSubmit.innerText = 'CADASTRAR';
    if (dropzone) dropzone.innerHTML = '<p>Clique para adicionar a imagem</p>';
    if (modalNovo) modalNovo.style.display = 'flex';
});

const fecharModal = () => {
    if (modalNovo) modalNovo.style.display = 'none';
    formCadastro.reset();
    itemSendoEditado = null;
};

btnFecharNovo?.addEventListener('click', fecharModal);

formCadastro?.addEventListener('submit', (e) => {
    e.preventDefault();

    const campos = getCampos();
    const imgPreview = qs('#img-atual');
    const imgSrc = imgPreview?.src || '/front-end/assets/Imagens_dos_produtos/img_produto_hamburger.png';

    const htmlContent = `
        <div class="card-produto-visual">
            <div class="info-basica">
                <img src="${imgSrc}" alt="${campos.nome.value}">
                <div class="nome-preco">
                    <h3>${campos.nome.value}</h3>
                    <p>R$ ${campos.preco.value}</p>
                </div>
            </div>
            <div class="divisor-vertical"></div>
            <p class="descricao">${campos.descricao.value}</p>
        </div>
        <div class="controles-externos">
            <div class="badge-unidade">${campos.quantidade.value}</div>
            <button class="btn-circular btn-editar" type="button">
                <img src="/front-end/assets/icons/lapis.png">
            </button>
            <button class="btn-circular btn-lixeira" type="button">
                <img src="/front-end/assets/icons/lixeira.png">
            </button>
        </div>
    `;

    if (itemSendoEditado) {
        itemSendoEditado.innerHTML = htmlContent;
        vincularEventos(itemSendoEditado);
    } else {
        const novoItem = document.createElement('div');
        novoItem.className = 'item-lista';
        novoItem.innerHTML = htmlContent;
        containerListagem.prepend(novoItem);
        vincularEventos(novoItem);
    }

    refreshItens();
    fecharModal();
});

window.addEventListener('click', (e) => {
    if (e.target === modalNovo) fecharModal();
    if (e.target === modalExcluir) modalExcluir.style.display = 'none';
});