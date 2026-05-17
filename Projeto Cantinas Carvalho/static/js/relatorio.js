document.addEventListener('DOMContentLoaded', () => {
    const filtroGeral = document.getElementById('filtroGeral');
    const dadosRelatorios = {
        "ult_7-d": {
            produtos: { "Misto Quente": 85, "Prato Feito": 40, "Coxinhas": 90, "Hambúrguer": 15 },
            status: { cancelado: 3, preparo: 2, entregue: 15, pendente: 4 },
            total: "840,50"
        },
        "ult_14-d": {
            produtos: { "Misto Quente": 180, "Prato Feito": 150, "Coxinhas": 60, "Hambúrguer": 120 },
            status: { cancelado: 7, preparo: 4, entregue: 28, pendente: 10 },
            total: "1.620,00"
        },
        "ult_30-d": {
            produtos: { "Misto Quente": 450, "Prato Feito": 320, "Coxinhas": 210, "Hambúrguer": 180 },
            status: { cancelado: 13, preparo: 5, entregue: 6, pendente: 8 },
            total: "3.768,94"
        },
        "todo-periodo": {
            produtos: { "Misto Quente": 1100, "Prato Feito": 950, "Coxinhas": 800, "Hambúrguer": 700 },
            status: { cancelado: 45, preparo: 12, entregue: 150, pendente: 20 },
            total: "12.450,00"
        }
    };

    function atualizarDashboard(periodo) {
        const dados = dadosRelatorios[periodo];
        if (!dados) return;

        const valores = Object.values(dados.produtos || {});
        const maiorValor = Math.max(...valores, 0);
        const valorMaxEscala = maiorValor > 0 ? Math.ceil(maiorValor * 1.1 / 10) * 10 : 100;

        const labels = {
            '.label-meio-1': 0.25,
            '.label-meio-2': 0.50,
            '.label-meio-3': 0.75,
            '.label-max': 1
        };

        Object.entries(labels).forEach(([seletor, mult]) => {
            const el = document.querySelector(seletor);
            if (el) el.innerText = Math.round(valorMaxEscala * mult);
        });

        const itensBarras = Array.from(document.querySelectorAll('.item-barra'));
        itensBarras.forEach(item => {
            const labelElement = item.querySelector('.label');
            if (!labelElement) return;

            const nomeProduto = labelElement.innerText.replace(/^\d+º\s/, "").trim();
            const valor = dados.produtos?.[nomeProduto] || 0;
            const largura = (valor / valorMaxEscala) * 100;

            const barra = item.querySelector('.barra-fill');
            if (barra) barra.style.width = largura + "%";
            item.dataset.valor = valor;
            item.dataset.nomeOriginal = nomeProduto;
        });

        itensBarras.sort((a, b) => Number(b.dataset.valor) - Number(a.dataset.valor))
            .forEach((item, index) => {
                item.style.order = index;
                const label = item.querySelector('.label');
                if (label) label.innerText = `${index + 1}º ${item.dataset.nomeOriginal}`;
            });

        const s = dados.status;
        const totalPedidos = s.cancelado + s.preparo + s.entregue + s.pendente;
        
        const p1 = (s.cancelado / totalPedidos) * 100;
        const p2 = p1 + (s.preparo / totalPedidos) * 100;
        const p3 = p2 + (s.entregue / totalPedidos) * 100;

        const rosca = document.querySelector('.rosca-manual');
        if (rosca) {
            rosca.style.setProperty('--p1', `${p1}%`);
            rosca.style.setProperty('--p2', `${p2}%`);
            rosca.style.setProperty('--p3', `${p3}%`);
        }

        const legendaContainer = document.querySelector('.legenda-rosca');
        if (legendaContainer) {
            legendaContainer.innerHTML = `
                <p><span class="dot vermelho"></span> Cancelado (${s.cancelado})</p>
                <p><span class="dot azul"></span> Em Preparo (${s.preparo})</p>
                <p><span class="dot verde"></span> Entregue (${s.entregue})</p>
                <p><span class="dot amarelo"></span> Pendente (${s.pendente})</p>
            `;
        }

        const valorTotal = document.querySelector('.valor-total p');
        if (valorTotal) valorTotal.innerHTML = `<span class="cifrao-verde">R$:</span> ${dados.total}`;

        document.querySelectorAll('.card').forEach(card => {
            card.style.transform = 'scale(0.99)';
            setTimeout(() => card.style.transform = '', 150);
        });
    }

    filtroGeral?.addEventListener('change', (e) => atualizarDashboard(e.target.value));
    atualizarDashboard("ult_7-d");
});