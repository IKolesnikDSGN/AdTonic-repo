// Модуль для модальных окон
// Модалка: функции открытия/закрытия и инициализация
function openModal() {
    const backdrop = document.querySelector('.modal_backdrop');
    const wrap = document.querySelector('.modal_wrap');
    const contain = document.querySelector('.modal_contain');
    if (backdrop) backdrop.classList.add('is-opened');
    if (wrap) wrap.classList.add('is-opened');
    if (contain) contain.classList.add('is-opened');
}

function closeModal() {
    const backdrop = document.querySelector('.modal_backdrop');
    const wrap = document.querySelector('.modal_wrap');
    const contain = document.querySelector('.modal_contain');
    if (backdrop) backdrop.classList.remove('is-opened');
    if (wrap) wrap.classList.remove('is-opened');
    if (contain) contain.classList.remove('is-opened');
}

function initializeModal() {
    const openButtons = [
        ...document.querySelectorAll('.button_main_сontact'), // возможная кириллица в классе
        ...document.querySelectorAll('.button_main_contact'),  // латиница в классе на случай опечатки
        ...document.querySelectorAll('[data-open-modal]'),
        ...document.querySelectorAll('[data-action="open-modal"]'),
        ...document.querySelectorAll('[data-modal-open]')
    ];
    const closeButtons = document.querySelectorAll('.modal_close_wrap');
    const backdrop = document.querySelector('.modal_backdrop');
    const modalWrap = document.querySelector('.modal_wrap');
    const modalContain = document.querySelector('.modal_contain');

    if (openButtons.length === 0) {
        console.warn('Кнопка(и) открытия модалки не найдены. Добавьте атрибут data-open-modal к вашей кнопке.');
    }
    openButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

    // Делегирование кликов для динамически добавленных кнопок
    document.addEventListener('click', (e) => {
        const opener = e.target.closest('.button_main_сontact, .button_main_contact, [data-open-modal], [data-action="open-modal"], [data-modal-open]');
        if (opener) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        }
    });

    if (closeButtons.length > 0) {
        closeButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal();
            });
        });
    }

    // Блокируем всплытие кликов внутри содержимого, чтобы вне-клик не закрыл модалку
    if (modalContain) {
        modalContain.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Закрытие по клику на подложку или пустое пространство в wrap
    if (backdrop) {
        backdrop.addEventListener('click', () => closeModal());
    }
    if (modalWrap) {
        modalWrap.addEventListener('click', (e) => {
            if (!modalContain || !modalContain.contains(e.target)) {
                closeModal();
            }
        });
    }

    // Закрытие по клику в любом месте вне modal_contain (на всякий случай)
    document.addEventListener('click', (e) => {
        const isOpened = document.querySelector('.modal_wrap.is-opened');
        if (!isOpened) return;
        if (modalContain && !modalContain.contains(e.target)) {
            // исключаем клик по кнопке открытия
            if (openButtons.some((btn) => btn.contains(e.target))) return;
            closeModal();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const isOpened = document.querySelector('.modal_wrap.is-opened');
            if (isOpened) closeModal();
        }
    });
}

// Экспорт функций для использования в main.js
window.ModalModule = {
    openModal,
    closeModal,
    initializeModal
};