/*
 * Utilitários compartilhados dos apps "IA sem Mistério".
 * Ordem de carga em todo app:
 *   <link rel="stylesheet" href="../shared/estilo.css">
 *   <script src="../shared/config.js"></script>
 *   <script src="../shared/qrcode.js"></script>   (só se o app mostra QR Code)
 *   <script src="../shared/util.js"></script>
 * Tudo fica em window.IA. Funciona abrindo o HTML direto (file://), sem internet.
 */
(function () {
  "use strict";

  var EV = window.EVENTO || {};
  var PREFIXO = "iasm:";

  // Nomes "de fachada" (benefício) de cada trilha
  var TRILHAS = {
    perigos:       { id: "perigos",       nome: "Não caia em golpe",       curto: "Golpes",       icone: "🛡️", classe: "t-perigos" },
    generativa:    { id: "generativa",    nome: "Crie algo em 2 minutos",  curto: "Criar",        icone: "🎨", classe: "t-generativa" },
    produtividade: { id: "produtividade", nome: "Trabalhe melhor com IA",  curto: "Trabalho",     icone: "🚀", classe: "t-produtividade" },
    incriveis:     { id: "incriveis",     nome: "Veja o impossível",       curto: "Impossível",   icone: "⭐", classe: "t-incriveis" }
  };

  /* ---------- DOM ---------- */

  // IA.el("button", {class: "btn", onclick: fn}, ["Texto", outroNo])
  function el(tag, attrs, filhos) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "text") n.textContent = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    });
    [].concat(filhos || []).forEach(function (f) {
      if (f === null || f === undefined || f === false) return;
      n.appendChild(typeof f === "string" || typeof f === "number" ? document.createTextNode(String(f)) : f);
    });
    return n;
  }

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  function escapar(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Troca a tela visível: <section class="tela" id="tela-inicio">. Também cala a leitura em voz alta.
  function mostrarTela(id) {
    parar();
    $$(".tela").forEach(function (t) { t.classList.toggle("ativa", t.id === id); });
    window.scrollTo(0, 0);
  }

  /* ---------- Dados ---------- */

  function embaralhar(lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // localStorage com prefixo e tolerância a erro (alguns modos bloqueiam)
  function salvar(chave, valor) {
    try { localStorage.setItem(PREFIXO + chave, JSON.stringify(valor)); } catch (e) {}
  }
  function ler(chave, padrao) {
    try {
      var v = localStorage.getItem(PREFIXO + chave);
      return v === null ? padrao : JSON.parse(v);
    } catch (e) { return padrao; }
  }
  function apagar(chave) {
    try { localStorage.removeItem(PREFIXO + chave); } catch (e) {}
  }
  // Apaga tudo do visitante. Chaves que começam com "instrutor:" são preservadas.
  function limparVisitante() {
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf(PREFIXO) === 0 && k.indexOf(PREFIXO + "instrutor:") !== 0) localStorage.removeItem(k);
      });
      sessionStorage.clear();
    } catch (e) {}
  }

  function parametro(nome) {
    var m = new RegExp("[?&]" + nome + "=([^&#]*)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }

  var SIMPLES = parametro("simples") === "1";
  function aplicarModoSimples() { if (SIMPLES && document.body) document.body.classList.add("simples"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", aplicarModoSimples);
  else aplicarModoSimples();

  /* ---------- Contadores do instrutor (sobrevivem ao reset) ---------- */

  // IA.contar("perigos_iniciada") soma 1 no contador deste PC
  function contar(chave) {
    var c = ler("instrutor:contadores", {});
    c[chave] = (c[chave] || 0) + 1;
    salvar("instrutor:contadores", c);
  }
  function contadores() { return ler("instrutor:contadores", {}); }

  // 5 cliques em até 3 s no elemento abre um painel com os contadores deste PC
  function modoAdmin(alvo) {
    if (!alvo) return;
    var cliques = [];
    alvo.addEventListener("click", function () {
      var agora = Date.now();
      cliques = cliques.filter(function (t) { return agora - t < 3000; });
      cliques.push(agora);
      if (cliques.length >= 5) { cliques = []; abrirAdmin(); }
    });
  }

  function abrirAdmin() {
    var c = contadores();
    var linhas = Object.keys(c).sort().map(function (k) {
      return el("tr", {}, [el("td", {}, [k]), el("td", {}, [String(c[k])])]);
    });
    var painel = el("div", { class: "painel-admin", role: "dialog" }, [
      el("h2", {}, ["Contadores deste computador"]),
      el("p", {}, ["Anote no fim do dia. Só o instrutor deve ver esta tela."]),
      linhas.length ? el("table", {}, [el("tr", {}, [el("th", {}, ["Contador"]), el("th", {}, ["Total"])])].concat(linhas))
                    : el("p", {}, ["Nenhum registro ainda."]),
      el("div", { class: "linha", style: "margin-top:16px" }, [
        el("button", { class: "btn errado", type: "button", onclick: function () {
          if (confirm("Zerar os contadores deste computador?")) { salvar("instrutor:contadores", {}); painel.remove(); }
        } }, ["Zerar"]),
        el("button", { class: "btn", type: "button", onclick: function () { painel.remove(); } }, ["Fechar"])
      ])
    ]);
    document.body.appendChild(painel);
  }

  /* ---------- Navegação entre apps ---------- */

  // Caminho do portal a partir de qualquer app em 04-apps/<app>/index.html
  var PORTAL = "../portal/index.html";

  function sufixoSimples(primeiro) { return SIMPLES ? (primeiro ? "?" : "&") + "simples=1" : ""; }

  // Volta ao portal. "trilha" (ex.: "perigos") faz o portal abrir o passo LEVAR dessa trilha.
  function voltarAoPortal(trilha) {
    parar();
    location.href = PORTAL + (trilha ? "?voltou=" + encodeURIComponent(trilha) + sufixoSimples(false) : sufixoSimples(true));
  }

  /* ---------- Inatividade (auto-reset para o próximo visitante) ---------- */

  // IA.autoReset({ segundos: 45, aviso: 30, aoResetar: function(){...}, ativo: function(){ return true; } })
  // Após "segundos" parado aparece o aviso; após mais "aviso" segundos, reseta.
  // Padrão ao resetar: limpa dados do visitante e volta ao portal (ou recarrega, se já estiver nele).
  function autoReset(opcoes) {
    opcoes = opcoes || {};
    var parado = (opcoes.segundos || EV.inatividadeSegundos || 45) * 1000;
    var aviso = (opcoes.aviso || EV.avisoSegundos || 30);
    var timer = null, contador = null, overlay = null;

    function resetar() {
      parar();
      limparVisitante();
      if (typeof opcoes.aoResetar === "function") return opcoes.aoResetar();
      if (/\/portal\/(index\.html)?$/.test(location.pathname)) location.href = location.pathname;
      else location.href = PORTAL + "?reset=1";
    }

    function fecharAviso() {
      if (overlay) { overlay.remove(); overlay = null; }
      clearInterval(contador);
    }

    function abrirAviso() {
      // Telas que não precisam de reset (ex.: tela de atração) podem desligar o aviso
      if (typeof opcoes.ativo === "function" && !opcoes.ativo()) { atividade(); return; }
      var restante = aviso;
      var num = el("div", { class: "contagem" }, [String(restante)]);
      overlay = el("div", { class: "aviso-inatividade", role: "alertdialog" }, [
        el("div", { class: "caixa" }, [
          el("h2", {}, ["Ainda está aí?"]),
          el("p", { style: "font-size:1.4rem" }, ["Toque na tela para continuar."]),
          num,
          el("p", {}, ["Se ninguém tocar, o computador recomeça para o próximo visitante."])
        ])
      ]);
      document.body.appendChild(overlay);
      contador = setInterval(function () {
        restante -= 1;
        num.textContent = String(restante);
        if (restante <= 0) { clearInterval(contador); resetar(); }
      }, 1000);
    }

    function atividade() {
      if (overlay) fecharAviso();
      clearTimeout(timer);
      timer = setTimeout(abrirAviso, parado);
    }

    // mousemove conta como atividade: quem está lendo costuma mexer o mouse
    ["pointerdown", "keydown", "wheel", "touchstart", "mousemove"].forEach(function (ev) {
      document.addEventListener(ev, atividade, { passive: true });
    });
    // Áudio ou vídeo tocando também conta
    document.addEventListener("play", atividade, true);
    document.addEventListener("timeupdate", function () { if (!overlay) atividade(); }, true);
    atividade();
    return { resetar: resetar, adiar: atividade };
  }

  /* ---------- Interface ---------- */

  // Barra superior padrão. opcoes: { titulo, trilha, semVoltar }
  function topo(opcoes) {
    opcoes = opcoes || {};
    var t = TRILHAS[opcoes.trilha];
    var marca = el("div", { class: "marca" }, [
      (t ? t.icone + " " : "") + (opcoes.titulo || EV.nomeOficina || "IA sem Mistério"),
      el("small", {}, [opcoes.titulo ? (t ? t.nome : (EV.nomeOficina || "")) : (EV.local || "")])
    ]);
    var barra = el("header", { class: "topo" + (t ? " " + t.classe : "") }, [
      marca,
      el("div", { class: "espaco" }),
      indicadorInternet(),
      opcoes.semVoltar ? null : el("a", { class: "btn claro", href: PORTAL + sufixoSimples(true) }, ["🏠 Início"])
    ]);
    document.body.insertBefore(barra, document.body.firstChild);
    modoAdmin(marca);
    return barra;
  }

  function indicadorInternet() {
    var e = el("span", { class: "etiqueta", title: "Estado da internet" });
    function atualizar() {
      var on = navigator.onLine;
      e.textContent = on ? "🌐 com internet" : "📴 sem internet";
      e.className = "etiqueta " + (on ? "ok" : "login");
    }
    window.addEventListener("online", atualizar);
    window.addEventListener("offline", atualizar);
    atualizar();
    return e;
  }

  function toast(msg, ms) {
    var t = el("div", { class: "toast", role: "status" }, [msg]);
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 2600);
  }

  /* ---------- Leitura em voz alta (com botão Ouvir/Parar) ---------- */

  // Fala em andamento: utterance, botão que a iniciou (opcional), timer de vigilância.
  var voz = { u: null, botao: null, timer: null, iniciou: false, parados: 0 };

  function rotuloOuvir(botao, falando) {
    botao.textContent = falando ? "⏹ Parar" : "🔊 Ouvir";
    botao.setAttribute("aria-label", falando ? "Parar a leitura" : "Ouvir este texto");
  }

  // Zera o estado e devolve o rótulo "Ouvir" ao botão (não chama cancel).
  function encerrarVoz() {
    clearInterval(voz.timer);
    var botao = voz.botao;
    voz.u = null; voz.botao = null; voz.timer = null; voz.iniciou = false; voz.parados = 0;
    if (botao) rotuloOuvir(botao, false);
  }

  // Para a leitura agora e volta o rótulo do botão. Segura para chamar a qualquer hora.
  function parar() {
    try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch (e) {}
    encerrarVoz();
  }

  // A cada 300 ms: se o botão saiu da tela (troca de cartela/etapa), cala; se a fala já acabou
  // sem avisar (o Chrome às vezes não dispara "end"), volta o rótulo.
  function vigiarVoz() {
    if (voz.botao && !document.documentElement.contains(voz.botao)) { parar(); return; }
    try {
      if (voz.iniciou && !speechSynthesis.speaking && !speechSynthesis.pending) {
        if (++voz.parados >= 2) encerrarVoz();
      } else voz.parados = 0;
    } catch (e) {}
  }

  // Lê um texto em voz alta (ajuda quem tem dificuldade de leitura). Funciona offline no Windows.
  // "botao" (opcional): botão que muda para "Parar" enquanto a fala durar.
  function falar(texto, botao) {
    try {
      if (!("speechSynthesis" in window)) return false;
      parar();
      var u = new SpeechSynthesisUtterance(texto);
      u.lang = "pt-BR";
      u.rate = 0.95;
      var v = speechSynthesis.getVoices().filter(function (x) { return /pt(-|_)BR/i.test(x.lang); })[0];
      if (v) u.voice = v;
      voz.u = u; voz.botao = botao || null;
      // Eventos atrasados de uma fala já cancelada (voz.u diferente) são ignorados
      u.onstart = function () { if (voz.u === u) voz.iniciou = true; };
      u.onend = u.onerror = function () { if (voz.u === u) encerrarVoz(); };
      if (botao) rotuloOuvir(botao, true);
      voz.timer = setInterval(vigiarVoz, 300);
      speechSynthesis.speak(u);
      return true;
    } catch (e) { encerrarVoz(); return false; }
  }

  // Liga um botão existente como alternador: 1º clique lê, 2º clique (ou o fim da fala) volta a "Ouvir".
  function ligarOuvir(botao, obterTexto) {
    botao.addEventListener("click", function () {
      if (voz.botao === botao) { parar(); return; }
      falar(typeof obterTexto === "function" ? obterTexto() : obterTexto, botao);
    });
    return botao;
  }

  function botaoOuvir(obterTexto) {
    return ligarOuvir(el("button", { class: "btn claro", type: "button", "aria-label": "Ouvir este texto" }, ["🔊 Ouvir"]), obterTexto);
  }

  // Rede de segurança: sair da página ou esconder a aba cala a leitura
  window.addEventListener("pagehide", parar);
  window.addEventListener("beforeunload", parar);
  document.addEventListener("visibilitychange", function () { if (document.hidden) parar(); });

  // Comemoração leve, sem biblioteca
  function festa() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var emojis = ["🎉", "✨", "⭐", "🎊", "💡"];
    for (var i = 0; i < 28; i++) {
      var s = el("span", {}, [emojis[i % emojis.length]]);
      s.style.cssText = "position:fixed;z-index:9998;pointer-events:none;font-size:" + (24 + Math.random() * 24) +
        "px;left:" + (Math.random() * 100) + "vw;top:-40px;transition:transform 1.6s ease-in,opacity 1.6s;";
      document.body.appendChild(s);
      (function (n) {
        requestAnimationFrame(function () {
          n.style.transform = "translateY(" + (window.innerHeight + 80) + "px) rotate(" + (Math.random() * 360) + "deg)";
          n.style.opacity = "0.2";
        });
        setTimeout(function () { n.remove(); }, 1700);
      })(s);
    }
  }

  // QR Code gerado offline (precisa de ../shared/qrcode.js carregado antes).
  // IA.qr("https://...", 220) -> elemento com SVG, ou null se não houver texto/biblioteca.
  function qr(texto, tamanho) {
    tamanho = tamanho || 220;
    var caixa = el("div", { class: "qr", style: "display:inline-block;background:#fff;padding:10px;border-radius:12px;line-height:0" });
    if (texto && typeof window.qrcode === "function") {
      try {
        if (window.qrcode.stringToBytesFuncs && window.qrcode.stringToBytesFuncs["UTF-8"]) {
          window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs["UTF-8"];
        }
        var q = window.qrcode(0, "M");
        q.addData(texto);
        q.make();
        caixa.innerHTML = q.createSvgTag({ cellSize: 4, margin: 16 });
        var svg = caixa.querySelector("svg");
        if (svg) { svg.setAttribute("width", tamanho); svg.setAttribute("height", tamanho); svg.setAttribute("aria-label", "QR Code: " + texto); }
        return caixa;
      } catch (e) { /* cai para a imagem */ }
    }
    var img = EV.marca && EV.marca.qrMateriais;
    if (img) {
      caixa.appendChild(el("img", { src: img, alt: "QR Code", width: tamanho, height: tamanho,
        onerror: function () { caixa.remove(); } }));
      return caixa;
    }
    return null;
  }

  // URL sem "https://" e sem barra final, para ler em voz alta ou digitar
  function urlCurta(url) { return String(url || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""); }

  // Cartão "abra no seu celular": título + QR + instrução + endereço. O endereço (.url) é sempre um link
  // que abre em outra aba (serve a quem aponta a câmera e a quem já está no navegador).
  // A linha "Aponte a câmera..." tem class "instrucao" (o portal a remove por essa classe).
  // ferramenta: objeto de window.FERRAMENTAS ou { nome, url } (login/custo do catálogo não aparecem no cartão)
  function qrCelular(ferramenta, opcoes) {
    var f = ferramenta || {};
    opcoes = opcoes || {};
    var codigo = qr(f.url, opcoes.tamanho || 150);
    return el("div", { class: "qr-celular" }, [
      codigo || el("div", { style: "font-size:3rem" }, ["📱"]),
      el("div", {}, [
        el("div", { style: "font-weight:800;font-size:1.2rem" }, [(opcoes.titulo || f.nome || "Site")]),
        f.descricao ? el("div", {}, [f.descricao]) : null,
        el("div", { class: "instrucao", style: "margin-top:6px" }, ["Aponte a câmera do celular ou toque no endereço:"]),
        el(f.url ? "a" : "div", {
          class: "url", style: "display:block;text-decoration:underline;text-underline-offset:2px",
          href: f.url || null, target: f.url ? "_blank" : null, rel: f.url ? "noopener noreferrer" : null
        }, [urlCurta(f.url), f.url ? el("span", { class: "seta-pulsa", "aria-hidden": "true" }, [" ↗"]) : null])
      ])
    ]);
  }

  // Toca um áudio/vídeo local; se o arquivo não existir, mostra aviso em vez de quebrar.
  function midia(tipo, src, opcoes) {
    opcoes = opcoes || {};
    var caixa = el("div", { class: "midia" });
    var m = el(tipo === "video" ? "video" : "audio", { src: src, controls: true, preload: "metadata",
      style: tipo === "video" ? "width:100%;max-height:60vh;border-radius:12px;background:#000" : "width:100%" });
    m.addEventListener("error", function () {
      caixa.innerHTML = "";
      caixa.appendChild(el("div", { class: "feedback errado" }, [
        el("div", { class: "titulo" }, ["Mídia ainda não preparada"]),
        el("p", { style: "margin:0" }, [opcoes.falta || ("Arquivo não encontrado: " + src + ". Veja 05-apresentacao/midia/LISTA-DE-MIDIA.md.")])
      ]));
    });
    caixa.appendChild(m);
    return caixa;
  }

  // Próximo show a partir de agora (usa EVENTO.shows)
  function proximoShow(agora) {
    agora = agora || new Date();
    var min = agora.getHours() * 60 + agora.getMinutes();
    var lista = (EV.shows || []).map(function (s) {
      var p = s.hora.split(":");
      return Object.assign({ minutos: (+p[0]) * 60 + (+p[1]) }, s);
    }).sort(function (a, b) { return a.minutos - b.minutos; });
    for (var i = 0; i < lista.length; i++) {
      // show "em andamento" por 8 minutos
      if (lista[i].minutos + 8 > min) return Object.assign({ faltam: lista[i].minutos - min }, lista[i]);
    }
    return null;
  }

  window.IA = {
    EVENTO: EV,
    TRILHAS: TRILHAS,
    SIMPLES: SIMPLES,
    el: el, $: $, $$: $$, escapar: escapar,
    mostrarTela: mostrarTela,
    embaralhar: embaralhar,
    salvar: salvar, ler: ler, apagar: apagar, limparVisitante: limparVisitante,
    parametro: parametro,
    contar: contar, contadores: contadores, modoAdmin: modoAdmin,
    PORTAL: PORTAL, voltarAoPortal: voltarAoPortal,
    autoReset: autoReset,
    topo: topo, toast: toast,
    falar: falar, parar: parar, ligarOuvir: ligarOuvir, botaoOuvir: botaoOuvir, festa: festa,
    qr: qr, urlCurta: urlCurta, qrCelular: qrCelular, midia: midia,
    proximoShow: proximoShow
  };
})();
