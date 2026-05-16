let itemSendoEditado=null
itemParaDeletar=null
indiceOriginal=null
itens=[];

const qs=(s,c=document)=>c.querySelector(s),
qsa=(s,c=document)=>[...c.querySelectorAll(s)];

const containerListagem=qs('#container-listagem'),

modalNovo=qs('#modalNovoProduto'),
modalExcluir=qs('#modalExcluir'),
formCadastro=qs('#formCadastro'),
dropzone=qs('.dropzone-imagem'),
inputPesquisa=qs('.search-bar input'),
themeToggle=qs('#theme-switch'),
btnNovo=qs('#btnAbrirNovo'),
btnFecharNovo=qs('#btnFecharNovo'),
btnSubmit=qs('#btnSalvar'),
btnConfirmarExcluir=qs('#btnConfirmarExcluir'),
btnCancelarExcluir=qs('#btnCancelarExcluir'),
customSelect=qs('#customSelect'),
trigger=qs('.custom-select-trigger',customSelect),
hiddenInputCategoria=qs('#inputCategoria'),
options=qsa('.custom-option',customSelect);

const inputFile=document.createElement('input');

inputFile.type='file';
inputFile.accept='image/*';

const getCampos=()=>({
    nome:qs('[name="nome"]'),
    preco:qs('[name="preco"]'),
    quantidade:qs('[name="quantidade"]'),
    descricao:qs('[name="descricao"]'),
    categoria:qs('[name="categoria"]'),
    disponivel:qs('[name="disponivel"]')
});

const refreshItens=()=>itens=qsa('.item-lista',containerListagem);

const mensagemVazia=document.createElement('div');

mensagemVazia.id='mensagem-pesquisa-vazia';

mensagemVazia.innerHTML=`
<div style="text-align:center;padding:3rem 1rem;">
    <h3 class="msg-titulo">Nenhum produto foi encontrado</h3>
    <p class="msg-sub"> Não encontramos resultados para sua busca. Tente usar outro nome, categoria ou verifique a ortografia.</p>
</div>
`;

mensagemVazia.style.display='none';

containerListagem?.appendChild(mensagemVazia);

const savedTheme=localStorage.getItem('theme');

if(savedTheme==='dark'){
    document.body.classList.add('dark-theme');
    if(themeToggle) themeToggle.checked=true;
}

themeToggle?.addEventListener('change',()=>{
    document.body.classList.toggle('dark-theme');

    localStorage.setItem(
        'theme',
        document.body.classList.contains('dark-theme')
        ? 'dark'
        : 'light'
    );
});

function atualizarSelectCustomizado(valor){
    if(!valor){
        hiddenInputCategoria.value='';
        qs('span',trigger).innerText='Selecionar categoria';

        options.forEach(opt=>
            opt.classList.remove('selected')
        );

        return;
    }

    hiddenInputCategoria.value=valor;

    const opcaoAlvo=options.find(
        opt=>opt.dataset.value===valor
    );

    if(!opcaoAlvo) return;

    qs('span',trigger).innerText=opcaoAlvo.innerText;

    options.forEach(opt=>
        opt.classList.remove('selected')
    );

    opcaoAlvo.classList.add('selected');
}

trigger?.addEventListener('click',e=>{
    e.stopPropagation();
    customSelect.classList.toggle('open');
});

options.forEach(option=>{
    option.addEventListener('click',()=>{
        atualizarSelectCustomizado(option.dataset.value);
        customSelect.classList.remove('open');
    });
});

dropzone?.addEventListener('click',()=>inputFile.click());

inputFile.addEventListener('change',()=>{
    const file=inputFile.files[0];

    if(!file) return;

    if(file.size>2*1024*1024){
        alert('Imagem muito grande (máx: 2MB)');
        return;
    }

    const reader=new FileReader();

    reader.onload=e=>{
        dropzone.innerHTML=`
            <img src="${e.target.result}" id="img-atual">
        `;
    };

    reader.readAsDataURL(file);
});

inputPesquisa?.addEventListener('input',()=>{
    const termo=inputPesquisa.value.toLowerCase().trim();

    let encontrou=false;

    itens.forEach(item=>{
        const nome=qs('h3',item)?.innerText.toLowerCase()||'',
        categoria=item.dataset.categoria?.toLowerCase()||'',
        descricao=qs('.descricao',item)?.innerText.toLowerCase()||'';

        const match=
            nome.includes(termo) ||
            categoria.includes(termo) ||
            descricao.includes(termo);

        item.style.display=match?'flex':'none';

        if(match) encontrou=true;
    });

    mensagemVazia.style.display=
        (!encontrou && termo)
        ? 'block'
        : 'none';
});

