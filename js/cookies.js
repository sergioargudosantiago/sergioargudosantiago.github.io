/* =========================================
   Global Cookie Banner — Arcade Theme
   ========================================= */
(function () {
    function initCookieBanner() {
        const COOKIE_KEY = 'soivre_cookies_accepted';

        // 1. Check if user has already decided
        if (localStorage.getItem(COOKIE_KEY)) return;

        // 2. Inject self-contained styles (no dependency on compiled Tailwind)
        const style = document.createElement('style');
        style.textContent = `
            #global-cookie-banner {
                position: fixed;
                bottom: 5.5rem;
                left: 1rem;
                right: 1rem;
                z-index: 60;
                max-width: 28rem;
                padding: 1.25rem;
                background: #C2D9C2;
                color: #3B4533;
                border: 2px solid #3B4533;
                box-shadow: 4px 4px 0 #3B4533;
                font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                transform: translateY(2.5rem);
                opacity: 0;
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s;
            }
            @media (min-width: 768px) {
                #global-cookie-banner { bottom: 1.5rem; right: 1.5rem; left: auto; }
            }
            #global-cookie-banner.ck-visible { transform: translateY(0); opacity: 1; }
            #global-cookie-banner .ck-title {
                font-family: 'Orbitron', monospace;
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                margin-bottom: 0.35rem;
            }
            #global-cookie-banner .ck-text {
                font-size: 0.8rem;
                line-height: 1.5;
                margin-bottom: 1rem;
            }
            #global-cookie-banner .ck-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: flex-end;
                flex-wrap: wrap;
            }
            #global-cookie-banner button {
                font-family: 'Orbitron', monospace;
                font-size: 0.65rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                padding: 0.5rem 1rem;
                border: 2px solid #3B4533;
                cursor: pointer;
                transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.15s;
            }
            #global-cookie-banner .ck-reject {
                background: transparent;
                color: #3B4533;
            }
            #global-cookie-banner .ck-reject:hover { background: rgba(59, 69, 51, 0.1); }
            #global-cookie-banner .ck-accept {
                background: #3B4533;
                color: #C2D9C2;
                box-shadow: 3px 3px 0 rgba(59, 69, 51, 0.35);
            }
            #global-cookie-banner .ck-accept:hover {
                transform: translate(1px, 1px);
                box-shadow: 2px 2px 0 rgba(59, 69, 51, 0.35);
            }
            html.dark #global-cookie-banner {
                background: #3B4533;
                color: #C2D9C2;
                border-color: #C2D9C2;
                box-shadow: 4px 4px 0 rgba(194, 217, 194, 0.3);
            }
            html.dark #global-cookie-banner button { border-color: #C2D9C2; }
            html.dark #global-cookie-banner .ck-reject { color: #C2D9C2; }
            html.dark #global-cookie-banner .ck-reject:hover { background: rgba(194, 217, 194, 0.12); }
            html.dark #global-cookie-banner .ck-accept {
                background: #C2D9C2;
                color: #3B4533;
                box-shadow: 3px 3px 0 rgba(194, 217, 194, 0.3);
            }
        `;
        document.head.appendChild(style);

        // 3. Create banner
        const banner = document.createElement('div');
        banner.id = 'global-cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Política de cookies');
        banner.innerHTML = `
            <div class="ck-title">🍪 Política de Cookies</div>
            <p class="ck-text">Utilizamos cookies para mejorar tu experiencia y analizar el tráfico de la web.</p>
            <div class="ck-actions">
                <button id="btn-reject-cookies" class="ck-reject" type="button">Solo necesarias</button>
                <button id="btn-accept-cookies" class="ck-accept" type="button">Aceptar todas</button>
            </div>
        `;
        document.body.appendChild(banner);

        // 4. Animate entry
        setTimeout(() => banner.classList.add('ck-visible'), 500);

        // 5. Handle interaction
        const closeBanner = () => {
            banner.classList.remove('ck-visible');
            setTimeout(() => banner.remove(), 500);
        };
        document.getElementById('btn-accept-cookies').addEventListener('click', () => {
            localStorage.setItem(COOKIE_KEY, 'true');
            closeBanner();
        });
        document.getElementById('btn-reject-cookies').addEventListener('click', () => {
            localStorage.setItem(COOKIE_KEY, 'false');
            closeBanner();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }
})();
