document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('#menu-toggle');
    const menuLinks = document.querySelector('#nav-links');

    if (hamburger && menuLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menuLinks.classList.toggle('active');
        });
    }

    const themeToggle = document.querySelector('#theme-switch');
    const temaSalvo = localStorage.getItem('theme');

    if (temaSalvo === 'dark') {
        document.body.classList.add('dark-theme');

        if (themeToggle) {
            themeToggle.checked = true;
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem(
                'theme',
                document.body.classList.contains('dark-theme')
                    ? 'dark'
                    : 'light'
            );
        });
    }
});