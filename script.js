/* ============================================================
   CAMPO AUTÔNOMO — Agro Elétrico Inteligente
   script.js (v3 — features únicas + glassmorphism)
   ============================================================ */

/* ============================================================
   1. SIMULADOR DE ECONOMIA DE DIESEL
   ============================================================ */
function calcularEconomia() {
    const svgIcon = (id, color) =>
        `<svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="${color||'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#${id}"/></svg>`;

    const campo     = document.getElementById('diesel');
    const resultado = document.getElementById('resultado');
    const gasto     = parseFloat(campo.value);

    if (!campo.value || isNaN(gasto) || gasto <= 0) {
        mostrarResultado(resultado,
            svgIcon('ico-warn','#fca5a5') + ' <strong>Informe um valor mensal válido em reais (ex: 8500).</strong>',
            'erro'
        );
        campo.focus();
        return;
    }

    const REDUCAO           = 0.65;
    const PRECO_DIESEL      = 6.80;
    const CO2_POR_LITRO     = 2.68;
    const economiaMensal    = gasto * REDUCAO;
    const economiaAnual     = economiaMensal * 12;
    const litrosEvitados    = economiaAnual / PRECO_DIESEL;
    const co2Evitado        = litrosEvitados * CO2_POR_LITRO;
    const retorno5Anos      = economiaAnual * 5;
    const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const html = `
        ${svgIcon('ico-check','#4ade80')} <strong>Resultado da Simulação</strong><br><br>
        ${svgIcon('ico-coin','#4ade80')} Economia mensal: <strong>${fmt(economiaMensal)}</strong><br>
        ${svgIcon('ico-calendar','#4ade80')} Economia anual: <strong>${fmt(economiaAnual)}</strong><br>
        ${svgIcon('ico-bar','#86efac')} Retorno em 5 anos: <strong>${fmt(retorno5Anos)}</strong><br>
        ${svgIcon('ico-drop','#4ade80')} Litros evitados/ano: <strong>${Math.round(litrosEvitados).toLocaleString('pt-BR')} L</strong><br>
        ${svgIcon('ico-leaf','#4ade80')} CO₂ não emitido/ano: <strong>${Math.round(co2Evitado).toLocaleString('pt-BR')} kg</strong><br><br>
        <small style="opacity:.7">*Redução média de 65% no custo energético. Diesel a R$ ${PRECO_DIESEL.toFixed(2)}/L.</small>
    `;
    mostrarResultado(resultado, html, 'sucesso');
    mostrarToast('Simulação calculada com sucesso! ⚡');
}

function mostrarResultado(el, html, tipo) {
    el.innerHTML = html;
    el.style.display = 'block';
    el.style.borderColor = tipo === 'erro'
        ? 'rgba(248, 113, 113, 0.5)'
        : 'rgba(74, 222, 128, 0.4)';
    el.style.color = tipo === 'erro' ? '#fca5a5' : 'var(--verde-eletrico)';
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
    });
}

/* ============================================================
   2. TOAST NOTIFICATION
   ============================================================ */
function mostrarToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg style="width:16px;height:16px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#ico-check"/></svg>${msg}`;
    requestAnimationFrame(() => {
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
    });
}

/* ============================================================
   3. CURSOR PERSONALIZADO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 900) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animCursor() {
        dot.style.transform  = `translate(${mx - 4}px, ${my - 4}px)`;
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
        requestAnimationFrame(animCursor);
    }
    animCursor();

    document.querySelectorAll('a, button, .card, .barra, .grafico-tab').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
});

/* ============================================================
   4. PARTÍCULAS FLUTUANTES
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * W;
            this.y  = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = -Math.random() * 0.5 - 0.1;
            this.r  = Math.random() * 1.5 + 0.5;
            this.a  = Math.random() * 0.6 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74,222,128,${this.a})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    function tick() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(tick);
    }
    tick();
});

/* ============================================================
   5. SCROLL PROGRESS BAR
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = pct + '%';
    }, { passive: true });
});

/* ============================================================
   6. BACK TO TOP BUTTON
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.className = 'back-top';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

/* ============================================================
   7. HEADER — glassmorphism ao rolar
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const topo = document.querySelector('.topo');
    if (!topo) return;
    window.addEventListener('scroll', () => {
        topo.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
});

/* ============================================================
   8. NAVEGAÇÃO ATIVA
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const links  = document.querySelectorAll('.menu ul li a[href^="#"]');
    const secoes = Array.from(links).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if (!links.length || !secoes.length) return;

    function atualizarAtivo() {
        const scrollY = window.scrollY + 130;
        let atual = secoes[0];
        secoes.forEach(s => { if (s.offsetTop <= scrollY) atual = s; });
        links.forEach(l => {
            const ativo = l.getAttribute('href') === `#${atual.id}`;
            l.style.color = ativo ? 'var(--verde-eletrico, #4ade80)' : '';
        });
    }
    window.addEventListener('scroll', atualizarAtivo, { passive: true });
    atualizarAtivo();
});

/* ============================================================
   9. ROLAGEM SUAVE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const alvo = document.querySelector(a.getAttribute('href'));
            if (!alvo) return;
            e.preventDefault();
            const offset = document.querySelector('.topo')?.offsetHeight || 80;
            window.scrollTo({ top: alvo.offsetTop - offset, behavior: 'smooth' });
        });
    });
});

/* ============================================================
   10. ANIMAÇÕES DE SCROLL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const grupos = [
        { seletores: ['.secao h2','.secao-eyebrow','.simulador h2','.simulador > .container > p','.calculadora','.secao.impacto p','.grafico','.contato h2','.strip .pill'], from: 'translateY(40px)' },
        { seletores: ['.conteudo-grid .texto','.banner-overlay h2','.banner-overlay p'], from: 'translateX(-40px)' },
        { seletores: ['.conteudo-grid .imagem'], from: 'translateX(40px)' },
        { seletores: ['.card','.pill-icon','.contato form input','.contato form textarea','.contato form button'], from: 'translateY(28px) scale(0.95)' },
    ];

    const DURACAO = '0.65s';
    const EASING  = 'cubic-bezier(0.22, 1, 0.36, 1)';

    grupos.forEach(({ seletores, from }) => {
        seletores.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el.closest('.banner')) return;
                el.style.opacity    = '0';
                el.style.transform  = from;
                el.style.transition = `opacity ${DURACAO} ${EASING}, transform ${DURACAO} ${EASING}`;
                el.dataset.animFrom = from;
            });
        });
    });

    const observer = new IntersectionObserver(entradas => {
        entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;
            const el      = entrada.target;
            const irmaos  = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.dataset.animFrom) : [];
            const idx     = irmaos.indexOf(el);
            const delay   = idx >= 0 ? idx * 85 : 0;
            setTimeout(() => {
                el.style.opacity   = '1';
                el.style.transform = 'translateY(0) translateX(0) scale(1)';
            }, delay);
            observer.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-anim-from]').forEach(el => observer.observe(el));
});

/* ============================================================
   11. CONTADORES ANIMADOS — HERO STATS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-val[data-count]');
    if (!stats.length) return;

    function animarContador(el) {
        const alvo   = parseInt(el.dataset.count, 10);
        const sufixo = el.dataset.suffix  || '';
        const prefixo= el.dataset.prefix  || '';
        if (prefixo === 'Zero') {
            el.style.transition = 'opacity 0.6s, transform 0.6s';
            el.style.opacity = '1'; el.style.transform = 'translateY(0)';
            return;
        }
        const DURACAO = 1800;
        const EASING  = t => 1 - Math.pow(1 - t, 3);
        const inicio  = performance.now();
        const tick = agora => {
            const p   = Math.min((agora - inicio) / DURACAO, 1);
            el.textContent = Math.round(EASING(p) * alvo) + sufixo;
            if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = '0' + sufixo;
        requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
            if (!e.isIntersecting) return;
            Array.from(stats).forEach((el, i) => setTimeout(() => animarContador(el), i * 250));
            obs.disconnect();
        });
    }, { threshold: 0.5 });

    const container = stats[0].closest('.hero-stats') || stats[0].parentElement;
    obs.observe(container);
});

/* ============================================================
   12. CONTADORES ANIMADOS — IMPACT STRIP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const vals = document.querySelectorAll('.impact-val[data-target]');
    if (!vals.length) return;

    const DURACAO = 2200;
    const EASING  = t => 1 - Math.pow(1 - t, 3);

    function animarImpacto(el) {
        const alvo   = parseInt(el.dataset.target, 10);
        const sufixo = el.dataset.suffix  || '';
        const prefixo= el.dataset.prefix  || '';
        const inicio = performance.now();
        const fmt    = n => alvo >= 1000 ? n.toLocaleString('pt-BR') : n;
        const tick   = agora => {
            const p = Math.min((agora - inicio) / DURACAO, 1);
            el.textContent = prefixo + fmt(Math.round(EASING(p) * alvo)) + sufixo;
            if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = prefixo + '0' + sufixo;
        requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
            if (!e.isIntersecting) return;
            Array.from(vals).forEach((el, i) => setTimeout(() => animarImpacto(el), i * 180));
            obs.disconnect();
        });
    }, { threshold: 0.4 });

    obs.observe(vals[0].closest('.impact-counter-strip') || vals[0].parentElement);
});

/* ============================================================
   13. GRÁFICO COMPARATIVO — TROCA DE ABAS
   ============================================================ */
