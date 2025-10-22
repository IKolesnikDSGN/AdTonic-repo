// Модуль для кнопок и их анимаций
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

// Экспорт функций для использования в main.js
window.ButtonsModule = {
    createButtonMainStyles,
    initializeButtonMainHover
};