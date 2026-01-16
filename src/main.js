/**
 * Intell-Corex | Final Unified Script
 * Version: 1.2 (No Blur, No Lenis, Fixed Navigation)
 * Year: 2026
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК ---
    const initIcons = () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };
    initIcons();

    // --- 2. МОБИЛЬНОЕ МЕНЮ И НАВИГАЦИЯ ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav__link');

    const closeMenu = () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = ''; // Возвращаем скролл
    };

    const toggleMenu = () => {
        const isOpening = !nav.classList.contains('active');
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open', isOpening);
        document.body.style.overflow = isOpening ? 'hidden' : '';
    };

    if (burger) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Обработка кликов по ссылкам (Якоря)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Если это внутренняя ссылка
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                // 1. Сначала закрываем меню
                closeMenu();

                // 2. Скроллим к секции с задержкой (чтобы body успел разблокироваться)
                if (targetElement) {
                    setTimeout(() => {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 150); // Небольшая пауза для корректного расчета координат
                }
            }
        });
    });

    // --- 3. ХЕДЕР ПРИ СКРОЛЛЕ ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '12px 0';
            header.style.background = 'rgba(10, 12, 16, 0.98)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.background = 'transparent';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        }
    });

    // --- 4. HERO АНИМАЦИЯ (GSAP + SplitType) ---
    const initHero = () => {
        const title = document.querySelector('.js-hero-text');
        if (!title) return;

        try {
            const text = new SplitType('.js-hero-text', { types: 'words' });
            
            // Проявляем элементы
            gsap.set(['.hero__title', '.hero__subtitle', '.js-hero-actions', '.js-hero-img', '.hero__badge'], { 
                opacity: 1, 
                visibility: 'visible' 
            });

            const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

            tl.from('.hero__badge', { y: 20, opacity: 0, delay: 0.5 })
              .from(text.words, { y: 40, opacity: 0, rotationX: 30, stagger: 0.03 }, '-=0.8')
              .from('.hero__subtitle', { y: 20, opacity: 0 }, '-=1')
              .from('.js-hero-actions', { y: 20, opacity: 0 }, '-=1')
              .from('.js-hero-img', { x: 50, opacity: 0, scale: 0.9, duration: 1.5 }, '-=1.2');

        } catch (err) {
            console.warn("GSAP/SplitType animation skipped.");
        }
    };
    setTimeout(initHero, 200);

    // --- 5. ТАБЫ (ИННОВАЦИИ) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
            initIcons();
        });
    });

    // --- 6. СЛАЙДЕР БЛОГА (Swiper) ---
    if (document.querySelector('.blog-swiper')) {
        new Swiper('.blog-swiper', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            navigation: { nextEl: '.swiper-next', prevEl: '.swiper-prev' },
            breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
        });
    }

    // --- 7. КАПЧА И ФОРМА КОНТАКТОВ ---
    let captchaValue;
    const captchaLabel = document.getElementById('captcha-question');
    const contactForm = document.getElementById('ai-contact-form');
    const successBox = document.getElementById('contact-success');

    const generateCaptcha = () => {
        if (!captchaLabel) return;
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        captchaValue = n1 + n2;
        captchaLabel.innerText = `${n1} + ${n2} = ?`;
    };

    generateCaptcha();

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const answer = parseInt(document.getElementById('captcha-answer').value);

            if (answer !== captchaValue) {
                alert('Неверный ответ капчи!');
                generateCaptcha();
                document.getElementById('captcha-answer').value = '';
                return;
            }

            const btn = contactForm.querySelector('button');
            btn.disabled = true;
            btn.innerText = 'Отправка...';

            setTimeout(() => {
                contactForm.style.display = 'none';
                successBox.style.display = 'flex';
                initIcons();
            }, 1500);
        });
    }

    // --- 8. COOKIE POPUP ---
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieBtn = document.getElementById('cookie-accept');

    if (cookiePopup && !localStorage.getItem('intell_cookies_accepted')) {
        setTimeout(() => cookiePopup.classList.add('active'), 3000);
    }

    if (cookieBtn) {
        cookieBtn.addEventListener('click', () => {
            localStorage.setItem('intell_cookies_accepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }

    // --- 9. AOS (Анимация скролла) ---
    AOS.init({ duration: 1000, once: true, offset: 50 });
});

// Глобальная функция для кнопки сброса (Success экран)
function resetForm() {
    location.reload(); 
}