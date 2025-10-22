// Модуль для анимации загрузки страницы
// Анимация загрузки страницы с пикселизацией
function initializePageLoadingAnimation() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP не загружен! Анимация загрузки не будет работать.');
        return;
    }

    const canvas = document.querySelector('canvas.pixelize');
    if (!canvas) {
        console.warn('Canvas с классом pixelize не найден');
        return;
    }

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Устанавливаем размеры canvas
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Получаем цвет из CSS переменной
    const selectionColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--_theme---selection--background')
        .trim();
    
    // Адаптивные параметры пикселизации
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Гибкий размер пикселя в зависимости от размера экрана
    let pixelSize;
    if (viewportWidth <= 768) {
        // Мобильные устройства - пиксель составляет ~8% от ширины экрана
        pixelSize = Math.max(40, Math.min(80, viewportWidth * 0.08));
    } else if (viewportWidth <= 1024) {
        // Планшеты - пиксель составляет ~6% от ширины экрана
        pixelSize = Math.max(60, Math.min(90, viewportWidth * 0.06));
    } else {
        // Десктопы - пиксель составляет ~4% от ширины экрана
        pixelSize = Math.max(80, Math.min(120, viewportWidth * 0.04));
    }
    
    // Рассчитываем количество колонок и строк
    let cols = Math.ceil(canvas.width / pixelSize);
    let rows = Math.ceil(canvas.height / pixelSize);
    
    // Делаем количество колонок и строк нечетным для точного центрального пикселя
    if (cols % 2 === 0) {
        cols += 1;
    }
    if (rows % 2 === 0) {
        rows += 1;
    }
    
    // Пересчитываем размер пикселя для плотного заполнения без зазоров
    pixelSize = Math.min(canvas.width / cols, canvas.height / rows);
    
    // Создаем массив пикселей
    const pixels = [];
    const centerX = Math.floor(cols / 2); // Точный центр по X
    const centerY = Math.floor(rows / 2); // Точный центр по Y
    
    // Рассчитываем размер пикселя для полного заполнения canvas
    const actualPixelWidth = canvas.width / cols;
    const actualPixelHeight = canvas.height / rows;
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            pixels.push({
                x: x * actualPixelWidth,
                y: y * actualPixelHeight,
                opacity: 1,
                distance: Math.sqrt(
                    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
                )
            });
        }
    }
    
    // Сортируем пиксели по расстоянию от центра
    pixels.sort((a, b) => a.distance - b.distance);
    
    // Функция отрисовки
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = selectionColor;
        
        pixels.forEach(pixel => {
            ctx.globalAlpha = pixel.opacity;
            ctx.fillRect(
                Math.floor(pixel.x), 
                Math.floor(pixel.y), 
                Math.ceil(actualPixelWidth), 
                Math.ceil(actualPixelHeight)
            );
        });
    }
    
    // Начальная отрисовка
    draw();
    
    // Анимация исчезновения через 3 секунды
    setTimeout(() => {
        gsap.to(pixels, {
            opacity: 0,
            duration: 0.3,
            stagger: 0.0015,
            ease: "power2.out",
            onUpdate: draw
        });
    }, 1800);
    
    // Обработчик изменения размера окна для пересчета пикселей
    function handleResize() {
        const newRect = canvas.getBoundingClientRect();
        canvas.width = newRect.width;
        canvas.height = newRect.height;
        
        // Пересчитываем параметры для нового размера
        const newViewportWidth = window.innerWidth;
        let newPixelSize;
        
        // Гибкий размер пикселя в зависимости от размера экрана
        if (newViewportWidth <= 768) {
            newPixelSize = Math.max(40, Math.min(80, newViewportWidth * 0.08));
        } else if (newViewportWidth <= 1024) {
            newPixelSize = Math.max(60, Math.min(90, newViewportWidth * 0.06));
        } else {
            newPixelSize = Math.max(80, Math.min(120, newViewportWidth * 0.04));
        }
        
        // Рассчитываем количество колонок и строк
        let newCols = Math.ceil(canvas.width / newPixelSize);
        let newRows = Math.ceil(canvas.height / newPixelSize);
        
        // Делаем количество колонок и строк нечетным для точного центрального пикселя
        if (newCols % 2 === 0) {
            newCols += 1;
        }
        if (newRows % 2 === 0) {
            newRows += 1;
        }
        
        // Пересчитываем размер пикселя для плотного заполнения без зазоров
        newPixelSize = Math.min(canvas.width / newCols, canvas.height / newRows);
        
        // Обновляем размер пикселей если он изменился
        if (Math.abs(newPixelSize - pixelSize) > 1) {
            pixelSize = newPixelSize;
            
            // Пересоздаем массив пикселей
            pixels.length = 0;
            const newCenterX = Math.floor(newCols / 2); // Точный центр по X
            const newCenterY = Math.floor(newRows / 2); // Точный центр по Y
            
            // Рассчитываем размер пикселя для полного заполнения canvas
            const newActualPixelWidth = canvas.width / newCols;
            const newActualPixelHeight = canvas.height / newRows;
            
            for (let y = 0; y < newRows; y++) {
                for (let x = 0; x < newCols; x++) {
                    pixels.push({
                        x: x * newActualPixelWidth,
                        y: y * newActualPixelHeight,
                        opacity: 1,
                        distance: Math.sqrt(
                            Math.pow(x - newCenterX, 2) + Math.pow(y - newCenterY, 2)
                        )
                    });
                }
            }
            
            // Сортируем по расстоянию от центра
            pixels.sort((a, b) => a.distance - b.distance);
            
            // Обновляем функцию отрисовки для новых размеров
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = selectionColor;
                
                pixels.forEach(pixel => {
                    ctx.globalAlpha = pixel.opacity;
                    ctx.fillRect(
                        Math.floor(pixel.x), 
                        Math.floor(pixel.y), 
                        Math.ceil(newActualPixelWidth), 
                        Math.ceil(newActualPixelHeight)
                    );
                });
            }
            
            draw();
        }
    }
    
    // Добавляем обработчик изменения размера
    window.addEventListener('resize', handleResize);
    
    console.log(`Анимация загрузки страницы инициализирована. Размер пикселя: ${pixelSize}px, количество: ${cols}x${rows}`);
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

// Экспорт функций для использования в main.js
window.PageLoadingModule = {
    initializePageLoadingAnimation
};