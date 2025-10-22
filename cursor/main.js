// Главный файл для подключения всех модулей
// Проверяем доступность GSAP
if (typeof gsap === 'undefined') {
    console.error('GSAP не загружен! Пожалуйста, подключите GSAP перед этим скриптом.');
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация всех модулей...');
    
    // Инициализация навигационных стилей и анимаций
    if (window.NavigationModule) {
        // Создаем CSS стили для анимации nav_menu_wrap
        window.NavigationModule.createHoverStyles();
        
        // Создаем базовые CSS стили для nav_logo_wrap
        window.NavigationModule.createLogoStyles();
        
        const navMenuWrapElements = window.NavigationModule.findNavMenuWrap();
        
        if (navMenuWrapElements) {
            // Проверяем, является ли устройство мобильным или планшетом
            if (window.NavigationModule.isMobileOrTablet()) {
                // Для мобильных устройств и планшетов используем обработку тапа
                window.NavigationModule.initializeMobileNavMenuTouch();
                console.log(`Мобильная обработка тапа добавлена к ${navMenuWrapElements.length} элементам .nav_menu_wrap`);
            } else {
                // Для десктопов используем обработку наведения
                navMenuWrapElements.forEach((element, index) => {
                    element.addEventListener('mouseenter', function() {
                        window.NavigationModule.addHoverClass(this);
                    });
                    
                    element.addEventListener('mouseleave', function() {
                        window.NavigationModule.removeHoverClass(this);
                    });
                });
                console.log(`Обработчики наведения добавлены к ${navMenuWrapElements.length} элементам .nav_menu_wrap`);
            }
        }
        
        const navLogoWrapElements = window.NavigationModule.findNavLogoWrap();
        
        if (navLogoWrapElements) {
            // Добавляем обработчики событий к каждому найденному элементу nav_logo_wrap
            navLogoWrapElements.forEach((element, index) => {
                element.addEventListener('mouseenter', function() {
                    window.NavigationModule.addLogoHoverClass(this);
                });
                
                element.addEventListener('mouseleave', function() {
                    window.NavigationModule.removeLogoHoverClass(this);
                });
            });
            
            console.log(`GSAP обработчики наведения добавлены к ${navLogoWrapElements.length} элементам .nav_logo_wrap`);
        }
    } else {
        console.warn('NavigationModule не загружен');
    }

    // Инициализация модалки
    if (window.ModalModule) {
        window.ModalModule.initializeModal();
    } else {
        console.warn('ModalModule не загружен');
    }

    // Инициализация ScrollTrigger анимаций героев
    if (window.ScrollTriggersModule) {
        window.ScrollTriggersModule.initializeHeroScrollTriggers();
    } else {
        console.warn('ScrollTriggersModule не загружен');
    }

    // Инициализация ScrollTrigger для services_item → nav_icon
    if (window.ScrollTriggersModule) {
        window.ScrollTriggersModule.initializeServicesNavIconScroll();
    }

    // Применение анимированного фильтра пикселизации к текстовым элементам .principles_p_wrap
    if (window.PixelateFiltersModule) {
        window.PixelateFiltersModule.createAnimatedPixelateFilter();
    } else {
        console.warn('PixelateFiltersModule не загружен');
    }

    // Инициализация hover-анимаций для [data-button-main]
    if (window.ButtonsModule) {
        window.ButtonsModule.initializeButtonMainHover();
    } else {
        console.warn('ButtonsModule не загружен');
    }

    // Инициализация аккордеонов с GSAP Flip
    if (window.AccordionsModule) {
        window.AccordionsModule.initializeAccordions();
    } else {
        console.warn('AccordionsModule не загружен');
    }

    // Инициализация анимации загрузки страницы
    if (window.PageLoadingModule) {
        window.PageLoadingModule.initializePageLoadingAnimation();
    } else {
        console.warn('PageLoadingModule не загружен');
    }
    
    // Обработчик изменения размера окна для переключения режимов
    window.addEventListener('resize', function() {
        // Переинициализируем обработчики при изменении размера окна
        setTimeout(() => {
            if (window.NavigationModule) {
                window.NavigationModule.initializeNavMenuHover();
            }
        }, 100); // Небольшая задержка для стабилизации
    });
    
    // Инициализация темы навигации
    if (window.ScrollTriggersModule) {
        window.ScrollTriggersModule.initializeNavigationTheme();
    }
    
    console.log('Все модули инициализированы');
});

// Дополнительные функции для ручного вызова (если нужно)
function initializeNavMenuHover() {
    if (window.NavigationModule) {
        window.NavigationModule.initializeNavMenuHover();
    }
}

function initializeNavLogoHover() {
    if (window.NavigationModule) {
        window.NavigationModule.initializeNavLogoHover();
    }
}

function initializePixelateFilter() {
    if (window.PixelateFiltersModule) {
        window.PixelateFiltersModule.initializePixelateFilter();
    }
}