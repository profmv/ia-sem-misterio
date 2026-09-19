/*
 * Efeitos do "IA sem Mistério": sons curtos + partículas (confete, fogos, brilhos).
 * Carregue SEMPRE depois de ../shared/util.js:
 *   <script src="../shared/util.js"></script>
 *   <script src="../shared/efeitos.js"></script>
 *
 * Só acrescenta coisas em window.IA (e substitui IA.festa por uma versão bonita).
 * Nunca toca música de fundo: só respostas curtas ao que o visitante faz.
 * Funciona abrindo o HTML direto (file://) e publicado (https://). Se faltar som,
 * faltar canvas ou o navegador bloquear o áudio, a página continua funcionando igual.
 */
(function () {
  "use strict";
  if (!window.IA) return;

  var EV = window.EVENTO || {};
  var el = IA.el;

  // Pasta deste script, para achar sons/NOME.mp3 em qualquer app
  var BASE = (function () {
    var s = document.currentScript;
    if (!s) { var todos = document.getElementsByTagName("script"); s = todos[todos.length - 1]; }
    return String((s && s.src) || "").replace(/[^\/]*$/, "");
  })();

  /* =========================================================
     1. Sons
     ========================================================= */

  // Volume de cada som (o resto usa 0.7)
  var VOLUMES = {
    clique: .3, passo: .4, abrir: .4, fechar: .4, voltar: .4,
    vitoria: .8, conquista: .8
  };

  var cache = {};                                   // nome -> <audio> modelo
  var desligadoDeFabrica = (EV.sons === false) || IA.parametro("som") === "0";
  var ligado = IA.ler("instrutor:som", true) !== false;

  function somAtivo() { return !desligadoDeFabrica && ligado; }

  // IA.som("sucesso") ou IA.som("clique", { volume: .2 })
  function som(nome, opcoes) {
    if (!nome || nome === "nenhum" || !somAtivo()) return;
    try {
      var modelo = cache[nome];
      if (!modelo) {
        modelo = new Audio(BASE + "sons/" + nome + ".mp3");
        modelo.preload = "auto";
        cache[nome] = modelo;
      }
      var voz = modelo.cloneNode(true);             // clone: dois sons podem se sobrepor
      voz.volume = Math.max(0, Math.min(1, (opcoes && opcoes.volume) || VOLUMES[nome] || .7));
      var p = voz.play();
      if (p && p.catch) p.catch(function () {});    // autoplay bloqueado: segue sem som
    } catch (e) { /* som é enfeite: nunca quebra a página */ }
  }

  function somAlternar() {
    ligado = !ligado;
    IA.salvar("instrutor:som", ligado);
    desenharBotaoSom();
    if (ligado) som("clique");
    return ligado;
  }

  /* --- Botão discreto no canto inferior esquerdo --- */

  var botaoSom = null;

  function iconeSom(ligado) {
    if (ligado && window.IAIcones && IAIcones.svg) return IAIcones.svg("volume-2");
    // "volume-x" não existe no pacote de ícones gerado: desenhamos aqui, no mesmo estilo (Lucide)
    return '<svg class="ico-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z" />' +
      '<line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" /></svg>';
  }

  function desenharBotaoSom() {
    if (!botaoSom) return;
    botaoSom.innerHTML = iconeSom(somAtivo());
    botaoSom.setAttribute("aria-pressed", somAtivo() ? "true" : "false");
    botaoSom.setAttribute("title", somAtivo() ? "Som ligado" : "Som desligado");
    botaoSom.setAttribute("aria-label", somAtivo() ? "Som ligado. Desligar som." : "Som desligado. Ligar som.");
  }

  function criarBotaoSom() {
    if (desligadoDeFabrica || botaoSom || !document.body) return;
    var estilo = document.createElement("style");
    estilo.textContent =
      ".btn-som{position:fixed;left:10px;bottom:10px;z-index:8000;width:34px;height:34px;padding:0;" +
      "display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid currentColor;" +
      "background:var(--superficie,#fff);color:var(--texto-suave,#4A4F57);opacity:.55;cursor:pointer;line-height:0}" +
      ".btn-som:hover{opacity:1}.btn-som:focus-visible{opacity:1;outline:4px solid var(--destaque,#F2B705);outline-offset:2px}" +
      ".btn-som .ico-svg{width:18px;height:18px}" +
      "@media print{.btn-som{display:none}}";
    document.head.appendChild(estilo);

    botaoSom = el("button", { class: "btn-som nao-imprimir", type: "button", "data-som": "nenhum" });
    botaoSom.addEventListener("click", somAlternar);
    document.body.appendChild(botaoSom);
    desenharBotaoSom();
  }

  /* --- Som automático de clique, por rótulo do botão --- */

  var ALVOS = "button, .btn, .opcao, .porta, [role=button], summary, a.btn";

  function somPorRotulo(alvo) {
    if (alvo.tagName === "SUMMARY") {
      var caixa = alvo.parentNode;
      return (caixa && caixa.open) ? "fechar" : "abrir";   // no pointerdown ainda não alternou
    }
    // Cartão de escolha (.opcao/.porta): avançar uma etapa
    if (alvo.classList && (alvo.classList.contains("opcao") || alvo.classList.contains("porta"))) return "passo";
    var t = String(alvo.textContent || alvo.getAttribute("aria-label") || "").toLowerCase();
    if (/voltar|←/.test(t)) return "voltar";
    if (/come[çc]ar|iniciar|jogar/.test(t)) return "inicio";
    if (/outra|outro|sorte|escolhe|↺/.test(t)) return "sorteio";
    if (/resposta|revel/.test(t)) return "revela";
    if (/pr[óo]xim|continuar|avan[çc]ar|▶|→|terminei/.test(t)) return "proximo";
    return "clique";
  }

  function ouvirCliques() {
    document.addEventListener("pointerdown", function (ev) {
      if (!somAtivo()) return;
      var alvo = ev.target && ev.target.closest ? ev.target.closest(ALVOS) : null;
      if (!alvo || alvo.disabled) return;
      var nome = alvo.getAttribute("data-som");      // data-som manda; "nenhum" cala
      if (nome === "nenhum") return;
      som(nome || somPorRotulo(alvo));
    }, true);
  }

  // O aviso "Ainda está aí?" chama a atenção uma vez
  function vigiarInatividade() {
    if (!window.MutationObserver || !document.body) return;
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        [].forEach.call(m.addedNodes, function (n) {
          if (n.nodeType === 1 && n.classList && n.classList.contains("aviso-inatividade")) som("alerta");
        });
      });
    }).observe(document.body, { childList: true });
  }

  /* =========================================================
     2. Sons sintetizados dos fogos (Web Audio, sem arquivo)
     ========================================================= */

  var ac = null, ruido = null;

  function audio() {
    if (!somAtivo()) return null;
    try {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      if (!ac) ac = new Ctor();
      if (ac.state === "suspended" && ac.resume) ac.resume();
      return ac;
    } catch (e) { return null; }
  }

  function bufferRuido(c) {
    if (ruido) return ruido;
    var n = Math.floor(c.sampleRate * 0.7);
    ruido = c.createBuffer(1, n, c.sampleRate);
    var d = ruido.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return ruido;
  }

  // Apito do foguete subindo
  function sonsFoguete(duracao) {
    var c = audio(); if (!c) return;
    try {
      var o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(380, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(1500, c.currentTime + duracao);
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.035, c.currentTime + duracao * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duracao);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + duracao + 0.05);
    } catch (e) {}
  }

  // Estouro: ruído filtrado + "tum" grave
  function somEstouro(forca) {
    var c = audio(); if (!c) return;
    try {
      var f = forca || 1;
      var fonte = c.createBufferSource(); fonte.buffer = bufferRuido(c);
      var passa = c.createBiquadFilter(); passa.type = "bandpass";
      passa.frequency.setValueAtTime(1100, c.currentTime);
      passa.frequency.exponentialRampToValueAtTime(260, c.currentTime + 0.35);
      passa.Q.value = 0.8;
      var g = c.createGain();
      g.gain.setValueAtTime(0.09 * f, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.45);
      fonte.connect(passa); passa.connect(g); g.connect(c.destination);
      fonte.start(); fonte.stop(c.currentTime + 0.5);

      var o = c.createOscillator(), g2 = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(120, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(45, c.currentTime + 0.25);
      g2.gain.setValueAtTime(0.10 * f, c.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.3);
      o.connect(g2); g2.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.35);
    } catch (e) {}
  }

  // Crepitar do fogo dourado
  function somCrepitar() {
    var c = audio(); if (!c) return;
    try {
      for (var i = 0; i < 14; i++) {
        var t = c.currentTime + 0.15 + Math.random() * 0.9;
        var fonte = c.createBufferSource(); fonte.buffer = bufferRuido(c);
        var passa = c.createBiquadFilter(); passa.type = "highpass"; passa.frequency.value = 2600;
        var g = c.createGain();
        g.gain.setValueAtTime(0.05, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        fonte.connect(passa); passa.connect(g); g.connect(c.destination);
        fonte.start(t); fonte.stop(t + 0.07);
      }
    } catch (e) {}
  }

  /* =========================================================
     3. Motor de partículas (um canvas só, criado e removido sob demanda)
     ========================================================= */

  var CORES = ["#F2B705", "#B3261E", "#6230C9", "#0D5FC7", "#0B7A4B", "#FFFFFF", "#FF5FA2", "#21C7E8"];
  var VIVAS = ["#F2B705", "#FF5FA2", "#21C7E8", "#6230C9", "#FFFFFF", "#0D5FC7"];
  var TETO = 400;

  var cv = null, ctx = null, dpr = 1, raf = null, ultimo = 0, mediaQuadro = 16;
  var pecas = [], relogios = [];

  function reduzido() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function acaso(a, b) { return a + Math.random() * (b - a); }
  function umDe(lista) { return lista[Math.floor(Math.random() * lista.length)]; }
  function rgba(hex, a) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  // Quanto o computador aguenta agora (medido pelo tempo de quadro)
  function fator() {
    if (mediaQuadro > 33) return 0.45;
    if (mediaQuadro > 24) return 0.7;
    return 1;
  }
  function cabe(n) {
    var livre = TETO - pecas.length;
    return Math.max(0, Math.min(Math.round(n * fator()), livre));
  }

  function redimensionar() {
    if (!cv) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    cv.width = Math.round(window.innerWidth * dpr);
    cv.height = Math.round(window.innerHeight * dpr);
    cv.style.width = window.innerWidth + "px";
    cv.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function tela() {
    if (cv) return true;
    if (!document.body) return false;
    cv = document.createElement("canvas");
    cv.className = "efeitos-canvas nao-imprimir";
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;left:0;top:0;z-index:9999;pointer-events:none";
    ctx = cv.getContext("2d");
    if (!ctx) { cv = null; return false; }
    document.body.appendChild(cv);
    redimensionar();
    window.addEventListener("resize", redimensionar);
    return true;
  }

  function guardarTela() {
    if (raf) cancelAnimationFrame(raf);
    raf = null; ultimo = 0;
    pecas = [];
    window.removeEventListener("resize", redimensionar);
    if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
    cv = null; ctx = null;
  }

  // Bolinha de luz pré-desenhada por cor (fogos: composição aditiva, sem shadowBlur)
  var sprites = {};
  function sprite(cor) {
    if (sprites[cor]) return sprites[cor];
    var s = document.createElement("canvas");
    s.width = s.height = 32;
    var c = s.getContext("2d");
    var g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255,255,255,1)");      // miolo branco quente
    g.addColorStop(.18, rgba(cor, .95));
    g.addColorStop(.5, rgba(cor, .35));
    g.addColorStop(1, rgba(cor, 0));
    c.fillStyle = g;
    c.fillRect(0, 0, 32, 32);
    sprites[cor] = s;
    return s;
  }

  /* --- Criadores de partículas --- */

  function novaConfete(x, y, forca, paraCima) {
    var formas = ["ret", "ret", "fita", "circ", "estrela"];
    var ang = paraCima ? acaso(-Math.PI * 0.9, -Math.PI * 0.1) : acaso(0, Math.PI * 2);
    var v = acaso(4, 13) * forca;
    return {
      k: umDe(formas), x: x, y: y,
      vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - acaso(1, 4),
      g: acaso(.22, .34), ar: .985,
      larg: acaso(8, 16), alt: acaso(10, 20),
      rot: acaso(0, 6.3), vrot: acaso(-.25, .25),
      fase: acaso(0, 6.3), vfase: acaso(.12, .3),
      osc: acaso(.4, 1.4),
      cor: umDe(CORES), vida: acaso(90, 150), idade: 0
    };
  }

  function novaFaisca(x, y, cor, v, ang, vida, rastro) {
    return {
      k: "faisca", x: x, y: y,
      vx: Math.cos(ang) * v, vy: Math.sin(ang) * v,
      g: .07, ar: .968, cor: cor, tam: acaso(1.5, 2.6),
      vida: vida, idade: 0, crackle: false,
      pontos: rastro ? [] : null, nrastro: rastro || 0
    };
  }

  // Clarão do estouro: cresce e apaga rápido (dá o "soco" do fogo de artifício)
  function novoClarao(x, y, cor, tamanho) {
    return { k: "clarao", x: x, y: y, vx: 0, vy: 0, g: 0, ar: 1, cor: cor, raio: 8 * tamanho, vida: 16, idade: 0 };
  }

  function novoBrilho(x, y) {
    return {
      k: "brilho", x: x + acaso(-70, 70), y: y + acaso(-60, 60),
      vx: acaso(-.6, .6), vy: acaso(-1.2, .2), g: .01, ar: .99,
      tam: acaso(6, 16), fase: acaso(0, 6.3), vfase: acaso(.18, .35),
      cor: umDe(VIVAS), vida: acaso(45, 85), idade: 0
    };
  }

  function novaPoeira(x, y) {
    return {
      k: "poeira", x: x + acaso(-40, 40), y: y + acaso(-16, 16),
      vx: acaso(-1.1, 1.1), vy: acaso(-.6, .9), g: .035, ar: .96,
      tam: acaso(3, 9), cor: Math.random() < .5 ? "#8A93A6" : "#D9A066",
      vida: acaso(35, 60), idade: 0
    };
  }

  /* --- Explosões prontas --- */

  function confete(x, y, n, forca, paraCima) {
    n = cabe(n);
    for (var i = 0; i < n; i++) pecas.push(novaConfete(x, y, forca || 1, paraCima !== false));
  }

  function brilhos(x, y, n) {
    n = cabe(n);
    for (var i = 0; i < n; i++) pecas.push(novoBrilho(x, y));
  }

  // Confete caindo da borda de cima (fim de festa)
  function chuvaDoAlto(n) {
    n = cabe(n);
    for (var i = 0; i < n; i++) {
      var c = novaConfete(acaso(0, window.innerWidth), -20, 1, false);
      c.vx = acaso(-1.6, 1.6); c.vy = acaso(2, 5.5); c.vida = acaso(130, 200);
      pecas.push(c);
    }
  }

  function poeirinha(x, y, n) {
    n = cabe(n || 14);
    for (var i = 0; i < n; i++) pecas.push(novaPoeira(x, y));
  }

  // Padrões: peonia (radial), anel, salgueiro (rastros longos) e dourado (com crepitar)
  function estouro(x, y, padrao, cor, tamanho) {
    padrao = padrao || umDe(["peonia", "anel", "salgueiro", "dourado"]);
    cor = cor || umDe(VIVAS);
    var t = tamanho || 1;
    var n = cabe(padrao === "salgueiro" ? 50 * t : 64 * t);
    var i, ang, v;
    pecas.push(novoClarao(x, y, cor, t));
    if (padrao === "anel") {
      for (i = 0; i < n; i++) {
        ang = (i / n) * Math.PI * 2;
        v = acaso(7.5, 8.6) * t;
        pecas.push(novaFaisca(x, y, cor, v, ang, acaso(55, 80), 7));
      }
    } else if (padrao === "salgueiro") {
      for (i = 0; i < n; i++) {
        ang = acaso(0, Math.PI * 2);
        v = acaso(2.4, 7) * t;
        var f = novaFaisca(x, y, cor, v, ang, acaso(95, 145), 8);
        f.g = .13; f.ar = .984;
        pecas.push(f);
      }
    } else if (padrao === "dourado") {
      for (i = 0; i < n; i++) {
        ang = acaso(0, Math.PI * 2);
        v = acaso(2.5, 9) * t;
        var d = novaFaisca(x, y, Math.random() < .3 ? "#FFF3C4" : "#F2B705", v, ang, acaso(65, 105), 7);
        d.crackle = Math.random() < .4;
        pecas.push(d);
      }
      somCrepitar();
    } else {                                   // peônia: esfera cheia
      for (i = 0; i < n; i++) {
        ang = acaso(0, Math.PI * 2);
        v = acaso(2.2, 9.2) * t;
        pecas.push(novaFaisca(x, y, Math.random() < .15 ? "#FFF3C4" : cor, v, ang, acaso(60, 95), 7));
      }
    }
    somEstouro(t);
    brilhos(x, y, 5);
    ligar();
  }

  // Foguete: sobe do rodapé com rastro e estoura lá em cima
  function foguete(destinoX, destinoY, padrao, cor) {
    if (!tela()) return;
    var x0 = destinoX + acaso(-40, 40);
    var y0 = window.innerHeight + 10;
    var subida = acaso(700, 1000);
    var f = {
      k: "foguete", x: x0, y: y0,
      vx: (destinoX - x0) / (subida / 16.7),
      vy: (destinoY - y0) / (subida / 16.7),
      g: 0, ar: 1, cor: cor || umDe(VIVAS), tam: 2.6,
      vida: subida / 16.7, idade: 0,
      pontos: [], nrastro: 6,
      padrao: padrao, alvo: { x: destinoX, y: destinoY }
    };
    pecas.push(f);
    sonsFoguete(subida / 1000);
    ligar();
  }

  /* --- Laço de animação --- */

  function ligar() {
    if (!tela()) return;
    if (!raf) { ultimo = 0; raf = requestAnimationFrame(passo); }
  }

  function passo(agora) {
    raf = requestAnimationFrame(passo);
    var dt = ultimo ? Math.min(agora - ultimo, 40) : 16.7;
    ultimo = agora;
    mediaQuadro = mediaQuadro * .9 + dt * .1;
    if (document.hidden || !ctx) return;
    var k = dt / 16.7;
    var L = window.innerWidth, A = window.innerHeight;
    ctx.clearRect(0, 0, L, A);

    var vivas = [];
    for (var i = 0; i < pecas.length; i++) {
      var p = pecas[i];
      p.idade += k;
      p.vy += p.g * k;
      p.vx *= Math.pow(p.ar, k);
      p.vy *= Math.pow(p.ar, k);
      if (p.osc) p.vx += Math.sin((p.idade + p.fase) * .1) * p.osc * .06 * k;
      if (p.pontos) {
        p.pontos.push(p.x, p.y);
        if (p.pontos.length > p.nrastro * 2) p.pontos.splice(0, 2);
      }
      p.x += p.vx * k;
      p.y += p.vy * k;
      if (p.rot !== undefined) p.rot += p.vrot * k;
      if (p.vfase) p.fase += p.vfase * k;

      if (p.k === "foguete" && p.idade >= p.vida) {
        estouro(p.alvo.x, p.alvo.y, p.padrao, p.cor);
        continue;                                   // o foguete some ao estourar
      }
      if (p.idade >= p.vida || p.y > A + 80) continue;
      vivas.push(p);
      desenhar(p, L, A);
    }
    pecas = vivas;

    if (!pecas.length) guardarTela();
  }

  function desenhar(p, L, A) {
    var restante = 1 - p.idade / p.vida;
    var alfa = restante > .3 ? 1 : Math.max(0, restante / .3);

    if (p.k === "clarao") {                        // clarão do estouro
      var cr = p.raio * (1 + p.idade * .55);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = Math.pow(alfa, 2) * .9;
      ctx.drawImage(sprite(p.cor), p.x - cr, p.y - cr, cr * 2, cr * 2);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      return;
    }

    if (p.k === "faisca" || p.k === "foguete") {
      ctx.globalCompositeOperation = "lighter";
      var img = sprite(p.cor), r = p.tam * 3;
      if (p.pontos) {                              // rastro: pontos anteriores, cada vez menores
        for (var j = 0; j < p.pontos.length; j += 2) {
          var q = (j / 2) / (p.pontos.length / 2);
          ctx.globalAlpha = alfa * .3 * q * q;
          var rr = r * (.25 + q * .6);
          ctx.drawImage(img, p.pontos[j] - rr, p.pontos[j + 1] - rr, rr * 2, rr * 2);
        }
      }
      var cintila = p.crackle ? (.45 + Math.abs(Math.sin(p.idade * 1.1)) * .55) : 1;
      ctx.globalAlpha = alfa * cintila;
      ctx.drawImage(img, p.x - r, p.y - r, r * 2, r * 2);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      return;
    }

    ctx.globalAlpha = alfa;
    if (p.k === "brilho") {                        // estrela de 4 pontas que pisca
      var b = p.tam * (.55 + Math.abs(Math.sin(p.fase)) * .65);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = p.cor;
      ctx.beginPath();
      ctx.moveTo(0, -b); ctx.quadraticCurveTo(b * .18, -b * .18, b, 0);
      ctx.quadraticCurveTo(b * .18, b * .18, 0, b);
      ctx.quadraticCurveTo(-b * .18, b * .18, -b, 0);
      ctx.quadraticCurveTo(-b * .18, -b * .18, 0, -b);
      ctx.fill();
      ctx.restore();
    } else if (p.k === "poeira") {
      ctx.fillStyle = rgba(p.cor, .5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.tam, 0, 6.2832);
      ctx.fill();
    } else {                                        // confete
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.cor;
      if (p.k === "circ") {
        ctx.beginPath();
        ctx.arc(0, 0, p.larg * .45, 0, 6.2832);
        ctx.fill();
      } else if (p.k === "fita") {
        var l = p.larg * .5, h = p.alt * 1.6;
        ctx.beginPath();
        ctx.moveTo(-l, -h / 2);
        ctx.quadraticCurveTo(l * Math.sin(p.fase) * 2.2, 0, -l, h / 2);
        ctx.lineTo(l, h / 2);
        ctx.quadraticCurveTo(l + l * Math.sin(p.fase) * 2.2, 0, l, -h / 2);
        ctx.closePath();
        ctx.fill();
      } else if (p.k === "estrela") {
        var e = p.larg * .6;
        ctx.beginPath();
        for (var s = 0; s < 10; s++) {
          var raio = s % 2 ? e * .45 : e;
          var a2 = (s / 10) * 6.2832 - 1.5708;
          ctx[s ? "lineTo" : "moveTo"](Math.cos(a2) * raio, Math.sin(a2) * raio);
        }
        ctx.closePath();
        ctx.fill();
      } else {                                      // retângulo com "giro 3D"
        var larg = p.larg * Math.abs(Math.cos(p.fase));
        ctx.globalAlpha = alfa * (.65 + Math.abs(Math.cos(p.fase)) * .35);
        ctx.fillRect(-larg / 2, -p.alt / 2, Math.max(1.2, larg), p.alt);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  /* =========================================================
     4. API pública
     ========================================================= */

  function ponto(origem) {
    var meio = { x: window.innerWidth / 2, y: window.innerHeight * .42 };
    if (!origem) return meio;
    if (origem.nodeType === 1) {
      var r = origem.getBoundingClientRect();
      if (!r.width && !r.height) return meio;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    if (typeof origem.x === "number") return { x: origem.x, y: origem.y };
    return meio;
  }

  function marcar(alvo, cor) {
    if (!alvo || alvo.nodeType !== 1 || !alvo.animate) return;
    try {
      alvo.animate([{ filter: "brightness(1)" }, { filter: "brightness(1.35)" }, { filter: "brightness(1)" }],
        { duration: 420, easing: "ease-out" });
    } catch (e) {}
  }

  function tremer(alvo) {
    if (!alvo || alvo.nodeType !== 1 || !alvo.animate) return;
    if (reduzido()) { marcar(alvo); return; }
    try {
      alvo.animate([
        { transform: "translateX(0)" }, { transform: "translateX(-7px)" }, { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" }, { transform: "translateX(2px)" }, { transform: "translateX(0)" }
      ], { duration: 350, easing: "ease-in-out" });
    } catch (e) {}
  }

  // setTimeout que se apaga da lista ao disparar (o PC fica horas ligado)
  function depois(ms, fn) {
    var id = setTimeout(function () {
      var i = relogios.indexOf(id);
      if (i >= 0) relogios.splice(i, 1);
      fn();
    }, ms);
    relogios.push(id);
  }

  // Acertou: confete + brilhos saindo do ponto do clique (e um fogo se estiver numa sequência)
  function acerto(origem, opcoes) {
    opcoes = opcoes || {};
    som(opcoes.som || "sucesso");
    var p = ponto(origem);
    if (reduzido()) { if (origem && origem.nodeType === 1) marcar(origem); return; }
    if (!tela()) return;
    confete(p.x, p.y, 70, 1.05, true);
    brilhos(p.x, p.y, 14);
    var seq = opcoes.sequencia || 0;
    if (seq >= 3) {
      estouro(p.x + acaso(-120, 120), Math.max(90, p.y - acaso(120, 200)), "peonia", umDe(VIVAS), .6);
      if (seq >= 5) depois(280, function () { estouro(acaso(window.innerWidth * .2, window.innerWidth * .8), acaso(100, 240), "anel", umDe(VIVAS), .6); ligar(); });
    }
    ligar();
  }

  // Errou: nada punitivo — som, uma tremidinha e uma poeirinha
  function erro(origem) {
    som("erro");
    var alvo = origem && origem.nodeType === 1 ? origem : null;
    tremer(alvo);
    if (reduzido()) return;
    if (!tela()) return;
    var p = ponto(origem);
    poeirinha(p.x, p.y, 16);
    ligar();
  }

  // Substitui a festa antiga (emojis soltos). Sem argumento = "grande".
  function festa(nivel) {
    nivel = nivel || "grande";
    var L = window.innerWidth, A = window.innerHeight;
    if (nivel === "pequeno") {
      som("etapa");
      if (reduzido() || !tela()) return;
      confete(L / 2, A * .42, 80, 1, true);
      brilhos(L / 2, A * .42, 16);
      ligar();
      return;
    }
    if (nivel === "medio") {
      som("conquista");
      if (reduzido() || !tela()) return;
      confete(L * .5, A * .5, 90, 1.1, true);
      depois(120, function () { estouro(L * .3, A * .3, "peonia", umDe(VIVAS)); ligar(); });
      depois(520, function () { estouro(L * .7, A * .26, "anel", umDe(VIVAS)); ligar(); });
      depois(980, function () { estouro(L * .5, A * .34, "dourado", "#F2B705"); ligar(); });
      ligar();
      return;
    }
    // grande: show de 4-5 s
    som("vitoria");
    if (reduzido() || !tela()) return;
    var padroes = ["peonia", "anel", "salgueiro", "dourado"];
    [0, 420, 900, 1450, 1950, 2500, 3050, 3600, 4150].forEach(function (ms, i) {
      depois(ms, function () {
        foguete(acaso(L * .15, L * .85), acaso(A * .12, A * .38), padroes[i % padroes.length], umDe(VIVAS));
      });
    });
    // canhões de confete dos dois lados + chuva do alto no fim
    [0, 800, 1700, 2700].forEach(function (ms) {
      depois(ms, function () {
        confete(10, A * .82, 38, 1.7, true);
        confete(L - 10, A * .82, 38, 1.7, true);
        ligar();
      });
    });
    [2400, 3400].forEach(function (ms) {
      depois(ms, function () { chuvaDoAlto(40); ligar(); });
    });
    // duas explosões juntas para fechar
    depois(4400, function () {
      estouro(L * .32, A * .24, "dourado", "#F2B705");
      estouro(L * .68, A * .3, "peonia", umDe(VIVAS));
      ligar();
    });
    ligar();
  }

  function pararTudo() {
    relogios.forEach(function (t) { clearTimeout(t); });
    relogios = [];
    guardarTela();
  }

  /* =========================================================
     5. Ligar tudo
     ========================================================= */

  function iniciar() {
    criarBotaoSom();
    ouvirCliques();
    vigiarInatividade();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();

  window.addEventListener("pagehide", pararTudo);

  IA.som = som;
  IA.somAtivo = somAtivo;
  IA.somAlternar = somAlternar;
  IA.acerto = acerto;
  IA.erro = erro;
  IA.festa = festa;              // substitui a versão de util.js
  IA.confete = confete;
  IA.fogo = estouro;
  IA.pararEfeitos = pararTudo;
})();
