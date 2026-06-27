/* ============================================================
   CAMPO AUTÔNOMO — Agro Elétrico Inteligente
   script.js
   ============================================================ */

/* ============================================================
   1. SIMULADOR DE ECONOMIA DE DIESEL
   ============================================================ */

/**
 * calcularEconomia()
 * Lê o campo #diesel, valida a entrada e exibe uma estimativa
 * de economia anual ao migrar para máquinas elétricas.
 *
 * Premissas do cálculo (ajustáveis):
 *   - Redução média de custo: 65 % (estudos de campo agro elétrico)
 *   - CO₂ evitado: ~2,68 kg por litro de diesel não queimado
 *   - Equivalência: R$ 1 de diesel ≈ 0,36 L (preço médio ~R$ 6,80/L → ajuste abaixo)
 */
function calcularEconomia() {
  const campo     = document.getElementById('diesel');
  const resultado = document.getElementById('resultado');

  // Leitura e sanitização
  const gasto = parseFloat(campo.value);

  // Validação
  if (!campo.value || isNaN(gasto) || gasto <= 0) {
    mostrarResultado(resultado,
      '⚠️ Por favor, informe um valor mensal válido em reais (ex: 8500).',
      'erro'
    );
    campo.focus();
    return;
  }

  // --- Constantes do modelo ---
  const REDUCAO_PERCENTUAL = 0.65;          // 65 % de economia
  const PRECO_DIESEL_LITRO = 6.80;          // R$/L (referência jun/2026)
  const CO2_POR_LITRO      = 2.68;          // kg CO₂ por litro de diesel

  // --- Cálculos mensais ---
  const economiaMensal = gasto * REDUCAO_PERCENTUAL;
  const gastoMensal    = gasto - economiaMensal;

  // --- Cálculos anuais ---
  const economiaAnual  = economiaMensal * 12;
  const litrosEvitados = (economiaMensal * 12) / PRECO_DIESEL_LITRO;
  const co2Evitado     = litrosEvitados * CO2_POR_LITRO;

  // --- Formatação em BRL ---
  const fmt = (v) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const html = `
    ✅ <strong>Resultado da Simulação</strong><br><br>
    💰 Economia mensal estimada: <strong>${fmt(economiaMensal)}</strong><br>
    📅 Economia anual estimada: <strong>${fmt(economiaAnual)}</strong><br>
    🛢️ Litros de diesel evitados/ano: <strong>${Math.round(litrosEvitados).toLocaleString('pt-BR')} L</strong><br>
    🌿 CO₂ não emitido/ano: <strong>${Math.round(co2Evitado).toLocaleString('pt-BR')} kg</strong><br><br>
    <small style="opacity:.75">
      *Cálculo baseado em redução média de 65 % no custo energético
      e preço de referência do diesel a R$ ${PRECO_DIESEL_LITRO.toFixed(2)}/L.
      Valores podem variar conforme a operação.
    </small>
  `;

  mostrarResultado(resultado, html, 'sucesso');
}

/**
 * mostrarResultado(el, html, tipo)
 * Exibe ou atualiza o bloco de resultado com animação suave.
 */
function mostrarResultado(el, html, tipo) {
  el.innerHTML = html;
  el.style.display = 'block';

  // Cor de borda conforme tipo
  el.style.borderColor = tipo === 'erro'
    ? 'rgba(248, 113, 113, 0.5)'   // vermelho suave
    : 'rgba(74, 222, 128, 0.4)';   // verde elétrico

  el.style.color = tipo === 'erro'
    ? '#fca5a5'
    : 'var(--verde-eletrico)';

  // Animação de entrada
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}

// Permite calcular com a tecla Enter no campo de entrada
document.addEventListener('DOMContentLoaded', () => {
  const campoDiesel = document.getElementById('diesel');
  if (campoDiesel) {
    campoDiesel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') calcularEconomia();
    });
  }
});