function trocarAba(id, btn) {
    document.querySelectorAll('.grafico-painel').forEach(p => p.classList.remove('ativo'));
    document.getElementById('painel-' + id).classList.add('ativo');
    document.querySelectorAll('.grafico-tab').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
}

/* ============================================================
   14. FORMULÁRIO DE CONTATO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contato form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nome     = form.querySelector('input[type="text"]');
        const email    = form.querySelector('input[type="email"]');
        limparErros(form);
        let valido = true;
        if (!nome.value.trim() || nome.value.trim().length < 2) { marcarErro(nome, 'Informe seu nome (mínimo 2 caracteres).'); valido = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { marcarErro(email, 'Informe um e-mail válido.'); valido = false; }
        if (!valido) return;

        const btn = form.querySelector('button[type="submit"]');
        btn.disabled     = true;
        btn.textContent  = 'Enviando…';
        setTimeout(() => {
            exibirMensagemSucesso(form);
            form.reset();
            btn.disabled    = false;
            btn.textContent = 'Enviar Proposta';
            mostrarToast('Proposta enviada com sucesso! 🌿');
        }, 1400);
    });
});

function marcarErro(campo, msg) {
    campo.style.borderColor = 'rgba(248, 113, 113, 0.7)';
    campo.style.boxShadow   = '0 0 0 3px rgba(248, 113, 113, 0.15)';
    const span = document.createElement('span');
    span.className   = 'erro-campo';
    span.textContent = msg;
    span.style.cssText = 'display:block;color:#fca5a5;font-size:0.82rem;margin-top:-0.5rem;padding-left:0.25rem;';
    campo.insertAdjacentElement('afterend', span);
}
function limparErros(form) {
    form.querySelectorAll('.erro-campo').forEach(el => el.remove());
    form.querySelectorAll('input, textarea').forEach(el => { el.style.borderColor = ''; el.style.boxShadow = ''; });
}
function exibirMensagemSucesso(form) {
    const anterior = form.querySelector('.aviso-sucesso');
    if (anterior) anterior.remove();
    const aviso = document.createElement('div');
    aviso.className = 'aviso-sucesso';
    aviso.innerHTML = '✅ Proposta enviada! Entraremos em contato em breve.';
    aviso.style.cssText = 'background:rgba(10,35,20,0.85);backdrop-filter:blur(12px);border:1px solid rgba(74,222,128,0.4);border-radius:12px;padding:1rem 1.4rem;color:#4ade80;font-weight:700;text-align:center;opacity:0;transform:translateY(8px);transition:opacity 0.4s ease,transform 0.4s ease;grid-column:1/-1;';
    form.appendChild(aviso);
    requestAnimationFrame(() => { aviso.style.opacity = '1'; aviso.style.transform = 'translateY(0)'; });
    setTimeout(() => { aviso.style.opacity = '0'; setTimeout(() => aviso.remove(), 400); }, 6000);
}

/* ============================================================
   15. ENTER NO SIMULADOR
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const c = document.getElementById('diesel');
    if (c) c.addEventListener('keydown', e => { if (e.key === 'Enter') calcularEconomia(); });
});

/* ============================================================
   16. STAGGER PILLS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.pill').forEach((p, i) => { p.style.transitionDelay = `${i * 60}ms`; });
});
/* ============================================================
   17. PARTICLE NETWORK — background animado para seções escuras
   ============================================================ */