function vincularEventos(item){
    const btnEditar=qs('.btn-editar',item),
    btnLixeira=qs('.btn-lixeira',item);

    btnEditar?.addEventListener('click',()=>{
        itemSendoEditado=item;

        indiceOriginal=qsa(
            '.item-lista',
            containerListagem
        ).indexOf(item);

        const campos=getCampos(),

        nome=qs('h3',item)?.innerText||'',
        preco=qs('.nome-preco p',item)?.innerText.replace('R$ ','')||'',
        descricao=qs('.descricao',item)?.innerText||'',
        quantidade=qs('.badge-unidade',item)?.innerText.replace(/\D/g,'')||'',
        img=qs('img',item)?.src||'',
        categoria=item.dataset.categoria||'',
        indisponivel=item.classList.contains('indisponivel');

        campos.nome.value=nome;
        campos.preco.value=preco;
        campos.quantidade.value=quantidade;
        campos.descricao.value=descricao;
        campos.disponivel.checked=!indisponivel;

        atualizarSelectCustomizado(categoria);

        dropzone.innerHTML=img
            ? `<img src="${img}" id="img-atual">`
            : '<p>Clique para adicionar a imagem</p>';

        btnSubmit.innerText='SALVAR ALTERAÇÕES';
        modalNovo.style.display='flex';
    });

    btnLixeira?.addEventListener('click',()=>{
        itemParaDeletar=item;
        modalExcluir.style.display='flex';
    });
}

btnConfirmarExcluir?.addEventListener('click',()=>{
    itemParaDeletar?.remove();
    modalExcluir.style.display='none';
    refreshItens();
});

btnCancelarExcluir?.addEventListener('click',()=>{
    modalExcluir.style.display='none';
});

btnNovo?.addEventListener('click',()=>{
    itemSendoEditado=null;
    indiceOriginal=null;

    formCadastro.reset();

    atualizarSelectCustomizado('');

    getCampos().disponivel.checked=true;

    dropzone.innerHTML=
        '<p>Clique para adicionar a imagem</p>';

    btnSubmit.innerText='CADASTRAR';

    modalNovo.style.display='flex';
});

const fecharModal=()=>{
    modalNovo.style.display='none';
    formCadastro.reset();
    itemSendoEditado=null;
    indiceOriginal=null;
    atualizarSelectCustomizado('');
};

btnFecharNovo?.addEventListener(
    'click',
    fecharModal
);

formCadastro?.addEventListener('submit',e=>{
    e.preventDefault();

    const campos=getCampos(),
    imgPadrao='/static/assets/images/img_produto_hamburger.png',
    img=qs('#img-atual')?.src||imgPadrao,
    indisponivel=!campos.disponivel.checked,
    categoria=hiddenInputCategoria.value;

    const html=`
    <div class="card-produto-visual">
        <div class="info-basica">
            <img src="${img}">

            <div class="nome-preco">
                <h3>${campos.nome.value}</h3>
                <p>R$ ${campos.preco.value}</p>
            </div>
        </div>

        <div class="divisor-vertical"></div>

        <p class="descricao">
            ${campos.descricao.value}
        </p>

        <div class="area-extra">
            <span class="categoria-produto">
                ${categoria || 'Sem categoria'}
            </span>

            <span
                class="status-indisponivel"
                style="
                    display:
                    ${
                        indisponivel
                        ? 'inline-block'
                        : 'none'
                    }
                "
            >
                Indisponível
            </span>
        </div>
    </div>

    <div class="controles-externos">
        <div class="badge-unidade">
            ${campos.quantidade.value}
        </div>

        <button
            class="btn-circular btn-editar"
            type="button"
        >
            <img src="/static/assets/icons/lapis.png">
        </button>

        <button
            class="btn-circular btn-lixeira"
            type="button"
        >
            <img src="/static/assets/icons/lixeira.png">
        </button>
    </div>
    `;

    if(itemSendoEditado){
        itemSendoEditado.innerHTML=html;

        itemSendoEditado.classList.toggle(
            'indisponivel',
            indisponivel
        );

        itemSendoEditado.dataset.categoria=
            categoria;

        vincularEventos(itemSendoEditado);

    } else {
        const novo=document.createElement('article');

        novo.className='item-lista';

        if(indisponivel){
            novo.classList.add('indisponivel');
        }

        novo.dataset.categoria=categoria;

        novo.innerHTML=html;

        containerListagem.insertBefore(
            novo,
            containerListagem.firstChild
        );

        vincularEventos(novo);
    }

    refreshItens();
    fecharModal();
});

window.addEventListener('click',e=>{
    if(e.target===modalNovo){
        fecharModal();
    }

    if(e.target===modalExcluir){
        modalExcluir.style.display='none';
    }

    if(!customSelect.contains(e.target)){
        customSelect.classList.remove('open');
    }
});

refreshItens();

itens.forEach(vincularEventos);