/* ============================================================
   2. VALIDAÇÃO E FEEDBACK DO FORMULÁRIO DE CONTATO
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contato form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome    = form.querySelector('input[type="text"]');
    const email   = form.querySelector('input[type="email"]');
    const mensagem = form.querySelector('textarea');

    // Limpa erros anteriores
    limparErros(form);

    let valido = true;

    if (!nome.value.trim() || nome.value.trim().length < 2) {
      marcarErro(nome, 'Informe seu nome (mínimo 2 caracteres).');
      valido = false;
    }

    if (!validarEmail(email.value)) {
      marcarErro(email, 'Informe um e-mail válido.');
      valido = false;
    }

    if (!valido) return;

    // Feedback de envio (simulado — integre com backend ou serviço de e-mail)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    setTimeout(() => {
      exibirMensagemSucesso(form);
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Enviar Proposta';
    }, 1400);
  });
});

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function marcarErro(campo, mensagem) {
  campo.style.borderColor = 'rgba(248, 113, 113, 0.7)';
  campo.style.boxShadow   = '0 0 0 3px rgba(248, 113, 113, 0.15)';

  const span = document.createElement('span');
  span.className = 'erro-campo';
  span.textContent = mensagem;
  span.style.cssText = `
    display: block;
    color: #fca5a5;
    font-size: 0.82rem;
    margin-top: -0.5rem;
    padding-left: 0.25rem;
  `;
  campo.insertAdjacentElement('afterend', span);
}

function limparErros(form) {
  form.querySelectorAll('.erro-campo').forEach(el => el.remove());
  form.querySelectorAll('input, textarea').forEach(el => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  });
}

function exibirMensagemSucesso(form) {
  // Remove aviso anterior se existir
  const avisoAnterior = form.querySelector('.aviso-sucesso');
  if (avisoAnterior) avisoAnterior.remove();

  const aviso = document.createElement('div');
  aviso.className = 'aviso-sucesso';
  aviso.innerHTML = '✅ Proposta enviada! Entraremos em contato em breve.';
  aviso.style.cssText = `
    background: rgba(15, 36, 25, 0.9);
    border: 1px solid rgba(74, 222, 128, 0.4);
    border-radius: 0.75rem;
    padding: 1rem 1.4rem;
    color: var(--verde-eletrico, #4ade80);
    font-weight: 700;
    text-align: center;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  `;
  form.appendChild(aviso);

  requestAnimationFrame(() => {
    aviso.style.opacity   = '1';
    aviso.style.transform = 'translateY(0)';
  });

  // Remove automaticamente após 6 segundos
  setTimeout(() => {
    aviso.style.opacity = '0';
    setTimeout(() => aviso.remove(), 400);
  }, 6000);
}


/* ============================================================
   3. NAVEGAÇÃO ATIVA — DESTAQUE DO LINK ATUAL
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const links    = document.querySelectorAll('.menu ul li a[href^="#"]');
  const secoes   = Array.from(links)
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if (!links.length || !secoes.length) return;

  function atualizarLinkAtivo() {
    const scrollY = window.scrollY + 120; // offset do header fixo

    let secaoAtual = secoes[0];
    secoes.forEach(secao => {
      if (secao.offsetTop <= scrollY) secaoAtual = secao;
    });

    links.forEach(link => {
      const ativo = link.getAttribute('href') === `#${secaoAtual.id}`;
      link.style.color = ativo ? 'var(--verde-eletrico, #4ade80)' : '';
    });
  }

  window.addEventListener('scroll', atualizarLinkAtivo, { passive: true });
  atualizarLinkAtivo(); // roda na carga
});


/* ============================================================
   4. ANIMAÇÕES DE SCROLL — SITE INTEIRO
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Cada seletor tem uma animação de entrada diferente
  const grupos = [
    // sobe de baixo — padrão
    {
      seletores: [
        '.secao h2', '.secao-eyebrow', '.simulador h2',
        '.simulador > .container > p', '.calculadora',
        '.secao.impacto p', '.grafico', '.contato h2',
        '.introducao h2', '.introducao p',
        '.strip .pill', '.pill-text',
        'section img',
      ],
      from: 'translateY(36px)',
    },
    // vem da esquerda
    {
      seletores: ['.conteudo-grid .texto', '.banner-overlay h2', '.banner-overlay p'],
      from: 'translateX(-36px)',
    },
    // vem da direita
    {
      seletores: ['.conteudo-grid .imagem'],
      from: 'translateX(36px)',
    },
    // escala + fade (cards, pills icon, form)
    {
      seletores: ['.card', '.pill-icon', '.contato form input', '.contato form textarea', '.contato form button'],
      from: 'translateY(24px) scale(0.96)',
    },
  ];

  const DURACAO  = '0.6s';
  const EASING   = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // Aplica estado inicial em todos os elementos
  grupos.forEach(({ seletores, from }) => {
    seletores.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        // Não animar elementos dentro do banner (já visíveis no carregamento)
        if (el.closest('.banner')) return;
        el.style.opacity   = '0';
        el.style.transform = from;
        el.style.transition = `opacity ${DURACAO} ${EASING}, transform ${DURACAO} ${EASING}`;
        el.dataset.animFrom = from;
      });
    });
  });

  // Observer que aciona a animação ao entrar na viewport
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      const el    = entrada.target;
      // Atraso escalonado para irmãos (cards em sequência)
      const irmaos = el.parentElement
        ? Array.from(el.parentElement.children).filter(c => c.dataset.animFrom)
        : [];
      const idx   = irmaos.indexOf(el);
      const delay = idx >= 0 ? idx * 80 : 0;

      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0) translateX(0) scale(1)';
      }, delay);

      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Observa todos os elementos marcados
  document.querySelectorAll('[data-anim-from]').forEach(el => observer.observe(el));

  // Também observa elementos adicionados dinamicamente (ex: resultado do simulador)
  const mutObs = new MutationObserver(() => {
    document.querySelectorAll('[data-anim-from]').forEach(el => observer.observe(el));
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
});


/* ============================================================
   5. EFEITO GLOW NO TOPO AO ROLAR
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const topo = document.querySelector('.topo');
  if (!topo) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      topo.style.boxShadow = '0 2px 24px rgba(74, 222, 128, 0.12)';
    } else {
      topo.style.boxShadow = 'none';
    }
  }, { passive: true });
});


/* ============================================================
   6. ROLAGEM SUAVE PARA ÂNCORAS (fallback para navegadores antigos)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(ancora => {
    ancora.addEventListener('click', (e) => {
      const alvoId = ancora.getAttribute('href');
      const alvo   = document.querySelector(alvoId);
      if (!alvo) return;

      e.preventDefault();
      const offset = document.querySelector('.topo')?.offsetHeight || 80;

      window.scrollTo({
        top: alvo.offsetTop - offset,
        behavior: 'smooth',
      });
    });
  });
});

/* ============================================================
   7. GRÁFICO COMPARATIVO — TROCA DE ABAS
   ============================================================ */

