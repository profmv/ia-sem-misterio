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
    if (c.proximoShow) {
      var s = IA.proximoShow();
      if (!s) return false; // sem mais shows: pula a cartela
      titulo = s.faltam <= 0 ? "Tópico acontecendo AGORA" : "Próximo tópico às " + s.hora;
    }
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
    return true;
  }

  function girarOcioso() {
    for (var tentativas = 0; tentativas < D.ocioso.length; tentativas++) {
      var c = D.ocioso[cartelaAtual % D.ocioso.length];
      cartelaAtual++;
      if (cartelaOcioso(c)) return;
    }
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
    atualizarAvisoShow();
    $("#btn-simples").textContent = simples ? "🔍 Letras normais" : "🔍 Letras maiores";
    IA.mostrarTela("tela-inicio");
  }

  function atualizarAvisoShow() {
    var s = IA.proximoShow();
    var aviso = $("#aviso-show");
    if (!s || s.faltam > 25) { aviso.classList.add("oculto"); return; }
    aviso.classList.remove("oculto");
    $("#aviso-show-texto").textContent = s.faltam <= 0
      ? "Tópico acontecendo AGORA no fundo da carreta: “" + s.titulo + "”. Pode olhar daqui!"
      : "Às " + s.hora + " (daqui a " + s.faltam + " min) tem tópico de 8 minutos: “" + s.titulo + "”.";
  }
  setInterval(atualizarAvisoShow, 30000);

  $("#btn-me-escolhe").addEventListener("click", function () { abrirTrilha(D.ordem[0], "ver"); });
  $("#btn-simples").addEventListener("click", function () { simples = !simples; mostrarInicio(); });
  $("#btn-ouvir-inicio").addEventListener("click", function () {
    IA.falar("O que você quer hoje? Escolha uma das quatro opções: " +
      D.ordem.map(function (id) { return IA.TRILHAS[id].nome; }).join(". ") +
      ". Cada uma leva uns dez minutos. Se não souber, clique em: não sei, me escolhe.");
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

  /* ---------- VER ---------- */

  function desenharVer(corpo) {
    var lista = D.trilhas[trilha].ver;
    var c = lista[indiceVer];
    var temVisual = c.imagem || c.galeria || c.audio || c.video || c.emoji || c.comparar;

    // Transcrição de áudio fica junto do áudio (coluna da mídia), para a coluna de texto caber na tela
    var transcricao = c.transcricao ? el("div", { class: "transcricao" }, [c.transcricao]) : null;

    var colTexto = el("div", { class: "col-texto" }, [
      el("div", { class: "etiqueta contador" }, ["Ver " + (indiceVer + 1) + " de " + lista.length]),
      el("h2", {}, [texto(c, "titulo")]),
      c.texto ? el("div", { class: "texto" }, [texto(c, "texto")]) : null,
      c.audio ? null : transcricao,
      c.nota ? el("p", { class: "etiqueta nota" }, ["ℹ️ " + c.nota]) : null
    ]);

    if (c.revelar) {
      var caixaRevelar = el("div", { class: "revelar" });
      var botao = el("button", { class: "btn destaque", type: "button", onclick: function () {
        botao.remove();
        caixaRevelar.appendChild(el("div", { class: "feedback errado" }, [
          el("div", { class: "titulo" }, ["😮 " + (c.revelarTitulo || "Resposta")]),
          el("p", {}, [texto(c, "revelar")])
        ]));
      } }, ["👉 " + (c.botaoRevelar || "Ver a resposta")]);
      caixaRevelar.appendChild(botao);
      colTexto.appendChild(caixaRevelar);
    }

    var visual = null;
    if (c.galeria) {
      visual = el("div", { class: "galeria" }, c.galeria.map(function (s) { return imagem(s); }));
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
      visual = el("div", { class: "emoji-grande" }, [c.emoji]);
    }

    corpo.appendChild(el("div", { class: "cartela" + (c.comparar ? " cartela-comparar" : "") + (temVisual ? "" : " so-texto") }, [
      colTexto,
      visual ? el("div", { class: "visual" }, [visual]) : null
    ]));

    var ultimo = indiceVer === lista.length - 1;
    corpo.appendChild(el("div", { class: "navegacao" }, [
      indiceVer === 0 ? botaoTrilhas() : el("button", { class: "btn claro", type: "button", onclick: function () { indiceVer--; desenhar(); } }, ["← Voltar"]),
      el("div", { class: "linha" }, [
        IA.botaoOuvir(function () { return [texto(c, "titulo"), texto(c, "texto"), c.transcricao].filter(Boolean).join(". "); }),
        !ultimo ? el("button", { class: "btn claro", type: "button", onclick: function () { etapa = "fazer"; desenhar(); } }, ["Pular ⏭"]) : null,
        el("button", { class: "btn cor grande", type: "button", onclick: function () {
          if (ultimo) etapa = "fazer"; else indiceVer++;
          desenhar();
        } }, [ultimo ? "Agora é sua vez ▶" : "Próximo ▶"])
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

  // Cartão de QR enxuto para o LEVAR caber em 1366×768 sem rolar: sem a descrição longa da ferramenta e
  // sem a linha "Aponte a câmera..." (ela aparece uma vez só, no título do bloco de QRs).
  // "resumo" (opcional) entra no máximo em 2 linhas — usado só no card do kit (texto da oferta).
  function qrEnxuto(f, tamanho, resumo) {
    var c = IA.qrCelular({ nome: f.nome, url: f.url, login: f.login, custo: f.custo }, { tamanho: tamanho });
    var url = c.querySelector(".url"), instrucao = url && url.previousElementSibling;
    if (instrucao && instrucao.textContent.indexOf("📱") === 0) instrucao.remove();
    if (resumo && url) url.parentNode.insertBefore(el("div", { class: "resumo" }, [resumo]), url);
    return c;
  }

  function desenharLevar(corpo) {
    var t = D.trilhas[trilha], L = t.levar, meta = IA.TRILHAS[trilha], m = EV.marca || {}, of = EV.oferta || {};

    var esquerda = el("div", { class: "levar-col" }, [
      el("div", { class: "faixa" }, [
        el("div", { class: "rotulo" }, ["Frase para contar a um amigo:"]),
        el("div", { class: "frase-chave" }, ["“" + texto(L, "fraseChave") + "”"])
      ]),
      L.regra ? el("div", { class: "regra" }, [
        el("div", { class: "regra-titulo" }, [L.regra.titulo]),
        el("div", { class: "regra-linhas" }, L.regra.linhas.map(function (l) { return el("span", {}, [l]); })),
        L.regra.rodape ? el("div", { class: "regra-rodape" }, [L.regra.rodape]) : null
      ]) : null,
      // No máximo 2 dicas: é o que cabe na tela sem rolar
      L.dicas && L.dicas.length ? el("ul", { class: "alerta-lista dicas" }, L.dicas.slice(0, 2).map(function (d) { return el("li", {}, [d]); })) : null
    ]);

    var qrs = el("div", { class: "qrs" });
    if (m.linkMateriais) {
      // Texto da oferta só com link curto (cabe em 1 linha); link comprido já ocupa 2–3 linhas no card
      var resumoKit = IA.urlCurta(m.linkMateriais).length <= 30 ? of.texto : "";
      qrs.appendChild(qrEnxuto({ nome: of.titulo || "Leve o kit completo", url: m.linkMateriais, login: "nao", custo: "gratis" }, 120, resumoKit));
    }
    // Ferramenta pode ser um id do catálogo (shared/dados-ferramentas.js) ou um objeto {nome, url, ...}
    var catalogo = {};
    (window.FERRAMENTAS || []).forEach(function (f) { catalogo[f.id] = f; });
    (L.ferramentas || [])
      .map(function (f) { return typeof f === "string" ? catalogo[f] : f; })
      .filter(Boolean)
      .slice(0, m.linkMateriais ? 1 : 2)
      .forEach(function (f) { qrs.appendChild(qrEnxuto(f, 120)); });

    var direita = el("div", { class: "levar-col" }, [
      el("div", { class: "palavra-trilha" }, [
        el("div", { class: "rotulo" }, ["✍️ Escreva no seu cartão a palavra desta trilha:"]),
        el("div", { class: "palavra" }, [meta.palavra])
      ]),
      qrs.children.length ? el("div", { class: "qrs-bloco" }, [
        el("div", { class: "rotulo" }, ["📱 No celular (com internet): aponte a câmera ou digite:"]),
        qrs
      ]) : null
    ]);

    corpo.appendChild(el("div", { class: "levar-grade" }, [esquerda, direita]));

    corpo.appendChild(el("div", { class: "navegacao" }, [
      el("button", { class: "btn claro", type: "button", onclick: function () { etapa = "fazer"; desenhar(); } }, ["← Voltar"]),
      el("div", { class: "linha" }, [
        el("button", { class: "btn cor grande", type: "button", onclick: function () { marcar("concluidas", trilha); mostrarInicio(); } }, ["Fazer outra trilha"]),
        el("button", { class: "btn destaque grande", type: "button", onclick: function () { marcar("concluidas", trilha); tchau(); } }, ["✔ Terminei"])
      ])
    ]));
    IA.festa();
  }

  /* =========================================================
     Tchau → reset para o próximo visitante
     ========================================================= */

  function tchau() {
    var s = IA.proximoShow();
    $("#tchau-show").textContent = s && s.faltam > 0 ? "🎤 Às " + s.hora + " tem tópico de 8 minutos aqui: “" + s.titulo + "”." : "";
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
