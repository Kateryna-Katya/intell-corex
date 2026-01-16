document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ІКОНКИ ---
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // --- 2. ЕЛЕМЕНТИ МЕНЮ ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav__link');

    // Універсальна функція закриття
    const closeMenu = () => {
        if (burger) burger.classList.remove('active');
        if (nav) nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = ''; 
    };

    // Відкриття / Закриття
    if (burger) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpening = !nav.classList.contains('active');
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            document.body.classList.toggle('menu-open', isOpening);
            document.body.style.overflow = isOpening ? 'hidden' : '';
        });
    }

    if (overlay) overlay.addEventListener('click', closeMenu);

    // --- 3. РОБОТА З ПОСИЛАННЯМИ (МОБІЛЬНЕ МЕНЮ) ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Якщо посилання містить якір (#)
            if (href.includes('#')) {
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);

                // ЗАВЖДИ закриваємо меню при кліку
                closeMenu();

                // Якщо ми на тій же сторінці, де є цей ID (на головній)
                if (targetElement) {
                    e.preventDefault();
                    setTimeout(() => {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }, 150); // Даємо час меню закритися і розблокувати скрол
                }
                // Якщо елемента немає (ми на внутрішній сторінці) — браузер просто перейде на index.html#id
            }
        });
    });

    // --- 4. АНІМАЦІЯ HERO (Тільки головна) ---
    const heroTitle = document.querySelector('.js-hero-text');
    if (heroTitle && typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
        try {
            const text = new SplitType('.js-hero-text', { types: 'words' });
            gsap.set(['.hero__title', '.hero__subtitle', '.js-hero-actions', '.js-hero-img', '.hero__badge'], { opacity: 1, visibility: 'visible' });
            const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
            tl.from('.hero__badge', { y: 20, opacity: 0, delay: 0.5 })
              .from(text.words, { y: 40, opacity: 0, rotationX: 30, stagger: 0.03 }, '-=0.8')
              .from('.hero__subtitle', { y: 20, opacity: 0 }, '-=1')
              .from('.js-hero-actions', { y: 20, opacity: 0 }, '-=1')
              .from('.js-hero-img', { x: 50, opacity: 0, scale: 0.9, duration: 1.5 }, '-=1.2');
        } catch (err) { console.log("Hero anim skipped"); }
    }

    // --- 5. ФОРМА ТА КАПЧА (Тільки головна) ---
    const captchaLabel = document.getElementById('captcha-question');
    if (captchaLabel) {
        let captchaResult;
        const generate = () => {
            const n1 = Math.floor(Math.random() * 10) + 1;
            const n2 = Math.floor(Math.random() * 10) + 1;
            captchaResult = n1 + n2;
            captchaLabel.innerText = `${n1} + ${n2} = ?`;
        };
        generate();

        const form = document.getElementById('ai-contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                const ans = parseInt(document.getElementById('captcha-answer').value);
                if (ans !== captchaResult) {
                    e.preventDefault();
                    alert('Ошибка капчи!');
                    generate();
                } else {
                    e.preventDefault();
                    form.style.display = 'none';
                    document.getElementById('contact-success').style.display = 'flex';
                }
            });
        }
    }

    // --- 6. COOKIES ТА AOS ---
    const cookiePopup = document.getElementById('cookie-popup');
    if (cookiePopup && !localStorage.getItem('intell_cookies_accepted')) {
        setTimeout(() => cookiePopup.classList.add('active'), 2000);
        document.getElementById('cookie-accept').addEventListener('click', () => {
            localStorage.setItem('intell_cookies_accepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }

    if (typeof AOS !== 'undefined') AOS.init({ duration: 1000, once: true });
});