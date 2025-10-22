// Модуль для пиксельных фильтров
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

// Дополнительная функция для ручного применения фильтра пикселизации
function initializePixelateFilter() {
    applyPixelateFilterToImages();
}

// Экспорт функций для использования в main.js
window.PixelateFiltersModule = {
    createPixelateFilter,
    applyPixelateFilterToImages,
    createAnimatedPixelateFilter,
    initializePixelateFilter
};