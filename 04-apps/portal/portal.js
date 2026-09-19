(function () {
  "use strict";

  var EV = IA.EVENTO, D = window.TRILHAS_PORTAL, el = IA.el, $ = IA.$;

  var reservado = IA.parametro("reservado") === "1";
  var simples = IA.SIMPLES;
  var emOcioso = false;

  IA.topo({ semVoltar: true });
  IA.autoReset({
    ativo: function () { return !emOcioso; },
    aoResetar: function () { reiniciar(); }
  });

  // Recarrega limpo (volta para a tela de atração)
  function reiniciar() {
    IA.limparVisitante();
    location.href = location.pathname + (reservado ? "?reservado=1" : "");
  }

  function sufixoApp() { return simples ? "&simples=1" : ""; }

  /* =========================================================
     Estado da visita (some no reset)
     ========================================================= */

  function visita() { return IA.ler("visita", { iniciadas: {}, concluidas: {} }); }
  function marcar(tipo, id) {
    var v = visita();
    if (v[tipo][id]) return;
    v[tipo][id] = true;
    IA.salvar("visita", v);
    IA.contar(id + (tipo === "iniciadas" ? "_iniciada" : "_concluida"));
  }

  /* =========================================================
     Tela de atração (ocioso)
     ========================================================= */

  var cartelaAtual = 0, timerOcioso = null;

  function cartelaOcioso(c) {
    var palco = $("#ocioso-palco");
    palco.innerHTML = "";
    var titulo = c.titulo;
    // Título comprido (3+ linhas na fonte cheia) usa fonte menor para não encostar no "Toque..."
    palco.classList.toggle("longo", String(titulo || "").length > 40);
    if (c.imagem) {
      var img = el("img", { class: "ocioso-img", src: c.imagem, alt: "" });
      img.onerror = function () { img.replaceWith(el("div", { class: "ocioso-icone" }, [c.icone || "🤖"])); };
      palco.appendChild(img);
    } else {
      palco.appendChild(el("div", { class: "ocioso-icone" }, [c.icone || "✨"]));
    }
    palco.appendChild(el("div", { class: "ocioso-titulo" }, [titulo]));
    if (c.texto) palco.appendChild(el("div", { class: "ocioso-texto" }, [c.texto]));
  }

  function girarOcioso() {
    cartelaOcioso(D.ocioso[cartelaAtual % D.ocioso.length]);
    cartelaAtual++;
  }

  function mostrarOcioso() {
    emOcioso = true;
    $("#ocioso-reservado").classList.toggle("oculto", !reservado);
    IA.mostrarTela("tela-ocioso");
    girarOcioso();
    clearInterval(timerOcioso);
    timerOcioso = setInterval(girarOcioso, 8000);
  }

  function sairDoOcioso() {
    if (!emOcioso) return;
    emOcioso = false;
    clearInterval(timerOcioso);
    mostrarInicio();
  }
  $("#tela-ocioso").addEventListener("click", sairDoOcioso);
  document.addEventListener("keydown", function () { if (emOcioso) sairDoOcioso(); });

  /* =========================================================
     Início
     ========================================================= */

  function mostrarInicio() {
    document.body.className = simples ? "simples" : "";
    var v = visita();
    var caixa = $("#portas");
    caixa.innerHTML = "";
    D.ordem.forEach(function (id) {
      var t = D.trilhas[id], meta = IA.TRILHAS[id];
      caixa.appendChild(el("button", {
        class: "cartao trilha clicavel porta " + meta.classe, type: "button",
        onclick: function () { abrirTrilha(id, "ver"); }
      }, [
        el("div", { class: "icone" }, [meta.icone]),
        el("div", {}, [
          el("h2", {}, [meta.nome]),
          el("p", {}, [t.descricao]),
          el("p", { style: "margin-top:6px" }, [
            el("span", { class: "etiqueta" }, ["⏱ " + t.duracao]), " ",
            v.concluidas[id] ? el("span", { class: "feito" }, ["✅ Você já fez"]) : null
          ])
        ])
      ]));
    });
    $("#btn-simples").textContent = simples ? "🔍 Letras normais" : "🔍 Letras maiores";
    IA.mostrarTela("tela-inicio");
  }

  // O botão "Não sei, me escolhe" saiu da tela inicial por decisão do instrutor (19/09): quem não
  // sabe escolher é encaminhado pelo concierge na porta, que pergunta o que a pessoa mais usa.
  $("#btn-simples").addEventListener("click", function () { simples = !simples; mostrarInicio(); });
  IA.ligarOuvir($("#btn-ouvir-inicio"), function () {
    return "O que você quer hoje? Escolha uma das quatro opções: " +
      D.ordem.map(function (id) { return IA.TRILHAS[id].nome; }).join(". ") +
      ". Cada uma leva uns dez minutos.";
  });

  /* =========================================================
     Trilha: VER → FAZER → LEVAR
     ========================================================= */

  var trilha = null, etapa = "ver", indiceVer = 0;

  function abrirTrilha(id, qualEtapa) {
    if (!D.trilhas[id]) return mostrarInicio();
    trilha = id;
    etapa = qualEtapa || "ver";
    indiceVer = 0;
    emOcioso = false;
    marcar("iniciadas", id);
    var meta = IA.TRILHAS[id];
    document.body.className = meta.classe + (simples ? " simples" : "");
    $("#trilha-titulo").textContent = meta.icone + " " + meta.nome;
    $("#trilha-duracao").textContent = "⏱ " + D.trilhas[id].duracao;
    desenhar();
    IA.mostrarTela("tela-trilha");
  }

  function desenharNav() {
    var nav = $("#passos-nav");
    nav.innerHTML = "";
    var ordem = ["ver", "fazer", "levar"], rotulos = { ver: "1. 👀 Ver", fazer: "2. 🖐️ Fazer", levar: "3. 🎒 Levar" };
    var atual = ordem.indexOf(etapa);
    ordem.forEach(function (e, i) {
      nav.appendChild(el("span", { class: i === atual ? "atual" : (i < atual ? "feito" : "") }, [rotulos[e]]));
    });
  }

  function botaoTrilhas() {
    return el("button", { class: "btn claro", type: "button", onclick: mostrarInicio }, ["← Trilhas"]);
  }

  function desenhar() {
    IA.parar(); // toda troca de etapa/cartela cala a leitura em voz alta
    desenharNav();
    var corpo = $("#trilha-corpo");
    corpo.innerHTML = "";
    corpo.classList.toggle("etapa-levar", etapa === "levar");
    if (etapa === "ver") desenharVer(corpo);
    else if (etapa === "fazer") desenharFazer(corpo);
    else desenharLevar(corpo);
    window.scrollTo(0, 0);
  }

  function texto(obj, campo) {
    return (simples && obj[campo + "Simples"]) ? obj[campo + "Simples"] : obj[campo];
  }

  function imagem(src, alt) {
    var img = el("img", { src: src, alt: alt || "" });
    img.onerror = function () {
      img.replaceWith(el("div", { class: "emoji-grande", title: "Imagem ainda não gerada: " + src }, ["🖼️"]));
    };
    return img;
  }

  // Link direto para um site (abre em outra aba). l = { texto, url }; sem url vira texto simples.
  // Termina com a seta pulsante (.seta-pulsa, de shared/animacoes.css); "comIcone" põe o ícone de globo antes do nome.
  function linkSite(classe, l, estilo, comIcone) {
    if (!l.url) return el("span", {}, [l.texto]);
    var globo = comIcone && window.IAIcones ? window.IAIcones.svg("globe") : "";
    return el("a", { class: classe, href: l.url, target: "_blank", rel: "noopener noreferrer", style: estilo || null }, [
      globo ? el("span", { class: "icone-site", "aria-hidden": "true", html: globo }) : null,
      l.texto,
      el("span", { class: "seta-pulsa", "aria-hidden": "true" }, ["↗"])
    ]);
  }

  // Ferramenta pode ser um id do catálogo (shared/dados-ferramentas.js) ou um objeto {nome, url, ...}
  var catalogo = {};
  (window.FERRAMENTAS || []).forEach(function (f) { catalogo[f.id] = f; });
  function ferramenta(f) { return typeof f === "string" ? catalogo[f] : f; }
  // Nome curto: "Bing Image Creator (Criador de Imagens do Bing)" -> "Bing Image Creator"
  function nomeCurto(f) { return String(f.nome || "").split(" (")[0]; }

  /* ---------- VER ---------- */

  function desenharVer(corpo) {
    var lista = D.trilhas[trilha].ver;
    var c = lista[indiceVer];
    var temVisual = c.imagem || c.galeria || c.audio || c.video || c.emoji || c.comparar;

    // Transcrição de áudio fica junto do áudio (coluna da mídia), para a coluna de texto caber na tela
    var transcricao = c.transcricao ? el("div", { class: "transcricao" }, [c.transcricao]) : null;

    // Sites citados no cartão: links diretos (só os que têm endereço). Com galeria ou emoji sozinho, ficam
    // embaixo da ilustração (a coluna do texto já é a mais alta, então não empurram a navegação);
    // nos demais (áudio, vídeo, imagem, comparar), embaixo do texto.
    var links = (c.links || []).filter(function (l) { return l.url; });
    var caixaLinks = links.length ? el("div", { class: "ver-links" }, links.map(function (l) { return linkSite("link-site", l, null, true); })) : null;
    var linksNoVisual = !!caixaLinks && !!(c.galeria || (c.emoji && !c.audio && !c.imagem && !c.video && !c.comparar));

    var colTexto = el("div", { class: "col-texto" + (caixaLinks && !linksNoVisual ? " com-links" : "") }, [
      el("div", { class: "etiqueta contador" }, ["Ver " + (indiceVer + 1) + " de " + lista.length]),
      el("h2", {}, [texto(c, "titulo")]),
      c.texto ? el("div", { class: "texto" }, [texto(c, "texto")]) : null,
      c.audio ? null : transcricao,
      c.nota ? el("p", { class: "etiqueta nota" }, ["ℹ️ " + c.nota]) : null,
      linksNoVisual ? null : caixaLinks
    ]);

    /* OPCIONAL, DESLIGADO: trancar o "Próximo" até a resposta ser revelada. Não foi pedido; o comportamento
       original (Próximo sempre livre) foi mantido. Para ligar, mude TRANCAR_PROXIMO_ATE_REVELAR para true:
       o botão fica `disabled` (estilo.css/animacoes.css/efeitos.js já tratam `disabled`) até "Ver a resposta". */
    var TRANCAR_PROXIMO_ATE_REVELAR = false;
    var esperandoResposta = TRANCAR_PROXIMO_ATE_REVELAR && !!c.revelar, btnProximo = null;
    function liberarProximo() {
      esperandoResposta = false;
      if (!btnProximo) return;
      btnProximo.disabled = false;
      btnProximo.removeAttribute("title");
    }

    if (c.revelar) {
      var caixaRevelar = el("div", { class: "revelar" });
      var botao = el("button", { class: "btn destaque", type: "button", onclick: function () {
        botao.remove();
        caixaRevelar.appendChild(el("div", { class: "feedback errado" }, [
          el("div", { class: "titulo" }, ["😮 " + (c.revelarTitulo || "Resposta")]),
          el("p", {}, [texto(c, "revelar")])
        ]));
        liberarProximo();
      } }, ["👉 " + (c.botaoRevelar || "Ver a resposta")]);
      caixaRevelar.appendChild(botao);
      colTexto.appendChild(caixaRevelar);
    }

    var visual = null;
    if (c.galeria) {
      visual = el("div", {}, [el("div", { class: "galeria" }, c.galeria.map(function (s) { return imagem(s); })), linksNoVisual ? caixaLinks : null]);
    } else if (c.imagem) {
      visual = imagem(c.imagem, c.alt);
    } else if (c.audio) {
      visual = el("div", { class: "com-audio" }, [
        el("div", { class: "emoji-grande" }, [c.emoji || "🔊"]),
        IA.midia("audio", c.audio, { falta: "O áudio ainda não foi preparado pelo instrutor. Leia o texto abaixo." }),
        transcricao
      ]);
    } else if (c.video) {
      visual = IA.midia("video", c.video, { falta: "O vídeo ainda não foi preparado pelo instrutor. Leia o texto ao lado." });
    } else if (c.comparar) {
      // Os dois lados ficam lado a lado, na largura toda (título e texto numa faixa acima)
      visual = el("div", { class: "comparar" }, c.comparar.map(function (lado, i) {
        return el("div", { class: "feedback lado " + (i === 0 ? "errado" : "certo") + (lado.imagem ? " com-imagem" : "") }, [
          el("div", {}, [
            el("div", { class: "titulo" }, [lado.rotulo]),
            el("p", { class: "lado-pedido" }, [lado.pedido]),
            lado.resultado ? el("p", { class: "lado-resultado" }, ["→ " + lado.resultado]) : null
          ]),
          lado.imagem ? imagem(lado.imagem) : null
        ]);
      }));
    } else if (c.emoji) {
      visual = el("div", {}, [el("div", { class: "emoji-grande" }, [c.emoji]), linksNoVisual ? caixaLinks : null]);
    }

    corpo.appendChild(el("div", { class: "cartela" + (c.comparar ? " cartela-comparar" : "") + (temVisual ? "" : " so-texto") }, [
      colTexto,
      visual ? el("div", { class: "visual" }, [visual]) : null
    ]));

    var ultimo = indiceVer === lista.length - 1;
    btnProximo = el("button", {
      class: "btn cor grande", type: "button",
      disabled: esperandoResposta,
      title: esperandoResposta ? "Veja a resposta antes de seguir" : null,
      onclick: function () {
        if (btnProximo.disabled) return;
        if (ultimo) etapa = "fazer"; else indiceVer++;
        desenhar();
      }
    }, [ultimo ? "Agora é sua vez ▶" : "Próximo ▶"]);
    corpo.appendChild(el("div", { class: "navegacao" }, [
      indiceVer === 0 ? botaoTrilhas() : el("button", { class: "btn claro", type: "button", onclick: function () { indiceVer--; desenhar(); } }, ["← Voltar"]),
      el("div", { class: "linha" }, [
        IA.botaoOuvir(function () { return [texto(c, "titulo"), texto(c, "texto"), c.transcricao].filter(Boolean).join(". "); }),
        !ultimo ? el("button", { class: "btn claro", type: "button", onclick: function () { etapa = "fazer"; desenhar(); } }, ["Pular ⏭"]) : null,
        btnProximo
      ])
    ]));
  }

  /* ---------- FAZER ---------- */

  function desenharFazer(corpo) {
    var f = D.trilhas[trilha].fazer;
    var href = "../" + f.app + "/index.html?trilha=" + encodeURIComponent(trilha) + sufixoApp();
    corpo.appendChild(el("div", { class: "fazer" }, [
      el("div", { class: "emoji-grande" }, [f.emoji || "🖐️"]),
      el("h2", {}, [texto(f, "titulo")]),
      el("p", { class: "fazer-texto" }, [texto(f, "texto")]),
      el("a", { class: "btn cor grande", href: href }, ["▶ " + (f.botao || "Começar")]),
      f.duracao ? el("p", { class: "fazer-duracao" }, ["Leva " + f.duracao + " · funciona sem internet"]) : null
    ]));
    corpo.appendChild(el("div", { class: "navegacao" }, [
      el("button", { class: "btn claro", type: "button", onclick: function () { etapa = "ver"; indiceVer = D.trilhas[trilha].ver.length - 1; desenhar(); } }, ["← Voltar"]),
      el("button", { class: "btn claro", type: "button", onclick: function () { etapa = "levar"; desenhar(); } }, ["Pular para o final ⏭"])
    ]));
  }

  /* ---------- LEVAR ---------- */

  // Cartão de QR do kit, enxuto para o LEVAR caber em 1366×768 sem rolar: sem a linha "Aponte a câmera..."
  // (class "instrucao"; o título do bloco já diz "Leve no celular"). O endereço continua sendo um link
  // clicável (feito por IA.qrCelular).
  function qrEnxuto(f, tamanho) {
    var c = IA.qrCelular({ nome: nomeCurto(f), url: f.url }, { tamanho: tamanho });
    var instrucao = c.querySelector(".instrucao");
    if (instrucao) instrucao.remove();
    return c;
  }

  // LEVAR: um olhar só — frase-chave (herói), regra (chips), 2 dicas, sites (links) e UM QR (o do kit).
  // Os blocos entram um após o outro (classes .entra/.entra-pop de shared/animacoes.css; --atraso cresce).
  function desenharLevar(corpo) {
    var t = D.trilhas[trilha], L = t.levar, m = EV.marca || {}, of = EV.oferta || {};

    // Relógio da sequência: cada chamada devolve o atraso deste bloco e adianta "passo" segundos
    var relogio = 0;
    function atraso(passo) { var a = "--atraso:" + relogio.toFixed(2) + "s"; relogio += passo; return a; }

    var heroi = el("div", { class: "faixa levar-heroi entra", style: atraso(.5) }, [
      el("div", { class: "rotulo" }, ["Frase para contar a um amigo:"]),
      el("div", { class: "frase-chave" }, ["“" + texto(L, "fraseChave") + "”"])
    ]);

    var regra = null;
    if (L.regra) {
      var caixaRegra = el("div", { class: "regra entra", style: atraso(.25) }, [
        el("div", { class: "regra-titulo" }, [L.regra.titulo])
      ]);
      // Cada linha é um texto ou { texto, url } (site com link direto); os chips entram um por um
      var linhas = el("div", { class: "regra-linhas" });
      L.regra.linhas.forEach(function (l) {
        var estilo = atraso(.15);
        linhas.appendChild(typeof l === "string" ? el("span", { class: "entra-pop", style: estilo }, [l]) : linkSite("regra-link entra-pop", l, estilo));
      });
      caixaRegra.appendChild(linhas);
      if (L.regra.rodape) caixaRegra.appendChild(el("div", { class: "regra-rodape" }, [L.regra.rodape]));
      regra = caixaRegra;
    }

    // No máximo 2 dicas: é o que cabe na tela sem rolar
    var dicas = L.dicas && L.dicas.length
      ? el("ul", { class: "alerta-lista dicas" }, L.dicas.slice(0, 2).map(function (d) { return el("li", { class: "entra", style: atraso(.2) }, [d]); }))
      : null;

    // "Sites para testar": todas as ferramentas da trilha como links diretos. Sites que já são links
    // na caixa da regra (ex.: "3 para brincar em casa") não se repetem.
    var ferramentas = (L.ferramentas || []).map(ferramenta).filter(Boolean);
    var jaLinkados = {};
    if (L.regra) L.regra.linhas.forEach(function (l) { if (l.url) jaLinkados[l.url] = true; });
    var sites = ferramentas.filter(function (f) { return f.url && !jaLinkados[f.url]; });
    var blocoSites = null;
    if (sites.length) {
      var inicioSites = atraso(.15);
      var lista = el("div", { class: "sites" });
      sites.forEach(function (f, i) {
        lista.appendChild(linkSite("link-site entra", { texto: nomeCurto(f), url: f.url }, i === 0 ? inicioSites : atraso(.15), true));
      });
      blocoSites = el("div", { class: "sites-bloco" }, [el("div", { class: "rotulo entra", style: inicioSites }, ["Sites para testar"]), lista]);
    }

    // Um QR só: o do kit (site publicado)
    var blocoQr = m.linkMateriais ? el("div", { class: "qrs-bloco entra-pop", style: atraso(.4) }, [
      el("div", { class: "rotulo" }, ["Leve no celular"]),
      el("div", { class: "qrs" }, [qrEnxuto({ nome: of.titulo || "Leve o kit completo", url: m.linkMateriais }, 130)])
    ]) : null;

    corpo.appendChild(el("div", { class: "levar-grade" }, [
      heroi,
      el("div", { class: "levar-col" }, [regra, dicas]),
      el("div", { class: "levar-col" }, [blocoSites, blocoQr])
    ]));

    corpo.appendChild(el("div", { class: "navegacao entra", style: atraso(.6) }, [
      el("button", { class: "btn claro", type: "button", onclick: function () { etapa = "fazer"; desenhar(); } }, ["← Voltar"]),
      el("div", { class: "linha" }, [
        el("button", { class: "btn cor grande", type: "button", onclick: function () { marcar("concluidas", trilha); mostrarInicio(); } }, ["Fazer outra trilha"]),
        el("button", { class: "btn destaque grande btn-chama", type: "button", onclick: function () { marcar("concluidas", trilha); tchau(); } }, ["✔ Terminei"])
      ])
    ]));
    IA.festa();
  }

  /* =========================================================
     Tchau → reset para o próximo visitante
     ========================================================= */

  function tchau() {
    document.body.className = "";
    IA.mostrarTela("tela-tchau");
    setTimeout(reiniciar, 7000);
  }

  /* =========================================================
     Arranque
     ========================================================= */

  var voltou = IA.parametro("voltou");
  var fixa = IA.parametro("trilha");
  var limpar = voltou || IA.parametro("reset");
  if (limpar) {
    try { history.replaceState(null, "", location.pathname + (reservado ? "?reservado=1" : "") + (fixa ? (reservado ? "&" : "?") + "trilha=" + fixa : "")); } catch (e) {}
  }

  if (voltou && D.trilhas[voltou]) abrirTrilha(voltou, "levar");
  else if (fixa && D.trilhas[fixa]) abrirTrilha(fixa, "ver");
  else mostrarOcioso();
})();
