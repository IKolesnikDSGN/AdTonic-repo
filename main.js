// GSAP easing функции
const smoothEase = "power2.out";
const expoOut = "expo.out";

// Оригинальный elasticEaseOut из CSS
const elasticEaseOut = 'linear(0, 0.5737 7.6%, 0.8382 11.87%, 0.9463 14.19%, 1.0292 16.54%, 1.0886 18.97%, 1.1258 21.53%, 1.137 22.97%, 1.1424 24.48%, 1.1423 26.1%, 1.1366 27.86%, 1.1165 31.01%, 1.0507 38.62%, 1.0219 42.57%, 0.9995 46.99%, 0.9872 51.63%, 0.9842 58.77%, 1.0011 81.26%, 1)';

// Проверяем доступность GSAP
if (typeof gsap === 'undefined') {
    console.error('GSAP не загружен! Пожалуйста, подключите GSAP перед этим скриптом.');
}

// Функция для создания и добавления CSS стилей для nav_menu_wrap
function createHoverStyles() {
    const styleId = 'nav-menu-hover-styles';
    
    // Проверяем, не добавлены ли стили уже
    if (document.getElementById(styleId)) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .nav_menu_wrap {
            transition: width 0.6s ${elasticEaseOut}, opacity 0.3s ease, background-color 0.2s ease;
            contain: layout style;
        }
        
        .nav_menu_wrap.is-hovered {
            transition: width 0.6s ${elasticEaseOut}, opacity 0.3s ease, background-color 0.2s ease;
        }
        
        /* Исключаем кнопки из универсальных transition правил */
        .nav_menu_wrap > *:not([data-button-main]) * {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .nav_menu_wrap.is-hovered > *:not([data-button-main]) * {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        /* Базовые стили для дочерних элементов (исключая кнопки) */
        .nav_menu_wrap > *:not([data-button-main]) {
            opacity: 0;
            transform: translateX(30px);
            transition: opacity 0.3s ease, transform 0.45s ${elasticEaseOut};
        }
        
        /* Специальные стили для первого дочернего элемента */
        .nav_menu_wrap > *:first-child {
            opacity: 1;
            transform: translateX(0);
            transition: opacity 0.3s ease; /* Только для прозрачности, без transform */
        }
        
        .nav_menu_wrap.is-hovered > *:first-child {
            opacity: 0.5;
        }
        
        /* Стили для дочерних элементов с классом is-hovered (исключая кнопки) */
        .nav_menu_wrap > *:not([data-button-main]).is-hovered {
            opacity: 1;
            transform: translateX(0);
        }
        
        .nav_menu_wrap > *:first-child.is-hovered {
            opacity: 0.5;
        }
        
        /* Отдельные стили для элементов кроме первого с elasticEaseOut (исключая кнопки) */
        .nav_menu_wrap > *:not(:first-child):not([data-button-main]) {
            transition: opacity 0.3s ease, transform 0.6s ${elasticEaseOut};
        }
        
        /* Специальные стили для кнопок в nav_menu_wrap */
        .nav_menu_wrap > [data-button-main] {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .nav_menu_wrap.is-hovered > [data-button-main] {
            opacity: 1;
        }
        
        /* Важно: отключаем transition для внутренних элементов кнопок */
        .nav_menu_wrap [data-button-main] * {
            transition: none !important;
        }
        
        /* Отключаем transition для .button_main_bg-span чтобы GSAP работал корректно */
        .nav_menu_wrap [data-button-main] .button_main_bg-span {
            transition: none !important;
        }
        
        /* Дополнительная специфичность для кнопок в навигации */
        .nav_menu_wrap > [data-button-main].is-hovered {
            opacity: 1 !important;
        }
    `;
    
    document.head.appendChild(style);
    console.log('CSS стили для nav_menu_wrap добавлены');
}

// Функция для создания CSS стилей для nav_logo_wrap
function createLogoStyles() {
    const styleId = 'nav-logo-styles';
    
    // Проверяем, не добавлены ли стили уже
    if (document.getElementById(styleId)) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Базовые стили для nav_logo_wrap */
        .nav_logo_wrap {
            width: 3rem;
            overflow: hidden;
            transition: width 0.6s ${elasticEaseOut};
        }
        
        /* Стили при наведении для nav_logo_wrap */
        .nav_logo_wrap.is-hovered {
            width: 10rem;
        }
        
        /* Базовые стили для nav_logo_mark-wrap */
        .nav_logo_mark-wrap {
            transform: translateY(0%);
            opacity: 1;
        }
        
        /* Базовые стили для nav_logo_path */
        .nav_logo_path {
            transform: translateY(100%);
            opacity: 0;
        }
    `;
    
    document.head.appendChild(style);
    console.log('CSS стили для nav_logo_wrap добавлены');
}

// CSS для кнопок с атрибутом [data-button-main]
function createButtonMainStyles() {
    const styleId = 'button-main-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Исходное состояние фона кнопки */
        [data-button-main] .button_main_bg-span {
            transform: scale(0) rotateX(0deg) translateY(0%);
            transform-origin: center center;
            will-change: transform;
            backface-visibility: hidden;
        }
    `;

    document.head.appendChild(style);
}

// Инициализация поведения hover/leave для [data-button-main] с GSAP
function initializeButtonMainHover() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP не загружен! Анимации кнопок не будут работать.');
        return;
    }

    createButtonMainStyles();

    const buttons = Array.from(document.querySelectorAll('[data-button-main]'));
    if (buttons.length === 0) return;
    
    console.log('Найдено кнопок [data-button-main]:', buttons.length);
    buttons.forEach((btn, index) => {
        console.log(`Кнопка ${index + 1}:`, btn, 'Родитель:', btn.parentElement?.classList.toString());
    });

    buttons.forEach((btn) => {
        const bgSpan = btn.querySelector('.button_main_bg-span');
        if (!bgSpan) return;

        // Храним ссылки на активные анимации для прерывания
        let hoverTween = null;
        let leaveTween = null;

        // На вход курсора
        btn.addEventListener('mouseenter', () => {
            // Прерываем анимацию ухода, если она активна
            if (leaveTween) {
                leaveTween.kill();
                leaveTween = null;
            }

            // Прерываем анимацию наведения, если она уже активна
            if (hoverTween) {
                hoverTween.kill();
            }

            // Запускаем анимацию наведения с текущего состояния
            hoverTween = gsap.to(bgSpan, {
                scale: 1,
                rotateX: 0,
                y: 0,
                duration: 0.3,
                ease: "back.out",
                onComplete: () => {
                    hoverTween = null;
                }
            });
        });

        // На выход курсора
        btn.addEventListener('mouseleave', () => {
            // Прерываем анимацию наведения, если она активна
            if (hoverTween) {
                hoverTween.kill();
                hoverTween = null;
            }

            // Прерываем анимацию ухода, если она уже активна
            if (leaveTween) {
                leaveTween.kill();
            }

            // Запускаем анимацию ухода с текущего состояния
            leaveTween = gsap.to(bgSpan, {
                rotateX: 90,
                y: '100%',
                duration: 0.3,
                ease: "back.inOut",
                onComplete: () => {
                    // Мгновенно возвращаем в исходное состояние
                    gsap.set(bgSpan, {
                        scale: 0,
                        rotateX: 0,
                        y: 0
                    });
                    leaveTween = null;
                }
            });
        });
    });
}


// Функция для поиска элементов nav_menu_wrap
function findNavMenuWrap() {
    const navMenuWrap = document.querySelectorAll('.nav_menu_wrap');
    
    if (navMenuWrap.length === 0) {
        console.warn('Элементы .nav_menu_wrap не найдены');
        return null;
    }
    
    return navMenuWrap;
}

// Функция для поиска элементов nav_logo_wrap
function findNavLogoWrap() {
    const navLogoWrap = document.querySelectorAll('.nav_logo_wrap');
    
    if (navLogoWrap.length === 0) {
        console.warn('Элементы .nav_logo_wrap не найдены');
        return null;
    }
    
    return navLogoWrap;
}

// Функция для добавления класса is-hovered с анимацией
function addHoverClass(element) {
    if (!element) return;
    
    // Получаем всех детей до добавления класса
    const children = Array.from(element.children);
    
    console.log('addHoverClass вызван для:', element);
    console.log('Дети:', children.map(child => ({ tag: child.tagName, hasButtonMain: child.hasAttribute('data-button-main') })));
    
    // Сначала добавляем класс к основному элементу
    element.classList.add('is-hovered');
    
    // Применяем анимацию к детям с staggering
    children.forEach((child, index) => {
        // Для кнопок не добавляем класс is-hovered, так как они управляются CSS
        if (child.hasAttribute('data-button-main')) {
            console.log('Пропускаем кнопку:', child);
            return;
        }
        
        // Добавляем класс с задержкой для staggering эффекта
        setTimeout(() => {
            child.classList.add('is-hovered');
            console.log('Добавлен класс is-hovered к:', child);
        }, index * 125); // Увеличил stagger в 1.5 раза: 100ms * 1.5 = 150ms
    });
}

// Функция для удаления класса is-hovered
function removeHoverClass(element) {
    if (!element) return;
    
    // Получаем всех детей
    const children = Array.from(element.children);
    
    // Сначала убираем класс с основного элемента
    element.classList.remove('is-hovered');
    
    // Затем убираем класс с дочерних элементов (обратный staggering)
    children.reverse().forEach((child, index) => {
        // Для кнопок не убираем класс is-hovered, так как они управляются CSS
        if (child.hasAttribute('data-button-main')) {
            return;
        }
        
        setTimeout(() => {
            child.classList.remove('is-hovered');
        }, index * 50); // Увеличил stagger для удаления: 50ms * 1.5 = 75ms
    });
}

// Функция для добавления анимации наведения на nav_logo_wrap
function addLogoHoverClass(element) {
    if (!element || typeof gsap === 'undefined') return;
    
    const logoMarkWrap = element.querySelector('.nav_logo_mark-wrap');
    const logoPaths = element.querySelectorAll('.nav_logo_path');
    
    // Добавляем класс для CSS анимации ширины
    element.classList.add('is-hovered');
    
    // Анимация nav_logo_mark-wrap через GSAP
    if (logoMarkWrap) {
        gsap.to(logoMarkWrap, {
            y: '-200%',
            opacity: 0,
            duration: 0.5,
            ease: smoothEase
        });
    }
    
    // Анимация nav_logo_path элементов с staggering от центра через GSAP
    if (logoPaths.length > 0) {
        gsap.to(logoPaths, {
            y: '0%',
            opacity: 1,
            duration: 0.5,
            ease: expoOut,
            stagger: {
                amount: 0.045,
                from: "center"
            }
        });
    }
    
    console.log('Анимация наведения nav_logo_wrap запущена (CSS + GSAP)');
}

// Функция для удаления анимации наведения с nav_logo_wrap
function removeLogoHoverClass(element) {
    if (!element || typeof gsap === 'undefined') return;
    
    const logoMarkWrap = element.querySelector('.nav_logo_mark-wrap');
    const logoPaths = element.querySelectorAll('.nav_logo_path');
    
    // Анимация nav_logo_mark-wrap обратно через GSAP
    if (logoMarkWrap) {
        gsap.to(logoMarkWrap, {
            y: '0%',
            opacity: 1,
            duration: 0.5,
            ease: expoOut
        });
    }
    
    // Анимация nav_logo_path элементов обратно с обратным staggering от центра через GSAP
    if (logoPaths.length > 0) {
        gsap.to(logoPaths, {
            y: '100%',
            opacity: 0,
            duration: 0.5,
            ease: expoOut,
            stagger: {
                amount: 0.075,
                from: "center"
            }
        });
    }
    
    // Убираем класс для CSS анимации ширины
    element.classList.remove('is-hovered');
    
    console.log('Анимация увода nav_logo_wrap запущена (CSS + GSAP)');
}

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

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Создаем CSS стили для анимации nav_menu_wrap
    createHoverStyles();
    
    // Создаем базовые CSS стили для nav_logo_wrap
    createLogoStyles();
    
    const navMenuWrapElements = findNavMenuWrap();
    
    if (navMenuWrapElements) {
        // Добавляем обработчики событий к каждому найденному элементу nav_menu_wrap
        navMenuWrapElements.forEach((element, index) => {
            element.addEventListener('mouseenter', function() {
                addHoverClass(this);
            });
            
            element.addEventListener('mouseleave', function() {
                removeHoverClass(this);
            });
        });
        
        console.log(`Обработчики наведения добавлены к ${navMenuWrapElements.length} элементам .nav_menu_wrap`);
    }
    
    const navLogoWrapElements = findNavLogoWrap();
    
    if (navLogoWrapElements) {
        // Добавляем обработчики событий к каждому найденному элементу nav_logo_wrap
        navLogoWrapElements.forEach((element, index) => {
            element.addEventListener('mouseenter', function() {
                addLogoHoverClass(this);
            });
            
            element.addEventListener('mouseleave', function() {
                removeLogoHoverClass(this);
            });
        });
        
        console.log(`GSAP обработчики наведения добавлены к ${navLogoWrapElements.length} элементам .nav_logo_wrap`);
    }

    // Инициализация модалки
    initializeModal();

	// Инициализация ScrollTrigger анимаций героев
	if (typeof initializeHeroScrollTriggers === 'function') {
		initializeHeroScrollTriggers();
	}

	// Инициализация ScrollTrigger для services_item → nav_icon
	if (typeof initializeServicesNavIconScroll === 'function') {
		initializeServicesNavIconScroll();
	}

	// Применение анимированного фильтра пикселизации к текстовым элементам .principles_p_wrap
	createAnimatedPixelateFilter();

	// Инициализация hover-анимаций для [data-button-main]
	initializeButtonMainHover();

	// Инициализация аккордеонов с GSAP Flip
	initializeAccordions();
});

// Дополнительная функция для ручного вызова (если нужно)
function initializeNavMenuHover() {
    // Создаем CSS стили для анимации nav_menu_wrap
    createHoverStyles();
    
    const navMenuWrapElements = findNavMenuWrap();
    
    if (navMenuWrapElements) {
        // Убираем старые обработчики и добавляем новые к каждому элементу
        navMenuWrapElements.forEach((element) => {
            // Создаем новые обработчики для каждого элемента
            const mouseEnterHandler = function() {
                addHoverClass(this);
            };
            
            const mouseLeaveHandler = function() {
                removeHoverClass(this);
            };
            
            // Добавляем новые обработчики
            element.addEventListener('mouseenter', mouseEnterHandler);
            element.addEventListener('mouseleave', mouseLeaveHandler);
        });
        
        console.log(`Обработчики наведения переинициализированы для ${navMenuWrapElements.length} элементов .nav_menu_wrap`);
    }
}

// Дополнительная функция для инициализации логотипа (если нужно)
function initializeNavLogoHover() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP не загружен! Анимации логотипа не будут работать.');
        return;
    }
    
    // Создаем базовые CSS стили для nav_logo_wrap
    createLogoStyles();
    
    const navLogoWrapElements = findNavLogoWrap();
    
    if (navLogoWrapElements) {
        // Убираем старые обработчики и добавляем новые к каждому элементу
        navLogoWrapElements.forEach((element) => {
            // Создаем новые обработчики для каждого элемента
            const mouseEnterHandler = function() {
                addLogoHoverClass(this);
            };
            
            const mouseLeaveHandler = function() {
                removeLogoHoverClass(this);
            };
            
            // Добавляем новые обработчики
            element.addEventListener('mouseenter', mouseEnterHandler);
            element.addEventListener('mouseleave', mouseLeaveHandler);
        });
        
        console.log(`GSAP обработчики наведения переинициализированы для ${navLogoWrapElements.length} элементов .nav_logo_wrap`);
    }
}

// Дополнительная функция для ручного применения фильтра пикселизации
function initializePixelateFilter() {
    applyPixelateFilterToImages();
}

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

// Функция для создания и применения SVG фильтра пикселизации
function createPixelateFilter() {
    const filterId = 'pixelate-filter';
    
    // Проверяем, не добавлен ли фильтр уже
    if (document.getElementById(filterId)) {
        return filterId;
    }
    
    // Создаем SVG элемент с фильтром
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.visibility = 'hidden';
    
    // Создаем элемент defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Создаем фильтр
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    
    // Создаем элементы фильтра для текста (мелкие пиксели ~10 на букву)
    const flood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    flood.setAttribute('x', '0.7');
    flood.setAttribute('y', '0.7');
    flood.setAttribute('height', '0.7');
    flood.setAttribute('width', '0.7');
    
    const composite1 = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    composite1.setAttribute('width', '3');
    composite1.setAttribute('height', '3');
    
    const tile = document.createElementNS('http://www.w3.org/2000/svg', 'feTile');
    tile.setAttribute('result', 'a');
    
    const composite2 = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    composite2.setAttribute('in', 'SourceGraphic');
    composite2.setAttribute('in2', 'a');
    composite2.setAttribute('operator', 'in');
    
    const morphology = document.createElementNS('http://www.w3.org/2000/svg', 'feMorphology');
    morphology.setAttribute('operator', 'dilate');
    morphology.setAttribute('radius', '0.75');
    
    // Добавляем элементы в фильтр
    filter.appendChild(flood);
    filter.appendChild(composite1);
    filter.appendChild(tile);
    filter.appendChild(composite2);
    filter.appendChild(morphology);
    
    // Добавляем фильтр в defs
    defs.appendChild(filter);
    
    // Добавляем defs в SVG
    svg.appendChild(defs);
    
    // Добавляем SVG в документ
    document.body.appendChild(svg);
    
    console.log('SVG фильтр пикселизации создан');
    return filterId;
}

// Функция для применения фильтра к текстовым элементам .principles_p_wrap
function applyPixelateFilterToImages() {
    const images = document.querySelectorAll('.principles_p_wrap');
    
    if (images.length === 0) {
        console.warn('Элементы с классом .principles_p_wrap не найдены');
        return;
    }
    
    // Создаем фильтр
    const filterId = createPixelateFilter();
    
    // Применяем фильтр к каждому текстовому элементу
    images.forEach((element, index) => {
        element.style.filter = `url(#${filterId})`;
        console.log(`Фильтр пикселизации применен к текстовому элементу ${index + 1}`);
    });
    
    console.log(`Фильтр пикселизации применен к ${images.length} текстовым элементам .principles_p_wrap`);
}

// Анимированная версия createPixelateFilter с ScrollTrigger
function createAnimatedPixelateFilter() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP не загружен! Анимированный пиксельный фильтр не будет работать.');
        return;
    }

    // Регистрация ScrollTrigger
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    } else if (gsap.ScrollTrigger) {
        gsap.registerPlugin(gsap.ScrollTrigger);
    } else {
        console.warn('GSAP ScrollTrigger не найден. Подключите плагин ScrollTrigger.');
        return;
    }

    // Ищем триггер элемент
    const triggerElement = document.querySelector('.principles_text_wrap');
    if (!triggerElement) {
        console.warn('Элемент .principles_text_wrap не найден');
        return;
    }

    // Создаем анимированный SVG фильтр
    const filterId = 'animated-pixelate-filter';
    
    // Проверяем, не добавлен ли фильтр уже
    if (document.getElementById(filterId)) {
        // Если фильтр уже существует, удаляем его
        const existingFilter = document.getElementById(filterId);
        if (existingFilter) {
            existingFilter.remove();
        }
    }
    
    // Создаем SVG элемент с фильтром
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'animated-pixelate-svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.visibility = 'hidden';
    
    // Создаем элемент defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Создаем фильтр
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');
    
    // Создаем элементы фильтра для анимации
    const flood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    flood.setAttribute('x', '0.7');
    flood.setAttribute('y', '0.7');
    flood.setAttribute('height', '0.7');
    flood.setAttribute('width', '0.7');
    
    const composite1 = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    composite1.setAttribute('width', '1');
    composite1.setAttribute('height', '1');
    
    const tile = document.createElementNS('http://www.w3.org/2000/svg', 'feTile');
    tile.setAttribute('result', 'a');
    
    const composite2 = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    composite2.setAttribute('in', 'SourceGraphic');
    composite2.setAttribute('in2', 'a');
    composite2.setAttribute('operator', 'in');
    
    const morphology = document.createElementNS('http://www.w3.org/2000/svg', 'feMorphology');
    morphology.setAttribute('operator', 'dilate');
    morphology.setAttribute('radius', '0');
    
    // Добавляем элементы в фильтр
    filter.appendChild(flood);
    filter.appendChild(composite1);
    filter.appendChild(tile);
    filter.appendChild(composite2);
    filter.appendChild(morphology);
    
    // Добавляем фильтр в defs
    defs.appendChild(filter);
    
    // Добавляем defs в SVG
    svg.appendChild(defs);
    
    // Добавляем SVG в документ
    document.body.appendChild(svg);
    
    console.log('Анимированный SVG фильтр пикселизации создан');

    // Находим элементы для применения фильтра
    const elements = document.querySelectorAll('.principles_p_wrap');
    console.log('Найдено элементов для фильтра:', elements.length);
    
    if (elements.length === 0) {
        console.warn('Элементы .principles_p_wrap не найдены для применения фильтра');
        return filterId;
    }

    // Создаем timeline с ScrollTrigger
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: triggerElement,
            start: 'center center',
            end: 'center center',
            toggleActions: 'none play none reverse',
            onEnter: () => {
                console.log('ScrollTrigger: onEnter - анимация вперед');
            },
            onLeave: () => {
                console.log('ScrollTrigger: onLeave');
            },
            onEnterBack: () => {
                console.log('ScrollTrigger: onEnterBack - обратная анимация');
            },
            onLeaveBack: () => {
                console.log('ScrollTrigger: onLeaveBack');
            }
        }
    });

    // Создаем простую анимацию с одним твином
    tl.to({}, {
        duration: 0.7, // Возвращаем к 0.8 секунды
        ease: "none", // Линейная анимация для равномерного прогресса
        onStart: () => {
            console.log('Анимация пиксельного фильтра началась (0.8 секунды)');
            elements.forEach(element => {
                element.style.filter = `url(#${filterId})`;
            });
        },
        onUpdate: function() {
            const progress = this.progress();
            
            // Простая анимация: 0-0.33 активация, 0.33-0.66 пиксели, 0.66-1 деактивация
            let pixelSize, morphRadius;
            
            if (progress <= 0.33) {
                // Фаза активации
                const phaseProgress = progress / 0.33;
                pixelSize = Math.max(0, gsap.utils.interpolate(0, 3, phaseProgress));
                morphRadius = Math.max(0, gsap.utils.interpolate(0, 0.75, phaseProgress));
            } else if (progress <= 0.66) {
                // Фаза пикселей
                const phaseProgress = (progress - 0.33) / 0.33;
                pixelSize = Math.max(0, gsap.utils.interpolate(3, 5, phaseProgress));
                morphRadius = Math.max(0, gsap.utils.interpolate(0.75, 2, phaseProgress));
            } else {
                // Фаза деактивации
                const phaseProgress = (progress - 0.66) / 0.34;
                pixelSize = Math.max(0, gsap.utils.interpolate(8, 0, phaseProgress));
                morphRadius = Math.max(0, gsap.utils.interpolate(2, 0, phaseProgress));
            }
            
            composite1.setAttribute('width', pixelSize.toString());
            composite1.setAttribute('height', pixelSize.toString());
            morphology.setAttribute('radius', morphRadius.toString());
            
            // Отладочная информация каждые 10% прогресса
            const currentPercent = Math.floor(progress * 10) * 10;
            const prevPercent = Math.floor((progress - 0.01) * 10) * 10;
            
            if (currentPercent !== prevPercent && currentPercent >= 0) {
                console.log(`Прогресс: ${currentPercent}%, pixelSize: ${pixelSize.toFixed(2)}, morphRadius: ${morphRadius.toFixed(2)}`);
            }
        },
        onComplete: () => {
            console.log('Анимация завершена, убираем фильтр');
            elements.forEach(element => {
                element.style.filter = 'none';
            });
        },
        onReverseComplete: () => {
            console.log('Обратная анимация завершена, убираем фильтр');
            elements.forEach(element => {
                element.style.filter = 'none';
            });
        }
    });

    console.log('Анимированный пиксельный фильтр инициализирован для элемента:', triggerElement);
    return filterId;
}

