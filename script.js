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
   4. ANIMAÇÃO DE ENTRADA DOS CARDS (Intersection Observer)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefereReducao = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefereReducao) return; // respeita preferência do usuário

  const elementos = document.querySelectorAll('.card, .conteudo-grid, .simulador .calculadora');

  // Estado inicial: invisível e deslocado
  elementos.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada, i) => {
      if (entrada.isIntersecting) {
        // Atraso escalonado para cards em sequência
        const delay = (i % 4) * 80;
        setTimeout(() => {
          entrada.target.style.opacity   = '1';
          entrada.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach(el => observer.observe(el));
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