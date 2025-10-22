// Модуль для аккордеонов
// Инициализация аккордеонов: перенос .accord_bg с помощью GSAP Flip и клики
function initializeAccordions() {
    const accordLists = Array.from(document.querySelectorAll('.accord_list'));
    const accordItems = Array.from(document.querySelectorAll('.accord_item'));
    if (accordItems.length === 0) return;

    // Подготовка GSAP Flip
    if (typeof gsap === 'undefined') {
        console.warn('GSAP не загружен — аккордеон будет без анимации Flip.');
    }
    if (typeof gsap !== 'undefined') {
        if (window.Flip) {
            gsap.registerPlugin(Flip);
        } else if (gsap.Flip) {
            gsap.registerPlugin(gsap.Flip);
        }
    }

    // Находим единый фон .accord_bg (может быть размещен в первом элементе)
    let accordBg = document.querySelector('.accord_bg');
    if (!accordBg) {
        // Если в верстке нет .accord_bg, выходим тихо
        return;
    }

    // Обработчик наведения: переносим .accord_bg в наведенный элемент
    const onEnter = (item) => {
        if (!accordBg || typeof gsap === 'undefined' || (!window.Flip && !gsap.Flip)) {
            // Без Flip просто переносим без анимации
            if (accordBg.parentElement !== item) {
                item.appendChild(accordBg);
            }
            return;
        }
        // Сохраняем состояние до перемещения
        const state = Flip.getState(accordBg);
        if (accordBg.parentElement !== item) {
            item.appendChild(accordBg);
        }
        // Анимируем из сохраненного состояния
        Flip.from(state, {
            duration: 0.6,
            ease: 'expo.out'
        });
    };

    // Навешиваем hover
    accordItems.forEach((item) => {
        item.addEventListener('mouseenter', () => onEnter(item));
    });

    // Клики: активируем элемент и его .button_close_icon, снимаем с остальных
    const activateItem = (targetItem) => {
        accordItems.forEach((it) => {
            if (it === targetItem) return;
            it.classList.remove('is-active');
            const closeIcon = it.querySelector('.button_close_icon');
            if (closeIcon) closeIcon.classList.remove('is-active');
        });

        targetItem.classList.add('is-active');
        const targetCloseIcon = targetItem.querySelector('.button_close_icon');
        if (targetCloseIcon) targetCloseIcon.classList.add('is-active');
    };

    accordItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            // Предотвращаем нежелательные всплытия, если нужно
            // e.stopPropagation();
            if (item.classList.contains('is-active')) {
                item.classList.remove('is-active');
                const icon = item.querySelector('.button_close_icon');
                if (icon) icon.classList.remove('is-active');
                return;
            }
            activateItem(item);
        });
    });
}

// Экспорт функций для использования в main.js
window.AccordionsModule = {
    initializeAccordions
};