// Всегда скроллить в начало при ручной перезагрузке страницы
// Отключаем автоматическое восстановление позиции скролла браузером
if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual';
}

// Определяем перезагрузку через Navigation Timing API и скроллим в начало
window.addEventListener('pageshow', function() {
	let isReload = false;
	if (performance && typeof performance.getEntriesByType === 'function') {
		const navEntries = performance.getEntriesByType('navigation');
		if (navEntries && navEntries[0]) {
			isReload = navEntries[0].type === 'reload';
		}
	} else if (performance && performance.navigation) {
		// Fallback для старых браузеров
		isReload = performance.navigation.type === 1; // 1 = Reload
	}

	if (isReload) {
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
	}
});

// Инициализация ScrollTrigger логики для data-hero-* элементов
function initializeHeroScrollTriggers() {
	if (typeof gsap === 'undefined') {
		console.error('GSAP не загружен! ScrollTrigger анимации не будут работать.');
		return;
	}

	// Регистрация плагина, если доступен
	if (window.ScrollTrigger) {
		gsap.registerPlugin(ScrollTrigger);
	} else if (gsap.ScrollTrigger) {
		gsap.registerPlugin(gsap.ScrollTrigger);
	} else {
		console.warn('GSAP ScrollTrigger не найден. Подключите плагин ScrollTrigger.');
		return;
	}

	const triggers = Array.from(document.querySelectorAll('[data-hero-s]'));
	const images = Array.from(document.querySelectorAll('[data-hero-img]'));
	const icons = Array.from(document.querySelectorAll('[data-hero-icon]'));
	const boldTextEl = document.querySelector('[data-hero-bold-text]');

	if (triggers.length === 0) {
		return;
	}

	// Базовые состояния
	gsap.set(triggers, { opacity: 0.24 });
	gsap.set(images, { scale: 1 });
	gsap.set(icons, { scale: 0 });

	triggers.forEach((triggerEl, index) => {
		const imgEl = images[index] || null;
		const iconEl = icons[index] || null;
		const boldText = triggerEl.getAttribute('data-hero-bold');

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: triggerEl,
				start: () => {
					const offset = 40 - index * 40; // 40, 32, 24, ...
					return `top top+=${offset}`;
				},
				end: 'bottom top',
				toggleActions: 'play none none reverse',
				invalidateOnRefresh: true,
				onEnter: () => {
					// Обновляем текст при входе в триггер
					if (boldTextEl && boldText) {
						boldTextEl.textContent = boldText;
					}
				},
				onEnterBack: () => {
					// Обновляем текст при возврате к триггеру
					if (boldTextEl && boldText) {
						boldTextEl.textContent = boldText;
					}
				}
			}
		});

		// 1) Делает триггер-элемент видимым мгновенно
		tl.to(triggerEl, { opacity: 1, duration: 0 }, 0);

		// 2) Анимации соответствующих по индексу элементов
		if (imgEl) {
			tl.to(imgEl, { scale: 0, duration: 0.2, ease: 'back.in' }, 0);
		}
		if (iconEl) {
			tl.to(iconEl, { scale: 1, duration: 0.2, ease: 'expo.out' }, 0);
		}
	});
}

