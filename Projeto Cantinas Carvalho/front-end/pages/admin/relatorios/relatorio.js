document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-switch');
    const filtroGeral = document.getElementById('filtroGeral');

    const dadosRelatorios = {
        "ult_7-d": {
            produtos: { "Misto Quente": 85, "Prato Feito": 40, "Coxinhas": 90, "Hambúrguer": 15 },
            status: { cancelado: 3, preparo: 2, entregue: 15, pendente: 4 },
            total: "840,50",
            cortesRosca: { p1: 15, p2: 25, p3: 85 } 
        },
        "ult_14-d": {
            produtos: { "Misto Quente": 180, "Prato Feito": 150, "Coxinhas": 60, "Hambúrguer": 120 },
            status: { cancelado: 7, preparo: 4, entregue: 28, pendente: 10 },
            total: "1.620,00",
            cortesRosca: { p1: 15, p2: 25, p3: 80 }
        },
        "ult_30-d": {
            produtos: { "Misto Quente": 450, "Prato Feito": 320, "Coxinhas": 210, "Hambúrguer": 180 },
            status: { cancelado: 13, preparo: 5, entregue: 6, pendente: 8 },
            total: "3.768,94",
            cortesRosca: { p1: 35, p2: 55, p3: 75 }
        },
        "todo-periodo": {
            produtos: { "Misto Quente": 1100, "Prato Feito": 950, "Coxinhas": 800, "Hambúrguer": 700 },
            status: { cancelado: 45, preparo: 12, entregue: 150, pendente: 20 },
            total: "12.450,00",
            cortesRosca: { p1: 10, p2: 20, p3: 90 }
        }
    };

    function atualizarDashboard(periodo) {
        const dados = dadosRelatorios[periodo];
        if (!dados) return;

        const valores = Object.values(dados.produtos);
        const maiorValorReal = Math.max(...valores);
    
        const valorMaxEscala = maiorValorReal > 0 ? Math.ceil(maiorValorReal * 1.1 / 10) * 10 : 100;

        document.querySelector('.label-meio-1').innerText = Math.round(valorMaxEscala * 0.25);
        document.querySelector('.label-meio-2').innerText = Math.round(valorMaxEscala * 0.50);
        document.querySelector('.label-meio-3').innerText = Math.round(valorMaxEscala * 0.75);
        document.querySelector('.label-max').innerText = valorMaxEscala;

        const itensBarras = Array.from(document.querySelectorAll('.item-barra'));
        
        itensBarras.forEach(item => {
            const labelElement = item.querySelector('.label');
            const nomeProduto = labelElement.innerText.replace(/^\d+º\s/, "").trim(); 
            const valor = dados.produtos[nomeProduto] || 0;

            const larguraPercentual = (valor / valorMaxEscala) * 100;
            item.querySelector('.barra-fill').style.width = larguraPercentual + "%";
            item.dataset.valor = valor; 
        });

        itensBarras.sort((a, b) => parseFloat(b.dataset.valor) - parseFloat(a.dataset.valor));

        itensBarras.forEach((item, index) => {
            item.style.order = index; 
            const labelElement = item.querySelector('.label');
            const nomeLimpo = labelElement.innerText.replace(/^\d+º\s/, "").trim();
            labelElement.innerText = `${index + 1}º ${nomeLimpo}`;
        });

        const rosca = document.querySelector('.rosca-manual');
        if (rosca && dados.cortesRosca) {
            rosca.style.setProperty('--p1', `${dados.cortesRosca.p1}%`);
            rosca.style.setProperty('--p2', `${dados.cortesRosca.p2}%`);
            rosca.style.setProperty('--p3', `${dados.cortesRosca.p3}%`);
        }

        const valorTotalTexto = document.querySelector('.valor-total p');
        if (valorTotalTexto) {
            valorTotalTexto.innerHTML = `<span class="cifrao-verde">R$:</span> ${dados.total}`;
        }

        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.transform = 'scale(0.99)';
            setTimeout(() => card.style.transform = '', 150);
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    if (filtroGeral) {
        filtroGeral.addEventListener('change', (e) => {
            atualizarDashboard(e.target.value);
        });
    }

    atualizarDashboard("ult_7-d");
});