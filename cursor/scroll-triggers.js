// Модуль для ScrollTrigger анимаций
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
                    // Для планшетов и телефонов всегда используем фиксированное значение 40
                    if (window.innerWidth <= 1024) {
                        return 'top top+=40';
                    }
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
function initializeNavigationTheme() {
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
}

// Экспорт функций для использования в main.js
window.ScrollTriggersModule = {
    initializeHeroScrollTriggers,
    initializeServicesNavIconScroll,
    initializeNavigationTheme
};