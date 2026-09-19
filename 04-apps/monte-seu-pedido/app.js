/*
 * Monte seu pedido (trilha "Crie algo em 2 minutos").
 * Imagens pré-geradas em img/<assunto>-<estilo>-<lugar>.jpg (27 combinações).
 * Rótulos/ícones podem vir de img/imagens.dados.js (window.IMAGENS_PEDIDO); se não existir, usa o padrão abaixo.
 */
(function () {
  "use strict";

  var el = IA.el, $ = IA.$;
  var trilha = IA.TRILHAS[IA.parametro("trilha")] ? IA.parametro("trilha") : "generativa";
  document.body.className = IA.TRILHAS[trilha].classe + (IA.SIMPLES ? " simples" : "");
  IA.topo({ titulo: "Monte seu pedido", trilha: trilha });
  IA.autoReset();

  // Frases em português que montam o pedido (a ordem na frase é: estilo + assunto + lugar)
  var PADRAO = {
    assuntos: [
      { id: "cachorro", rotulo: "Cachorro caramelo", icone: "🐕", frase: "um cachorro caramelo" },
      { id: "bolo",     rotulo: "Bolo de aniversário", icone: "🎂", frase: "um bolo de aniversário colorido" },
      { id: "robo",     rotulo: "Robô simpático", icone: "🤖", frase: "um robô simpático" }
    ],
    estilos: [
      { id: "foto",    rotulo: "Foto realista",   icone: "📷", frase: "Foto realista de" },
      { id: "pintura", rotulo: "Pintura a óleo",  icone: "🖌️", frase: "Pintura a óleo de" },
      { id: "desenho", rotulo: "Desenho animado", icone: "✏️", frase: "Desenho animado colorido de" }
    ],
    lugares: [
      { id: "praia",  rotulo: "Na praia",          icone: "🏖️", frase: "numa praia ensolarada" },
      { id: "cidade", rotulo: "Na cidade à noite", icone: "🌃", frase: "numa rua da cidade à noite" },
      { id: "espaco", rotulo: "No espaço",         icone: "🚀", frase: "flutuando no espaço, entre planetas" }
    ]
  };

  // Aproveita rótulos/ícones do arquivo de dados, mantendo as frases do padrão
  var DADOS = window.IMAGENS_PEDIDO || {};
  ["assuntos", "estilos", "lugares"].forEach(function (grupo) {
    (DADOS[grupo] || []).forEach(function (externo) {
      var item = PADRAO[grupo].filter(function (p) { return p.id === externo.id; })[0];
      if (!item) return;
      if (externo.rotulo) item.rotulo = externo.rotulo;
      if (externo.icone) item.icone = externo.icone;
    });
  });

  var PASSOS = [
    { grupo: "assuntos", chave: "assunto", pergunta: "1. O que você quer ver?" },
    { grupo: "estilos",  chave: "estilo",  pergunta: "2. De que jeito?" },
    { grupo: "lugares",  chave: "lugar",   pergunta: "3. Onde?" }
  ];

  var escolha = { assunto: null, estilo: null, lugar: null };
  var passo = 0;

  function item(grupo, id) { return PADRAO[grupo].filter(function (x) { return x.id === id; })[0]; }
  function arquivo(a, e, l) { return "img/" + a + "-" + e + "-" + l + ".jpg"; }

  function textoPedido(e) {
    e = e || escolha;
    var est = e.estilo ? item("estilos", e.estilo).frase : "";
    var ass = e.assunto ? item("assuntos", e.assunto).frase : "";
    var lug = e.lugar ? item("lugares", e.lugar).frase : "";
    return [est, ass, lug].filter(Boolean).join(" ") + ".";
  }

  function desenharBalao(alvo, e) {
    e = e || escolha;
    alvo.innerHTML = "";
    var partes = [
      ["estilo", "estilos", "p-estilo", "[que estilo]"],
      ["assunto", "assuntos", "p-assunto", "[o quê]"],
      ["lugar", "lugares", "p-lugar", "[onde]"]
    ];
    partes.forEach(function (p, i) {
      if (i > 0) alvo.appendChild(document.createTextNode(" "));
      var valor = e[p[0]];
      alvo.appendChild(valor
        ? el("span", { class: "parte " + p[2] }, [item(p[1], valor).frase])
        : el("span", { class: "vazio" }, [p[3]]));
    });
    alvo.appendChild(document.createTextNode("."));
  }

  function imagem(src, alt) {
    var img = el("img", { src: src, alt: alt || "" });
    img.onerror = function () {
      img.replaceWith(el("div", { class: "falta-img" }, ["🖼️ Esta imagem ainda não está no computador. Veja as outras opções!"]));
    };
    return img;
  }

  /* ---------- Escolhas ---------- */

  function mostrarPasso() {
    var P = PASSOS[passo];
    desenharBalao($("#balao"));
    $("#progresso").innerHTML = "";
    PASSOS.forEach(function (_, i) { $("#progresso").appendChild(el("span", { class: i <= passo ? "feito" : "" })); });
    $("#pergunta").textContent = P.pergunta;
    var caixa = $("#opcoes");
    caixa.innerHTML = "";
    PADRAO[P.grupo].forEach(function (op) {
      caixa.appendChild(el("button", { class: "opcao", type: "button", onclick: function () { escolher(P.chave, op.id); } }, [
        el("span", { class: "icone" }, [op.icone]),
        el("span", { class: "rotulo" }, [op.rotulo])
      ]));
    });
    IA.mostrarTela("tela-escolha");
  }

  function escolher(chave, id) {
    escolha[chave] = id;
    if (passo < PASSOS.length - 1) { passo++; mostrarPasso(); }
    else mostrarResultado();
  }

  $("#btn-comecar").addEventListener("click", function () {
    IA.contar("monte-pedido_iniciado");
    passo = 0; escolha = { assunto: null, estilo: null, lugar: null };
    mostrarPasso();
  });
  $("#btn-voltar").addEventListener("click", function () {
    if (passo === 0) { IA.mostrarTela("tela-inicio"); return; }
    escolha[PASSOS[passo].chave] = null;
    passo--;
    escolha[PASSOS[passo].chave] = null;
    mostrarPasso();
  });

  /* ---------- Resultado ---------- */

  function mostrarResultado() {
    IA.mostrarTela("tela-resultado");
    $("#gerando").classList.remove("oculto");
    $("#resultado").classList.add("oculto");
    var caixa = $("#imagem-resultado");
    caixa.innerHTML = "";
    caixa.appendChild(imagem(arquivo(escolha.assunto, escolha.estilo, escolha.lugar), textoPedido()));
    desenharBalao($("#balao-final"));
    // Pequena espera para dar a sensação de "gerando" (a imagem já existe no computador)
    setTimeout(function () {
      $("#gerando").classList.add("oculto");
      $("#resultado").classList.remove("oculto");
      IA.festa();
    }, 1800);
  }

  $("#btn-outro").addEventListener("click", function () {
    passo = 0; escolha = { assunto: null, estilo: null, lugar: null };
    mostrarPasso();
  });

  /* ---------- Comparar estilos ---------- */

  $("#btn-comparar").addEventListener("click", function () {
    var caixa = $("#comparar");
    caixa.innerHTML = "";
    $("#titulo-comparar").textContent = "Mesmo pedido, 3 estilos: " + item("assuntos", escolha.assunto).frase + " " + item("lugares", escolha.lugar).frase;
    PADRAO.estilos.forEach(function (est) {
      caixa.appendChild(el("figure", { class: est.id === escolha.estilo ? "escolhida" : "" }, [
        imagem(arquivo(escolha.assunto, est.id, escolha.lugar), est.rotulo),
        el("figcaption", {}, [est.icone + " " + est.rotulo + (est.id === escolha.estilo ? " (o seu)" : "")])
      ]));
    });
    IA.mostrarTela("tela-comparar");
  });
  $("#btn-voltar-resultado").addEventListener("click", function () {
    IA.mostrarTela("tela-resultado");
  });

  /* ---------- No celular ---------- */

  $("#btn-ir-celular").addEventListener("click", function () {
    desenharBalao($("#balao-celular"));
    var qrs = $("#qrs");
    qrs.innerHTML = "";
    var catalogo = {};
    (window.FERRAMENTAS || []).forEach(function (f) { catalogo[f.id] = f; });
    ["duck-ai", "bing-image-creator"].forEach(function (id) {
      if (catalogo[id]) qrs.appendChild(IA.qrCelular(catalogo[id], { tamanho: 130 }));
    });
    if (!qrs.children.length) qrs.appendChild(el("p", {}, ["Procure no celular um gerador de imagens grátis, como o Duck.ai."]));
    IA.mostrarTela("tela-celular");
  });
  $("#btn-voltar-comparar").addEventListener("click", function () { IA.mostrarTela("tela-comparar"); });
  $("#btn-continuar").addEventListener("click", function () {
    IA.contar("monte-pedido_concluido");
    IA.voltarAoPortal(trilha);
  });

  // Modo simples: pula a comparação de estilos
  if (IA.SIMPLES) {
    $("#btn-comparar").textContent = "Continuar ▶";
    $("#btn-comparar").addEventListener("click", function (ev) {
      ev.stopImmediatePropagation();
      IA.contar("monte-pedido_concluido");
      IA.voltarAoPortal(trilha);
    }, true);
  }
})();