(function initParticleNetworks() {
    const SECTIONS = ['#frota', '#energia', '.secao.impacto'];
    const CONFIG = {
        count: 38,
        maxDist: 155,
        speed: 0.32,
        nodeColor: 'rgba(74,222,128,',
        lineColor: 'rgba(74,222,128,',
        accentColor: 'rgba(103,232,249,',
        nodeSizeMin: 1.2,
        nodeSizeMax: 3.0,
    };

    function createNetwork(section) {
        const el = document.querySelector(section);
        if (!el) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'section-particle-canvas';
        el.insertBefore(canvas, el.firstChild);

        const ctx = canvas.getContext('2d');
        let W, H, nodes, raf;

        function resize() {
            W = canvas.width  = el.offsetWidth;
            H = canvas.height = el.offsetHeight;
        }

        function makeNode() {
            const isAccent = Math.random() < 0.18;
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * CONFIG.speed,
                vy: (Math.random() - 0.5) * CONFIG.speed,
                r: CONFIG.nodeSizeMin + Math.random() * (CONFIG.nodeSizeMax - CONFIG.nodeSizeMin),
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.008 + Math.random() * 0.012,
                accent: isAccent,
            };
        }

        function init() {
            resize();
            nodes = Array.from({ length: CONFIG.count }, makeNode);
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            // update
            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                n.pulse += n.pulseSpeed;
                if (n.x < -10) n.x = W + 10;
                if (n.x > W + 10) n.x = -10;
                if (n.y < -10) n.y = H + 10;
                if (n.y > H + 10) n.y = -10;
            }

            // draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONFIG.maxDist) {
                        const alpha = (1 - dist / CONFIG.maxDist) * 0.35;
                        const useAccent = a.accent || b.accent;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = useAccent
                            ? CONFIG.accentColor + alpha + ')'
                            : CONFIG.lineColor   + alpha + ')';
                        ctx.lineWidth = useAccent ? 0.6 : 0.5;
                        ctx.stroke();
                    }
                }
            }

            // draw nodes
            for (const n of nodes) {
                const pulseAlpha = 0.55 + 0.45 * Math.sin(n.pulse);
                const color = n.accent ? CONFIG.accentColor : CONFIG.nodeColor;

                // glow halo
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4.5);
                grad.addColorStop(0, color + (pulseAlpha * 0.5) + ')');
                grad.addColorStop(1, color + '0)');
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // core dot
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = color + pulseAlpha + ')';
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        }

        function start() {
            init();
            draw();
        }

        // Only animate when section is visible (perf)
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!raf) start();
                } else {
                    if (raf) { cancelAnimationFrame(raf); raf = null; }
                }
            });
        }, { threshold: 0.05 });
        observer.observe(el);

        window.addEventListener('resize', () => {
            resize();
            // re-scatter nodes on resize
            if (nodes) nodes.forEach(n => { n.x = Math.random() * W; n.y = Math.random() * H; });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        SECTIONS.forEach(createNetwork);
    });
})();