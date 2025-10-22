// Модуль навигационных стилей и анимаций
// GSAP easing функции
const smoothEase = "power2.out";
const expoOut = "expo.out";

// Оригинальный elasticEaseOut из CSS
const elasticEaseOut = 'linear(0, 0.5737 7.6%, 0.8382 11.87%, 0.9463 14.19%, 1.0292 16.54%, 1.0886 18.97%, 1.1258 21.53%, 1.137 22.97%, 1.1424 24.48%, 1.1423 26.1%, 1.1366 27.86%, 1.1165 31.01%, 1.0507 38.62%, 1.0219 42.57%, 0.9995 46.99%, 0.9872 51.63%, 0.9842 58.77%, 1.0011 81.26%, 1)';

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

// Функция для определения мобильных устройств и планшетов
function isMobileOrTablet() {
    return window.innerWidth <= 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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

// Функция для обработки тапа на nav_menu_wrap на мобильных устройствах
function initializeMobileNavMenuTouch() {
    const navMenuWrapElements = findNavMenuWrap();
    const navWrap = document.querySelector('.nav_wrap');
    
    if (!navMenuWrapElements || !navWrap) {
        console.warn('Элементы .nav_menu_wrap или .nav_wrap не найдены для мобильной обработки');
        return;
    }
    
    // Удаляем старые обработчики событий
    navMenuWrapElements.forEach((element) => {
        // Клонируем элемент для удаления всех обработчиков
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
    });
    
    // Получаем обновленные элементы после клонирования
    const updatedNavMenuWrapElements = findNavMenuWrap();
    
    // Переменные для отслеживания состояния драга
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let dragThreshold = 50; // Минимальное расстояние для срабатывания драга
    
    // Обработчик тапа на nav_menu_wrap
    updatedNavMenuWrapElements.forEach((element) => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Переключаем состояние меню
            if (this.classList.contains('is-hovered')) {
                removeHoverClass(this);
            } else {
                // Закрываем все остальные меню
                updatedNavMenuWrapElements.forEach((el) => {
                    if (el !== this) {
                        removeHoverClass(el);
                    }
                });
                addHoverClass(this);
            }
        });
        
        // Обработчик начала драга
        element.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            isDragging = false;
        });
        
        // Обработчик движения при драге
        element.addEventListener('touchmove', function(e) {
            if (!this.classList.contains('is-hovered')) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            // Если драг вниз больше порога
            if (deltaY > dragThreshold) {
                isDragging = true;
                removeHoverClass(this);
            }
        });
        
        // Обработчик окончания драга
        element.addEventListener('touchend', function(e) {
            isDragging = false;
        });
    });
    
    // Удаляем старые обработчики вне nav_wrap
    const existingClickHandler = document._navMenuClickHandler;
    const existingTouchHandler = document._navMenuTouchHandler;
    
    if (existingClickHandler) {
        document.removeEventListener('click', existingClickHandler);
    }
    if (existingTouchHandler) {
        document.removeEventListener('touchstart', existingTouchHandler);
    }
    
    // Создаем новые обработчики для клика вне nav_wrap
    const clickHandler = function(e) {
        // Проверяем, что клик был вне nav_wrap
        if (!navWrap.contains(e.target)) {
            // Закрываем все открытые меню
            updatedNavMenuWrapElements.forEach((element) => {
                if (element.classList.contains('is-hovered')) {
                    removeHoverClass(element);
                }
            });
        }
    };
    
    // Создаем новые обработчики для тапа вне nav_wrap
    const touchHandler = function(e) {
        // Проверяем, что тап был вне nav_wrap
        if (!navWrap.contains(e.target)) {
            // Закрываем все открытые меню
            updatedNavMenuWrapElements.forEach((element) => {
                if (element.classList.contains('is-hovered')) {
                    removeHoverClass(element);
                }
            });
        }
    };
    
    // Сохраняем ссылки на обработчики для возможного удаления
    document._navMenuClickHandler = clickHandler;
    document._navMenuTouchHandler = touchHandler;
    
    // Добавляем новые обработчики
    document.addEventListener('click', clickHandler);
    document.addEventListener('touchstart', touchHandler);
    
    console.log(`Мобильная обработка тапа инициализирована для ${updatedNavMenuWrapElements.length} элементов .nav_menu_wrap`);
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

// Дополнительная функция для ручного вызова (если нужно)
function initializeNavMenuHover() {
    // Создаем CSS стили для анимации nav_menu_wrap
    createHoverStyles();
    
    const navMenuWrapElements = findNavMenuWrap();
    
    if (navMenuWrapElements) {
        // Проверяем, является ли устройство мобильным или планшетом
        if (isMobileOrTablet()) {
            // Для мобильных устройств и планшетов используем обработку тапа
            initializeMobileNavMenuTouch();
            console.log(`Мобильная обработка тапа переинициализирована для ${navMenuWrapElements.length} элементов .nav_menu_wrap`);
        } else {
            // Для десктопов используем обработку наведения
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

// Экспорт функций для использования в main.js
window.NavigationModule = {
    createHoverStyles,
    createLogoStyles,
    isMobileOrTablet,
    findNavMenuWrap,
    findNavLogoWrap,
    addHoverClass,
    removeHoverClass,
    initializeMobileNavMenuTouch,
    addLogoHoverClass,
    removeLogoHoverClass,
    initializeNavMenuHover,
    initializeNavLogoHover
};