function trocarAba(id, btn) {
    // Painéis
    document.querySelectorAll('.grafico-painel').forEach(p => p.classList.remove('ativo'));
    document.getElementById('painel-' + id).classList.add('ativo');

    // Botões
    document.querySelectorAll('.grafico-tab').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
}
/* ============================================================
   8. CONTADOR ANIMADO — HERO STATS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const stats = document.querySelectorAll('.stat-val[data-count]');
  if (!stats.length) return;

  // "Zero" é especial — não conta, só aparece com fade
  function animarContador(el) {
    const alvo    = parseInt(el.dataset.count, 10);
    const sufixo  = el.dataset.suffix  || '';
    const prefixo = el.dataset.prefix  || '';

    // Stat "Zero emissões" — sem contagem numérica
    if (prefixo === 'Zero') {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    const DURACAO = 1800;   // ms
    const EASING  = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic
    const inicio  = performance.now();

    function tick(agora) {
      const progresso = Math.min((agora - inicio) / DURACAO, 1);
      const valor     = Math.round(EASING(progresso) * alvo);
      el.textContent  = valor + sufixo;
      if (progresso < 1) requestAnimationFrame(tick);
    }

    el.textContent = '0' + sufixo;
    requestAnimationFrame(tick);
  }

  // Dispara quando o hero entra na tela (na prática já está visível)
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      // Atraso escalonado para cada stat
      const todos = Array.from(stats);
      todos.forEach((el, i) => {
        setTimeout(() => animarContador(el), i * 250);
      });
      observer.disconnect();
    });
  }, { threshold: 0.5 });

  // Observa o container pai dos stats
  const container = stats[0].closest('.hero-stats') || stats[0].parentElement;
  observer.observe(container);
});

/* ============================================================
   9. IMPACT COUNTER STRIP — Animated counters
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const vals = document.querySelectorAll('.impact-val[data-target]');
    if (!vals.length) return;

    const DURACAO = 2200;
    const EASING  = (t) => 1 - Math.pow(1 - t, 3);

    function animarImpacto(el) {
        const alvo   = parseInt(el.dataset.target, 10);
        const sufixo = el.dataset.suffix  || '';
        const prefixo= el.dataset.prefix  || '';
        const inicio = performance.now();

        function fmt(n) {
            if (alvo >= 1000) return n.toLocaleString('pt-BR');
            return n;
        }

        function tick(agora) {
            const progresso = Math.min((agora - inicio) / DURACAO, 1);
            const valor     = Math.round(EASING(progresso) * alvo);
            el.textContent  = prefixo + fmt(valor) + sufixo;
            if (progresso < 1) requestAnimationFrame(tick);
        }
        el.textContent = prefixo + '0' + sufixo;
        requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;
            const todos = Array.from(vals);
            todos.forEach((el, i) => setTimeout(() => animarImpacto(el), i * 180));
            observer.disconnect();
        });
    }, { threshold: 0.4 });

    const container = vals[0].closest('.impact-counter-strip') || vals[0].parentElement;
    observer.observe(container);
});