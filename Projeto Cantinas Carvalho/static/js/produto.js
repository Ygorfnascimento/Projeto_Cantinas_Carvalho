const qs = (selector, context = document) => context.querySelector(selector);
const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];

let itemSendoEditado = null;
let itemParaDeletar = null;
let indiceOriginal = null;
let itens = [];

const containerListagem = qs('#container-listagem');
const modalNovo = qs('#modalNovoProduto');
const modalExcluir = qs('#modalExcluir');
const formCadastro = qs('#formCadastro');
const dropzone = qs('.dropzone-imagem');
const inputPesquisa = qs('.search-bar input');
const btnNovo = qs('#btnAbrirNovo');
const btnFecharNovo = qs('#btnFecharNovo');
const btnSubmit = qs('#btnSalvar');
const btnConfirmarExcluir = qs('#btnConfirmarExcluir');
const btnCancelarExcluir = qs('#btnCancelarExcluir');
const customSelect = qs('#customSelect');
const trigger = qs( '.custom-select-trigger', customSelect);
const hiddenInputCategoria = qs('#inputCategoria');
const options = qsa( '.custom-option', customSelect);
const inputFile = document.createElement('input');

inputFile.type = 'file';
inputFile.accept = 'image/*';

function getCampos() {
    return {
        nome: qs('[name="nome"]'),
        preco: qs('[name="preco"]'),
        quantidade: qs('[name="quantidade"]'),
        descricao: qs('[name="descricao"]'),
        categoria: qs('[name="categoria"]'),
        disponivel: qs('[name="disponivel"]')
    };
}

function refreshItens() {
    itens = qsa(
        '.item-lista',
        containerListagem
    );
}

const mensagemVazia = document.createElement('div');

mensagemVazia.id = 'mensagem-pesquisa-vazia';

mensagemVazia.innerHTML = `
<div style="text-align:center;padding:3rem 1rem;">
    <h3 class="msg-titulo"> Nenhum produto foi encontrado </h3>

    <p class="msg-sub"> Não encontramos resultados para sua busca. Tente outro nome ou categoria. </p>
</div>
`;

mensagemVazia.style.display = 'none';

containerListagem?.appendChild(
    mensagemVazia
);

function atualizarSelectCustomizado(valor) {
    if (!valor) {
        hiddenInputCategoria.value = '';

        qs('span', trigger).innerText = 'Selecionar categoria';

        options.forEach(option => {

            option.classList.remove('selected');
        });
        return;
    }

    hiddenInputCategoria.value = valor;

    const opcaoAlvo = options.find(option =>
        option.dataset.value === valor
    );

    if (!opcaoAlvo) return;

    qs('span', trigger).innerText = opcaoAlvo.innerText;

    options.forEach(option => {
        option.classList.remove('selected');
    });

    opcaoAlvo.classList.add('selected');
}

trigger?.addEventListener('click', e => {
    e.stopPropagation();
    customSelect.classList.toggle('open');
});

options.forEach(option => {
    option.addEventListener('click', () => {
        atualizarSelectCustomizado(
            option.dataset.value
        );

        customSelect.classList.remove('open');
    });
});

dropzone?.addEventListener('click', () => {
    inputFile.click();
});

inputFile.addEventListener('change', () => {

    const file = inputFile.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert('Imagem muito grande (máx: 2MB)');
        return;
    }

    const reader = new FileReader();

    reader.onload = e => {
        dropzone.innerHTML = `
            <img src="${e.target.result}" id="img-atual" >
        `;
    };

    reader.readAsDataURL(file);
});

inputPesquisa?.addEventListener('input', () => {

    const termo = inputPesquisa.value .toLowerCase() .trim();
    let encontrou = false;

    itens.forEach(item => {
        const nome = qs('h3', item) ?.innerText .toLowerCase() || '';
        const categoria = item.dataset.categoria ?.toLowerCase() || '';
        const descricao = qs('.descricao', item) ?.innerText .toLowerCase() || '';
        const match = nome.includes(termo) || categoria.includes(termo) || descricao.includes(termo);

        item.style.display = match ? 'flex' : 'none';

        if (match) {
            encontrou = true;
        }
    });

    mensagemVazia.style.display = (!encontrou && termo) ? 'block' : 'none';
});

