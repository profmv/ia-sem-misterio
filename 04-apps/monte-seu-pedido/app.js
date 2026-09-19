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
  var reset = IA.autoReset();

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
    limparGerador();
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
      IA.som("criar");
      IA.acerto($("#imagem-resultado"));
    }, 1800);
  }

  $("#btn-outro").addEventListener("click", function () {
    passo = 0; escolha = { assunto: null, estilo: null, lugar: null };
    limparGerador();
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

  /* ---------- Tela final: gerador de verdade (precisa de internet) ---------- */

  // O sufixo de estilo entra em INGLÊS, depois da tradução. "Livre" não acrescenta nada.
  var ESTILOS_GERADOR = [
    { id: "livre",   rotulo: "Livre",         sufixo: "" },
    { id: "foto",    rotulo: "Foto realista", sufixo: ", professional photo, realistic, sharp focus, natural light" },
    { id: "pintura", rotulo: "Pintura",       sufixo: ", oil painting, visible brush strokes, rich colors" },
    { id: "desenho", rotulo: "Desenho",       sufixo: ", colorful cartoon illustration, clean lines" }
  ];
  // Dois serviços gratuitos em cadeia: se um falhar, o outro tenta. Se os dois falharem,
  // mostramos a imagem pronta mais parecida com o pedido (plano C, sem internet).
  var ESPERA_TRADUCAO = 6000;   // depois disso, segue com o texto em português
  var ESPERA_POLLI = 30000;     // por tentativa (a Pollinations anda sobrecarregada: HTTP 500)
  var ESPERA_HORDE = 110000;    // fila + geração + download no AI Horde
  var HORDE = "https://aihorde.net/api/v2";
  var CLIENTE_HORDE = "ia-sem-misterio:1.0:oficina";
  var CHAVE_HORDE = "0000000000";   // chave pública "anônima" do AI Horde

  var estiloGerador = "livre";
  var gerando = false;          // trava o botão enquanto espera
  var geracao = 0;              // identifica a geração em andamento (as antigas são ignoradas)
  var carga = 0;                // idem para cada carregamento de <img>
  var tarefa = null;            // { id, cancelada, req, timerFila, timerImg, hordeId }
  var falhas = { pollinations: 0, horde: 0 };  // só na memória da página: decide quem tenta primeiro
  var contouGerador = false;    // IA.contar("gerador_usado") só na primeira vez
  var campoEditado = false;     // não sobrescreve o que o visitante digitou
  var ultimoPt = "", ultimoEn = "";
  var relogioEspera = null;     // adia o aviso "Ainda está aí?" enquanto a imagem não chega

  function campo() { return $("#campo-pedido"); }

  function estado(msg, tipo) {
    var caixa = $("#estado-gerador");
    caixa.textContent = msg || "";
    caixa.className = "estado-gerador" + (tipo ? " " + tipo : "");
  }

  function esperando(ligar) {
    clearInterval(relogioEspera);
    relogioEspera = ligar ? setInterval(function () { reset.adiar(); }, 10000) : null;
  }

  function montarChips() {
    var caixa = $("#chips-estilo");
    if (caixa.children.length) return;
    ESTILOS_GERADOR.forEach(function (e) {
      caixa.appendChild(el("button", {
        class: "chip", type: "button", "data-estilo": e.id,
        "aria-pressed": e.id === estiloGerador ? "true" : "false",
        onclick: function () {
          estiloGerador = e.id;
          IA.$$("#chips-estilo .chip").forEach(function (b) {
            b.setAttribute("aria-pressed", b.getAttribute("data-estilo") === e.id ? "true" : "false");
          });
        }
      }, [e.rotulo]));
    });
  }

  function sufixoEstilo() {
    var e = ESTILOS_GERADOR.filter(function (x) { return x.id === estiloGerador; })[0];
    return e ? e.sufixo : "";
  }

  // Salvaguarda antes de mandar qualquer coisa para a internet: sexo explícito, violência
  // gráfica, drogas e ofensas graves (pt e en). A comparação é por PALAVRA INTEIRA, sem acento
  // e sem maiúscula, para não pegar palavra comum ("peito de frango", "sexta-feira", "cocada").
  var PROIBIDOS = (
    "sexo sexual sexy erotico erotica erotic nudez nude naked nsfw porn porno pornografia hentai " +
    "transar transando masturbacao masturbation penis vagina buceta tetas striptease prostituta puta " +
    "orgia estupro rape pedofilia pedofilo " +
    "decapitado decapitada mutilado gore tortura torture esfaqueado enforcado suicidio suicide " +
    "cocaina cocaine maconha heroina crack lsd ecstasy " +
    "caralho foda fuck viado vadia cuzao"
  ).split(" ");

  function semAcento(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/[áàâãä]/g, "a").replace(/[éèêë]/g, "e").replace(/[íìîï]/g, "i")
      .replace(/[óòôõö]/g, "o").replace(/[úùûü]/g, "u").replace(/ç/g, "c").replace(/ñ/g, "n");
  }

  function pedidoBloqueado(texto) {
    var limpo = " " + semAcento(texto).replace(/[^a-z0-9]+/g, " ") + " ";
    for (var i = 0; i < PROIBIDOS.length; i++) {
      if (limpo.indexOf(" " + PROIBIDOS[i] + " ") >= 0) return true;
    }
    return false;
  }

  function limparGerador() {
    campoEditado = false;
    ultimoPt = ""; ultimoEn = "";
    geracao++; carga++;
    esperando(false);
    if (!$("#area-imagem")) return;
    $("#area-imagem").classList.add("oculto");
    $("#legenda-imagem").classList.add("oculto");
    $("#btn-outra").textContent = "Gerar outra";
    $("#img-gerada").removeAttribute("src");
    estado("");
  }

  // Tradução pt→en (endpoint público do Google). Se demorar ou falhar, segue com o texto original.
  function traduzir(texto, aoTerminar) {
    var pronto = false, timer = null, xhr = null;
    function terminar(t) {
      if (pronto) return;
      pronto = true;
      clearTimeout(timer);
      aoTerminar(t && String(t).trim() ? String(t) : texto);
    }
    timer = setTimeout(function () {
      try { if (xhr) xhr.abort(); } catch (e) {}
      terminar(null);
    }, ESPERA_TRADUCAO);
    try {
      xhr = new XMLHttpRequest();
      xhr.open("GET", "https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q=" + encodeURIComponent(texto), true);
      xhr.onload = function () {
        var t = "";
        try {
          (JSON.parse(xhr.responseText)[0] || []).forEach(function (p) { t += p[0]; });
        } catch (e) { t = ""; }
        terminar(t);
      };
      xhr.onerror = function () { terminar(null); };
      xhr.send();
    } catch (e) { terminar(null); }
  }

  // Pedido JSON simples com tempo limite. Devolve { cancelar } para abortar.
  function pedirJson(op, aoOk, aoErro) {
    var pronto = false, xhr = new XMLHttpRequest(), timer = null;
    function parar() { pronto = true; clearTimeout(timer); try { xhr.abort(); } catch (e) {} }
    timer = setTimeout(function () { if (pronto) return; parar(); aoErro("tempo"); }, op.tempo || 20000);
    try {
      xhr.open(op.metodo || "GET", op.url, true);
      Object.keys(op.cabecalhos || {}).forEach(function (k) { xhr.setRequestHeader(k, op.cabecalhos[k]); });
      xhr.onload = function () {
        if (pronto) return;
        pronto = true; clearTimeout(timer);
        var dados = null;
        try { dados = JSON.parse(xhr.responseText); } catch (e) { dados = null; }
        if (xhr.status >= 200 && xhr.status < 300) aoOk(dados || {});
        else aoErro("http " + xhr.status);
      };
      xhr.onerror = function () { if (pronto) return; pronto = true; clearTimeout(timer); aoErro("rede"); };
      xhr.send(op.corpo ? JSON.stringify(op.corpo) : null);
    } catch (e) { parar(); aoErro("falha"); }
    return { cancelar: parar };
  }

  // Carrega a URL no <img> da tela, com tempo limite. Cargas antigas são ignoradas.
  function carregarNaTela(t, url, tempo, alt, aoOk, aoErro) {
    var img = $("#img-gerada");
    var meu = ++carga;
    function vale() { return meu === carga && t.id === geracao && !t.cancelada; }
    var timer = setTimeout(function () {
      if (!vale()) return;
      carga++;
      img.onload = null; img.onerror = null;
      img.removeAttribute("src");
      aoErro("tempo");
    }, tempo);
    t.timerImg = timer;
    img.onload = function () { if (!vale()) return; clearTimeout(timer); aoOk(); };
    img.onerror = function () { if (!vale()) return; clearTimeout(timer); aoErro("imagem"); };
    img.alt = alt;
    img.src = url;
  }

  /* --- Provedor 1: Pollinations (URL direta, até 2 tentativas com sementes diferentes) --- */

  function viaPollinations(t, promptEn, aoOk, aoErro) {
    var tentativa = 0;
    function tenta() {
      if (t.cancelada || t.id !== geracao) return;
      estado(tentativa ? "Ainda tentando criar sua imagem…" : "Criando sua imagem… pode levar até 1 minuto.", "espera");
      var url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(promptEn) +
        "?width=512&height=512&nologo=true&safe=true&seed=" + Math.floor(Math.random() * 1000000000);
      carregarNaTela(t, url, ESPERA_POLLI, "Imagem criada pela IA a partir do seu pedido",
        function () { aoOk("Pollinations"); },
        function () {
          if (t.cancelada || t.id !== geracao) return;
          if (tentativa === 0) { tentativa = 1; tenta(); return; }
          aoErro("falhou");
        });
    }
    tenta();
  }

  /* --- Provedor 2: AI Horde (fila de voluntários, sem cadastro) --- */

  function viaHorde(t, promptEn, aoOk, aoErro) {
    var limite = Date.now() + ESPERA_HORDE;
    estado("Entrando na fila de um serviço gratuito…", "espera");
    t.req = pedirJson({
      metodo: "POST", url: HORDE + "/generate/async", tempo: 20000,
      cabecalhos: { "apikey": CHAVE_HORDE, "Client-Agent": CLIENTE_HORDE, "Content-Type": "application/json" },
      corpo: {
        prompt: promptEn,
        params: { width: 512, height: 512, steps: 20, n: 1, sampler_name: "k_euler", cfg_scale: 7 },
        nsfw: false, censor_nsfw: true, trusted_workers: false, slow_workers: true, r2: true,
        models: ["stable_diffusion"]
      }
    }, function (d) {
      if (t.cancelada || t.id !== geracao) return;
      if (!d || !d.id) { aoErro("sem id"); return; }
      t.hordeId = d.id;
      conferir();
    }, function (m) { if (!t.cancelada) aoErro(m); });

    function conferir() {
      if (t.cancelada || t.id !== geracao) return;
      if (Date.now() > limite) { aoErro("tempo"); return; }
      t.req = pedirJson({ url: HORDE + "/generate/check/" + t.hordeId, tempo: 15000, cabecalhos: { "Client-Agent": CLIENTE_HORDE } },
        function (d) {
          if (t.cancelada || t.id !== geracao) return;
          if (d.faulted || d.is_possible === false) { aoErro("fila"); return; }
          if (d.done) { buscar(); return; }
          var msg = d.processing > 0 ? "Criando sua imagem no serviço gratuito…" : "Na fila do serviço gratuito…";
          if (!d.processing && d.queue_position > 0) msg += " posição " + d.queue_position;
          // a primeira estimativa da fila costuma ser exagerada; não assustamos o visitante com "1121 s"
          if (d.wait_time > 0) msg += d.wait_time <= 120 ? " (uns " + d.wait_time + " s)" : " (pode demorar um pouco)";
          estado(msg, "espera");
          t.timerFila = setTimeout(conferir, 3000);
        },
        function () {
          // erro passageiro na consulta: tenta de novo até estourar o tempo total
          if (t.cancelada || t.id !== geracao) return;
          t.timerFila = setTimeout(conferir, 4000);
        });
    }

    function buscar() {
      estado("Quase lá… baixando sua imagem.", "espera");
      t.req = pedirJson({ url: HORDE + "/generate/status/" + t.hordeId, tempo: 20000, cabecalhos: { "Client-Agent": CLIENTE_HORDE } },
        function (d) {
          if (t.cancelada || t.id !== geracao) return;
          var g = (d.generations || [])[0];
          if (!g) { aoErro("vazio"); return; }
          if (g.censored) { aoErro("censura"); return; }
          if (!g.img) { aoErro("sem imagem"); return; }
          carregarNaTela(t, g.img, 30000, "Imagem criada pela IA a partir do seu pedido",
            function () { aoOk("AI Horde"); },
            function () { aoErro("imagem"); });
        },
        function (m) { if (!t.cancelada) aoErro(m); });
    }
  }

  /* --- Cadeia de provedores + plano C (imagem pronta do computador) --- */

  function ordemProvedores() {
    return falhas.pollinations > falhas.horde ? ["horde", "pollinations"] : ["pollinations", "horde"];
  }

  function mostrarArea(credito, legenda) {
    $("#credito-imagem").textContent = credito;
    var leg = $("#legenda-imagem");
    leg.textContent = legenda || "";
    leg.classList.toggle("oculto", !legenda);
    $("#area-imagem").classList.remove("oculto");
    try { $("#area-imagem").scrollIntoView({ block: "center" }); } catch (e) {}
  }

  function avisarErroFinal() {
    estado("Não deu certo agora. Tente de novo ou use um dos sites ao lado.", "erro");
    IA.som("contratempo");
  }

  // Plano C: os dois serviços falharam. Mostra a imagem pronta do pedido montado, sem fingir que foi agora.
  function planoC(t) {
    var completo = escolha.assunto && escolha.estilo && escolha.lugar;
    if (!completo) { terminarGeracao(); avisarErroFinal(); return; }
    carregarNaTela(t, arquivo(escolha.assunto, escolha.estilo, escolha.lugar), 8000,
      "Exemplo pronto: " + textoPedido(),
      function () {
        terminarGeracao();
        avisarErroFinal();
        mostrarArea("Imagem criada por IA antes da oficina", "Não consegui gerar agora. Este é um exemplo pronto do tipo de pedido.");
        $("#btn-outra").textContent = "Tentar de novo";
      },
      function () { terminarGeracao(); avisarErroFinal(); });
  }

  function iniciarCadeia(t, promptEn) {
    var ordem = ordemProvedores();
    function proximo(i) {
      if (t.cancelada || t.id !== geracao) return;
      if (i >= ordem.length) { planoC(t); return; }
      var nome = ordem[i];
      (nome === "horde" ? viaHorde : viaPollinations)(t, promptEn, function (rotulo) {
        if (t.cancelada || t.id !== geracao) return;
        falhas[nome] = 0;
        terminarGeracao();
        estado("Pronto! A IA criou esta imagem só lendo o seu pedido.", "ok");
        mostrarArea("Imagem criada por IA (" + rotulo + ")", "");
        $("#btn-outra").textContent = "Gerar outra";
        IA.som("criar");
        IA.festa("pequeno");
      }, function (motivo) {
        if (t.cancelada || t.id !== geracao) return;
        falhas[nome]++;
        if (motivo === "censura") {
          terminarGeracao();
          estado("Esse pedido não pôde ser gerado. Tente descrever de outro jeito.", "erro");
          return;
        }
        if (i + 1 < ordem.length) estado("Esse serviço não respondeu. Tentando outro…", "espera");
        proximo(i + 1);
      });
    }
    proximo(0);
  }

  function terminarGeracao() {
    gerando = false;
    esperando(false);
    $("#btn-gerar").disabled = false;
    $("#btn-outra").disabled = false;
    $("#btn-cancelar").classList.add("oculto");
  }

  function cancelarGeracao() {
    if (!gerando) return;
    var t = tarefa;
    if (t) {
      t.cancelada = true;
      clearTimeout(t.timerFila); clearTimeout(t.timerImg);
      if (t.req && t.req.cancelar) t.req.cancelar();
      // avisa o AI Horde para não gastar a fila com um pedido abandonado
      if (t.hordeId) pedirJson({ metodo: "DELETE", url: HORDE + "/generate/status/" + t.hordeId, tempo: 8000,
        cabecalhos: { "Client-Agent": CLIENTE_HORDE } }, function () {}, function () {});
    }
    geracao++; carga++;
    var img = $("#img-gerada");
    img.onload = null; img.onerror = null;
    img.removeAttribute("src");
    terminarGeracao();
    estado("Cancelado. Você pode mudar o pedido e tentar de novo.");
  }

  // aproveitar = "Gerar outra": mesma frase já traduzida, só muda a semente.
  function gerarImagem(aproveitar) {
    if (gerando) return;
    var texto = campo().value.replace(/\s+/g, " ").trim();
    if (!texto) {
      estado("Escreva o que você quer ver antes de gerar.", "erro");
      campo().focus();
      return;
    }
    // Nada sai do computador se o pedido cair no filtro (vale também para o texto pré-preenchido e editado)
    if (pedidoBloqueado(texto)) {
      estado("Esse tipo de pedido não funciona aqui. Tente outra ideia.", "erro");
      campo().focus();
      return;
    }
    if (navigator.onLine === false) {
      estado("Precisa de internet para criar a imagem. Use os sites ao lado quando tiver conexão.", "erro");
      return;
    }
    gerando = true;
    $("#btn-gerar").disabled = true;
    $("#btn-outra").disabled = true;
    $("#btn-cancelar").classList.remove("oculto");
    $("#area-imagem").classList.add("oculto");
    esperando(true);
    IA.som("inicio");
    if (!contouGerador) { contouGerador = true; IA.contar("gerador_usado"); }
    var t = { id: ++geracao, cancelada: false };
    carga++;
    tarefa = t;
    if (aproveitar && ultimoEn && ultimoPt === texto) { iniciarCadeia(t, ultimoEn + sufixoEstilo()); return; }
    estado("Traduzindo seu pedido…", "espera");
    traduzir(texto, function (emIngles) {
      if (t.cancelada || t.id !== geracao) return;
      ultimoPt = texto;
      ultimoEn = emIngles;
      iniciarCadeia(t, emIngles + sufixoEstilo());
    });
  }

  montarChips();
  $("#btn-gerar").addEventListener("click", function () { gerarImagem(false); });
  $("#btn-outra").addEventListener("click", function () { gerarImagem(true); });
  $("#btn-cancelar").addEventListener("click", cancelarGeracao);
  campo().addEventListener("input", function () { campoEditado = true; });
  campo().addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); gerarImagem(false); }
  });

  $("#btn-ir-celular").addEventListener("click", function () {
    if (!campoEditado) campo().value = textoPedido();
    var qrs = $("#qrs");
    qrs.innerHTML = "";
    var catalogo = {};
    (window.FERRAMENTAS || []).forEach(function (f) { catalogo[f.id] = f; });
    ["bing-image-creator", "flux-schnell", "duck-ai"].forEach(function (id) {
      if (catalogo[id]) qrs.appendChild(IA.qrCelular(catalogo[id], { tamanho: 110 }));
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
