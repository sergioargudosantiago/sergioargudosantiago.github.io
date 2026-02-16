/* =========================================
   Global Cookie Banner Implementation
   ========================================= */
(function () {
    function initCookieBanner() {
        console.log('Cookie Banner: Initializing...');
        const COOKIE_KEY = 'soivre_cookies_accepted';

        // 1. Check if user has already decided
        if (localStorage.getItem(COOKIE_KEY)) {
            console.log('Cookie Banner: Already accepted/rejected.');
            return;
        }

        // 2. Create Banner Element
        const banner = document.createElement('div');
        banner.id = 'global-cookie-banner';

        // Tailwind classes for positioning and styling
        banner.className = `
            fixed bottom-[5.5rem] left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:max-w-md
            bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            p-5 rounded-2xl z-[60] transform transition-all duration-700 translate-y-10 opacity-0
            font-sans flex flex-col gap-4
        `;

        // 3. Inject Content
        banner.innerHTML = `
            <div class="flex items-start gap-4">
                <div class="text-2xl pt-1">🍪</div>
                <div class="flex-1">
                    <h3 class="font-bold text-gray-900 text-sm mb-1">Política de Cookies</h3>
                        Utilizamos cookies para mejorar tu experiencia y analizar el tráfico de la web.
                    </p>
                </div>
            </div>
            <div class="flex gap-2 justify-end">
                <button id="btn-reject-cookies" class="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100/80 rounded-lg transition-colors">
                    Solo necesarias
                </button>
                <button id="btn-accept-cookies" class="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
                    Aceptar todas
                </button>
            </div>
        `;

        // 4. Add to DOM
        document.body.appendChild(banner);
        console.log('Cookie Banner: Added to DOM');

        // 5. Animate Entry (delayed slightly)
        setTimeout(() => {
            banner.classList.remove('translate-y-10', 'opacity-0');
        }, 500);

        // 6. Handle Interaction
        const closeBanner = () => {
            banner.classList.add('translate-y-10', 'opacity-0', 'scale-95');
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

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }
})();