function criarHTMLProduto({
    nome,
    preco,
    descricao,
    quantidade,
    categoria,
    img,
    indisponivel
}) {

    return `
    <div class="card-produto-visual">
        <div class="info-basica">
            <img src="${img}">

            <div class="nome-preco">
                <h3>${nome}</h3>
                <p>R$ ${preco}</p>
            </div>
        </div>

        <div class="divisor-vertical"></div>

        <p class="descricao">  ${descricao} </p>

        <div class="area-extra">
            <span class="categoria-produto"> ${categoria || 'Sem categoria'} </span>
            <span class="status-indisponivel" style=" display: ${indisponivel ? 'inline-block' : 'none'} " > Indisponível</span>
        </div>

    </div>

    <div class="controles-externos">
        <div class="badge-unidade"> ${quantidade}</div>

        <button class="btn-circular btn-editar" type="button">
            <img src="/static/assets/icons/lapis.png">
        </button>

        <button class="btn-circular btn-lixeira" type="button">
            <img src="/static/assets/icons/lixeira.png">
        </button>
    </div>
    `;
}

function vincularEventos(item) {
    const btnEditar = qs('.btn-editar', item);
    const btnLixeira = qs('.btn-lixeira', item);

    btnEditar?.addEventListener('click', () => {
        itemSendoEditado = item;
        indiceOriginal = qsa( '.item-lista', containerListagem).indexOf(item);

        const campos = getCampos();
        const nome = qs('h3', item)?.innerText || '';
        const preco = qs('.nome-preco p', item) ?.innerText .replace('R$ ', '') || '';
        const descricao = qs('.descricao', item) ?.innerText || '';
        const quantidade = qs('.badge-unidade', item) ?.innerText .replace(/\D/g, '') || '';
        const img = qs('img', item)?.src || '';
        const categoria = item.dataset.categoria || '';
        const indisponivel = item.classList.contains( 'indisponivel' );

        campos.nome.value = nome;
        campos.preco.value = preco;
        campos.quantidade.value = quantidade;
        campos.descricao.value = descricao;
        campos.disponivel.checked = !indisponivel;

        atualizarSelectCustomizado(
            categoria
        );

        dropzone.innerHTML = img
            ? `<img src="${img}" id="img-atual">`
            : '<p>Clique para adicionar a imagem</p>';

        btnSubmit.innerText = 'SALVAR ALTERAÇÕES';

        modalNovo.style.display = 'flex';
    });

    btnLixeira?.addEventListener('click', () => {
        itemParaDeletar = item;
        modalExcluir.style.display = 'flex';
    });
}

btnConfirmarExcluir?.addEventListener(
    'click',
    () => {
        itemParaDeletar?.remove();
        modalExcluir.style.display = 'none';
        refreshItens();
    }
);

btnCancelarExcluir?.addEventListener(
    'click',
    () => {
        modalExcluir.style.display = 'none';
    }
);

btnNovo?.addEventListener('click', () => {
    itemSendoEditado = null;
    indiceOriginal = null;
    formCadastro.reset();
    atualizarSelectCustomizado('');
    getCampos().disponivel.checked = true;
    dropzone.innerHTML = '<p>Clique para adicionar a imagem</p>';
    btnSubmit.innerText = 'CADASTRAR';
    modalNovo.style.display = 'flex';
});

function fecharModal() {
    modalNovo.style.display = 'none';
    formCadastro.reset();
    itemSendoEditado = null;
    indiceOriginal = null;
    atualizarSelectCustomizado('');
}

btnFecharNovo?.addEventListener(
    'click',
    fecharModal
);

formCadastro?.addEventListener(
    'submit',
    e => {
        e.preventDefault();

        const campos = getCampos();
        const imgPadrao = '/static/assets/images/img_produto_hamburger.png';
        const img = qs('#img-atual')?.src || imgPadrao;
        const indisponivel = !campos.disponivel.checked;
        const categoria = hiddenInputCategoria.value;
        const html = criarHTMLProduto({ nome: campos.nome.value, preco: campos.preco.value, descricao: campos.descricao.value, quantidade: campos.quantidade.value, categoria, img, indisponivel });

        if (itemSendoEditado) {
            itemSendoEditado.innerHTML = html;
            itemSendoEditado.classList.toggle(
                'indisponivel',
                indisponivel
            );

            itemSendoEditado.dataset.categoria =
                categoria;

            vincularEventos(
                itemSendoEditado
            );

        } else {
            const novo = document.createElement('article');

            novo.className = 'item-lista';

            if (indisponivel) {
                novo.classList.add(
                    'indisponivel'
                );
            }

            novo.dataset.categoria =  categoria;

            novo.innerHTML = html;

            containerListagem.insertBefore(
                novo,
                containerListagem.firstChild
            );

            vincularEventos(novo);
        }
        
        refreshItens();
        fecharModal();
    }
);

window.addEventListener('click', e => {
    if (e.target === modalNovo) {
        fecharModal();
    }

    if (e.target === modalExcluir) {
        modalExcluir.style.display = 'none';
    }

    if (
        customSelect &&
        !customSelect.contains(e.target)
    ) {

        customSelect.classList.remove(
            'open'
        );
    }
});

refreshItens();
itens.forEach(vincularEventos);