// Инициализация ScrollTrigger: services_item управляет nav_icon (обратное соответствие)
function initializeServicesNavIconScroll() {
	if (typeof gsap === 'undefined') {
		console.error('GSAP не загружен! ScrollTrigger анимации не будут работать.');
		return;
	}

	if (!gsap.core.globals().ScrollTrigger && !window.ScrollTrigger && !gsap.ScrollTrigger) {
		console.warn('GSAP ScrollTrigger не найден. Подключите плагин ScrollTrigger.');
		return;
	}

	if (window.ScrollTrigger) {
		gsap.registerPlugin(ScrollTrigger);
	} else if (gsap.ScrollTrigger) {
		gsap.registerPlugin(gsap.ScrollTrigger);
	}

	const items = Array.from(document.querySelectorAll('.services_item'));
	const icons = Array.from(document.querySelectorAll('.nav_icon'));

	if (items.length === 0 || icons.length === 0) return;

	// Исходные состояния для иконок (на всякий случай фиксируем стартовую позицию)
	gsap.set(icons, { yPercent: 0 });

	const lastIndex = icons.length - 1;

	items.forEach((itemEl, index) => {
		const iconEl = icons[lastIndex - index];
		if (!iconEl) return;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: itemEl,
				start: 'bottom center',
				end: 'bottom center',
				toggleActions: 'play none none reverse'
			}
		});

		tl.to(iconEl, { yPercent: -180, duration: 0.3, ease: 'back.inOut' }, 0);
	});
}

// Отключаем изменение темы навигации на планшетах и мобильных устройствах
if (window.innerWidth > 1024) {
  $('[section-dark]').each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top 10%",
      end: "bottom 10%",
      onEnter: () => {
        $(".nav_wrap").addClass("u-theme-dark");
      },
      onEnterBack: () => {
        $(".nav_wrap").addClass("u-theme-dark");
      }
    });
  });
  
  $('[section-light]').each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top 10%",
      end: "bottom 10%",
      onEnter: () => {
        $(".nav_wrap").removeClass("u-theme-dark");
      },
      onEnterBack: () => {
        $(".nav_wrap").removeClass("u-theme-dark");
      }
    });
  });
}