document.addEventListener('DOMContentLoaded', () => {
    const inputPesquisa = document.querySelector('.search-bar input');
    const containerListagem = document.getElementBy ('container-listagem');
    const filtroGeralWrapper = document.getElementById('filtroGeral');
    const inputFiltroGeral = document.getElementById('inputFiltroGeral');
    const mensagemVazia = document.createElement('div');

    mensagemVazia.id = 'msg-vazio';
    mensagemVazia.innerHTML = `
        <div style="text-align:center; padding: 4rem 1rem;">
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;"> O pedido que você procura não foi encontrado </h3>
            <p style="opacity: 0.8;"> Tente alterar o nome, número do pedido ou os filtros selecionados. </p>
        </div>
    `;

    mensagemVazia.style.display = 'none';
    containerListagem?.appendChild(mensagemVazia);

    function getItens() {
        return Array.from(containerListagem?.querySelectorAll('.item-lista') || []) .filter(i => i.id !== 'msg-vazio');
    }

    function filtrar() {
        const termo = (inputPesquisa?.value || '').toLowerCase().trim();
        const filtro = inputFiltroGeral?.value || 'todos';
        const isDark = document.body.classList.contains('dark-theme');
        
        let encontrou = false;

        getItens().forEach(item => {
            const nome = item.querySelector('h3')?.innerText.toLowerCase() || '';
            const id = item.querySelector('small')?.innerText.toLowerCase().replace('pedido:', '').replace('#', '').trim() || '';
            const data = item.querySelector('.descricao p')?.innerText.toLowerCase().replace('data:', '').trim() || '';
            const statusLabel = item.querySelector('.controles-externos .custom-select-trigger span')?.innerText.toLowerCase() || '';
            const matchTexto = nome.includes(termo) || id.includes(termo) || data.includes(termo);
            const matchStatus = filtro === 'todos' || statusLabel.includes(filtro);
            const show = matchTexto && matchStatus;

            item.style.display = show ? 'flex' : 'none';

            if (show) encontrou = true;
        });

        const itensVisiveis = getItens().filter(item => item.style.display !== 'none');
        const corBorda = isDark ? 'rgba(255, 255, 255, .1)' : 'rgba(101, 42, 14, .1)';

        getItens().forEach(item => item.style.borderTop = "none");
        if (itensVisiveis.length > 1) {
            for (let i = 1; i < itensVisiveis.length; i++) {
                itensVisiveis[i].style.borderTop = `.125rem solid ${corBorda}`;
            }
        }
       
        mensagemVazia.style.display = encontrou ? 'none' : 'block';
        mensagemVazia.querySelector('div').style.color = isDark ? '#F0ECE1' : '#652a0e';
    }

    const todosSelects = document.querySelectorAll('.custom-select');

    todosSelects.forEach(select => {
        const trigger = select.querySelector('.custom-select-trigger');
        const options = select.querySelectorAll('.custom-option');
        const span = select.querySelector('span');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            todosSelects.forEach(s => { if(s !== select) s.classList.remove('open'); });
            select.classList.toggle('open');
        });

        options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const valor = opt.dataset.value;
                const texto = opt.innerText;

                span.innerText = texto;
                select.classList.remove('open');

                if (select.id === 'filtroGeral') {
                    inputFiltroGeral.value = valor;
                    filtrar();
                } else {
                    filtrar(); 
                }
            });
        });
    });

    window.addEventListener('click', () => {
        todosSelects.forEach(s => s.classList.remove('open'));
    });

    inputPesquisa?.addEventListener('input', filtrar);

    filtrar();
});