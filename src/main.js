// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация иконок Lucide
    lucide.createIcons();

    // Плавный скролл Lenis
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Эффект скролла для Хедера
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '12px 0';
            header.style.background = 'rgba(10, 12, 16, 0.9)';
        } else {
            header.style.padding = '20px 0';
            header.style.background = 'transparent';
        }
    });
    // =========================
    // HERO ANIMATION (GSAP + SplitType)
    // =========================
    
    // 1. Подготовка текста (разбиение на слова/буквы)
    const heroText = new SplitType('.js-hero-text', { types: 'lines, words' });
    
    // Снимаем visibility: hidden после разбиения, чтобы не было мигания
    gsap.set('.js-hero-text', { visibility: 'visible' });

    // 2. Создание таймлайна анимации
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        // Анимация бейджа
        .from('.hero__badge', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            delay: 0.5
        })
        // Анимация текста (по словам)
        .from(heroText.words, {
            y: 50,
            opacity: 0,
            rotationX: 45, // Легкий 3D эффект
            stagger: 0.05, // Задержка между появлением слов
            duration: 1
        }, '-=0.4') // Запускаем чуть раньше окончания предыдущей анимации
        // Анимация кнопок
        .to('.js-hero-actions', {
            y: 0,
            opacity: 1,
            visibility: 'visible',
            duration: 0.8,
            clearProps: 'visibility' // Очистка свойства после анимации
        }, '-=0.8')
        // Анимация изображения (выплывание справа)
        .to('.js-hero-img', {
            x: 0,
            opacity: 1,
            visibility: 'visible',
            duration: 1.2,
            ease: 'back.out(1.2)', // Эффект "отскока"
            clearProps: 'visibility'
        }, '-=1');

    // Обновляем иконки после вставки нового контента
    lucide.createIcons();
});