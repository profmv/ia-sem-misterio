/*
 * "Golpe ou seguro?" — detector de golpes (trilha "Não caia em golpe").
 *
 * Parâmetros de URL:
 *   ?trilha=perigos     trilha para onde "Continuar ▶" volta no portal (padrão: perigos)
 *   ?simples=1          modo simples: 6 rodadas (4 golpes + 2 seguros), só fácil/médio, textos curtos
 *
 * Depuração (abre direto numa tela, para QA e screenshots; não soma contadores):
 *   ?debug=rodada[&cenario=<id>]                              rodada 1 com o cenário escolhido
 *   ?debug=feedback[&cenario=<id>][&resposta=golpe|seguro]    explicação da rodada 1
 *   ?debug=resultado[&acertos=N]                              tela final
 *
 *   ?debug=sorteio                                            roda 300 sorteios e mostra as checagens (QA)
 *   ?debug=autoplay                                           joga a partida inteira clicando nos botões (QA)
 *
 * Sorteio da partida: 7 golpes (2 fáceis, 3 médios, 2 difíceis) + 3 seguros (1 fácil, 1 médio, 1 médio/difícil),
 * em ordem de dificuldade, com os seguros intercalados (nunca dois seguidos, nunca o primeiro). Nada se repete
 * na partida; em "Jogar de novo", cenários ainda não vistos têm prioridade.
 */
(function () {
  "use strict";

  var CENARIOS = window.CENARIOS || [], el = IA.el, $ = IA.$, $$ = IA.$$;

  var trilha = IA.TRILHAS[IA.parametro("trilha")] ? IA.parametro("trilha") : "perigos";
  document.body.className = IA.TRILHAS[trilha].classe + (IA.SIMPLES ? " simples" : "");
  IA.topo({ titulo: "Golpe ou seguro?", trilha: trilha });
  IA.autoReset();

  var DEBUG = IA.parametro("debug");
  var NIVEL = { facil: 0, medio: 1, dificil: 2 };
  var TOTAL = IA.SIMPLES ? 6 : 10;

  var partida = [], rodada = 0, acertos = 0, vistos = {}, seguidos = 0;

  $("#inicio-frase").textContent = IA.SIMPLES
    ? "Leia 6 mensagens e diga: é golpe ou é seguro?"
    : "Você vai ver 10 mensagens de celular e decidir: é golpe ou é seguro?";

  /* =========================================================
     Sorteio
     ========================================================= */

  // Embaralha e coloca os ainda não vistos na frente
  function priorizar(lista) {
    var emb = IA.embaralhar(lista);
    return emb.filter(function (c) { return !vistos[c.id]; }).concat(emb.filter(function (c) { return vistos[c.id]; }));
  }

  // Escolhe itens respeitando a cota por nível. "extra" = quantos a mais, só dos níveis listados em "extraNiveis".
  function escolher(lista, cota, extra, extraNiveis) {
    var escolhidos = [];
    Object.keys(cota).forEach(function (nivel) {
      var doNivel = priorizar(lista.filter(function (c) { return c.dificuldade === nivel; }));
      escolhidos = escolhidos.concat(doNivel.slice(0, cota[nivel]));
    });
    if (extra) {
      var resto = priorizar(lista.filter(function (c) {
        return escolhidos.indexOf(c) < 0 && (!extraNiveis || extraNiveis.indexOf(c.dificuldade) >= 0);
      }));
      escolhidos = escolhidos.concat(resto.slice(0, extra));
    }
    return escolhidos;
  }

  // Monta a partida em blocos por nível (fácil → médio → difícil). Dentro de cada bloco os seguros
  // ficam ENTRE golpes (nunca na ponta do bloco): assim a dificuldade só sobe, a partida começa com
  // golpe e dois seguros nunca ficam vizinhos.
  function sortearPartida() {
    var permitido = function (c) { return !IA.SIMPLES || c.dificuldade !== "dificil"; };
    var golpes = CENARIOS.filter(function (c) { return c.resposta === "golpe" && permitido(c); });
    var seguros = CENARIOS.filter(function (c) { return c.resposta === "seguro" && permitido(c); });

    var g = IA.SIMPLES ? escolher(golpes, { facil: 2, medio: 2 }) : escolher(golpes, { facil: 2, medio: 3, dificil: 2 });
    var s = IA.SIMPLES ? escolher(seguros, { facil: 1, medio: 1 }) : escolher(seguros, { facil: 1, medio: 1 }, 1, ["medio", "dificil"]);

    var lista = [];
    ["facil", "medio", "dificil"].forEach(function (nivel) {
      var bg = IA.embaralhar(g.filter(function (c) { return c.dificuldade === nivel; }));
      var bs = IA.embaralhar(s.filter(function (c) { return c.dificuldade === nivel; }));
      // vãos internos entre golpes (1..n-1); sorteia onde entram os seguros
      var vaos = IA.embaralhar(bg.map(function (_, i) { return i; }).slice(1)).slice(0, bs.length).sort();
      var sobra = bs.slice(vaos.length);          // só acontece se faltar golpe no bloco
      bg.forEach(function (c, i) {
        var k = vaos.indexOf(i);
        if (k >= 0) lista.push(bs[k]);
        lista.push(c);
      });
      lista = lista.concat(sobra);
    });
    return lista;
  }

  /* =========================================================
     Textos (modo simples usa as versões curtas)
     ========================================================= */

  function texto(c) { return IA.SIMPLES && c.textoSimples ? c.textoSimples : c.texto; }
  function fazer(c) { return IA.SIMPLES && c.fazerSimples ? c.fazerSimples : c.fazer; }
  function sinais(c) { return IA.SIMPLES ? c.sinais.slice(0, 2) : c.sinais; }

  // Tira emojis e símbolos para a leitura em voz alta
  function paraFala(s) {
    return String(s || "")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "")
      .replace(/•+/g, " ").replace(/[“”]/g, "\"").replace(/\s+/g, " ").trim();
  }

  function textoParaOuvir(c) {
    return paraFala((c.contexto ? c.contexto + " " : "") + "Mensagem de " + c.remetente + ": " + texto(c));
  }

  /* =========================================================
     Balão com o visual do canal
     ========================================================= */

  // "QR Code" desenhado com quadradinhos. NÃO é um QR de verdade (celular não lê): é só ilustração.
  function qrFalso(semente) {
    var n = 11, caixa = el("div", { class: "qr-falso", "aria-hidden": "true" });
    var h = 7;
    for (var k = 0; k < semente.length; k++) h = (h * 31 + semente.charCodeAt(k)) >>> 0;
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var cx = x < 3 ? 0 : (x >= n - 3 ? n - 3 : -1);
        var cy = y < 3 ? 0 : (y >= n - 3 ? n - 3 : -1);
        var preto;
        if (cx >= 0 && cy >= 0 && !(cx === n - 3 && cy === n - 3)) {
          preto = !(x - cx === 1 && y - cy === 1);        // quadradinho de canto: anel preto, miolo branco
        } else {
          h = (h * 1103515245 + 12345) >>> 0;
          preto = ((h >>> 16) % 2) === 0;
        }
        caixa.appendChild(el("i", { class: preto ? "p" : "" }));
      }
    }
    return caixa;
  }

  function linhaHora(v) { return v && v.hora ? el("span", { class: "hora" }, [v.hora + " ✓✓"]) : null; }

  function corpoMensagem(c, v) {
    var t = texto(c);
    if (v.audio) {
      return [
        el("div", { class: "audio" }, [el("span", { class: "play", "aria-hidden": "true" }, ["▶"]), el("span", { class: "onda" }), v.audio]),
        el("div", { class: "rot-transcricao" }, ["Transcrição do áudio"]),
        el("div", { class: "transcrito" }, ["“" + t + "”"])
      ];
    }
    return [el("div", {}, [t])];
  }

  function balaoWhatsApp(c, v) {
    var sub;
    if (v.status === "novo") sub = el("span", { class: "aviso-numero" }, ["⚠️ Número novo · não está nos seus contatos"]);
    else if (v.status === "salvo") sub = "✔ contato salvo";
    else if (v.status === "grupo") sub = "grupo da família";
    else sub = v.nota || "";
    var msg = el("div", { class: "msg" }, [
      v.encaminhado ? el("div", { class: "encaminhado" }, ["↪↪ Encaminhado com frequência"]) : null,
      v.video ? el("div", { class: "video-falso" }, ["▶ VÍDEO", el("span", { style: "font-weight:400" }, [v.video])]) : null,
      v.anexo ? el("div", { class: "anexo" }, [v.anexo]) : null
    ].concat(corpoMensagem(c, v), [linhaHora(v)]));
    return el("div", { class: "balao zap" }, [
      el("div", { class: "cab" }, [
        el("div", { class: "avatar", "aria-hidden": "true" }, [v.avatar || "👤"]),
        el("div", {}, [
          el("div", { class: "nome" }, [c.remetente]),
          v.perfil ? el("div", { class: "sub" }, ["Nome no perfil: " + v.perfil]) : null,
          el("div", { class: "sub" }, [sub])
        ]),
        el("div", { style: "margin-left:auto; font-size:.8em; opacity:.85" }, ["💬 WhatsApp"])
      ]),
      el("div", { class: "corpo" }, [msg])
    ]);
  }

  function balaoSMS(c, v) {
    return el("div", { class: "balao sms" }, [
      el("div", { class: "cab" }, [
        el("div", { class: "avatar", "aria-hidden": "true" }, ["💬"]),
        el("div", {}, [el("div", { class: "nome" }, [c.remetente]), el("div", { class: "sub" }, ["Mensagem de texto (SMS)"])])
      ]),
      el("div", { class: "corpo" }, [el("div", { class: "msg" }, [texto(c), v.hora ? el("span", { class: "hora" }, [v.hora]) : null])])
    ]);
  }

  function balaoLigacao(c, v) {
    return el("div", { class: "balao ligacao" }, [
      el("div", { class: "cab" }, [
        el("div", { class: "tel", "aria-hidden": "true" }, ["📞"]),
        el("div", {}, [
          el("div", { class: "sub" }, [v.rotulo || "Chamada"]),
          el("div", { class: "nome", style: "font-size:1.2em" }, [c.remetente]),
          v.numero ? el("div", { class: "sub" }, [v.numero]) : null
        ]),
        el("div", { class: "botoes-tel", "aria-hidden": "true" }, [
          el("span", { style: "background:#B3261E" }, ["✖"]), el("span", { style: "background:#0B7A4B" }, ["✆"])
        ])
      ]),
      el("div", { class: "corpo" }, [
        el("div", { class: "rot-transcricao", style: "margin-top:0" }, ["📝 O que a pessoa fala"]),
        el("div", { class: "transcrito" }, ["“" + texto(c) + "”"])
      ])
    ]);
  }

  function balaoEmail(c, v) {
    return el("div", { class: "balao email" }, [
      el("div", { class: "cab" }, [
        el("div", { class: "sub", style: "font-weight:700" }, ["✉️ Caixa de entrada"]),
        el("div", { class: "de" }, [el("strong", {}, ["De: "]), c.remetente + (v.de ? " <" + v.de + ">" : "")]),
        v.assunto ? el("div", { class: "assunto" }, ["Assunto: " + v.assunto]) : null
      ]),
      el("div", { class: "corpo" }, [texto(c)])
    ]);
  }

  function balaoAnuncio(c, v) {
    return el("div", { class: "balao anuncio" }, [
      el("div", { class: "cab" }, [
        el("div", { class: "avatar", "aria-hidden": "true" }, [v.avatar || "📢"]),
        el("div", {}, [el("div", { class: "nome" }, [c.remetente]), el("div", { class: "sub" }, ["Patrocinado · 📢 anúncio"])])
      ]),
      el("div", { class: "grade-anuncio" }, [
        el("div", { class: "midia-falsa" }, [
          el("span", { "aria-hidden": "true" }, [v.emoji || "🎥"]),
          v.legenda ? el("span", { class: "legenda" }, [v.legenda]) : null
        ]),
        el("div", {}, [texto(c), el("div", {}, [el("span", { class: "cta-falso", "aria-hidden": "true" }, [v.botao || "Saiba mais"])])])
      ])
    ]);
  }

  function balaoQR(c, v) {
    return el("div", { class: "balao qrcode" }, [
      el("div", { class: "grade-qr" }, [
        el("div", { class: "cartaz" }, [
          el("div", { class: "titulo-cartaz" }, ["📲 " + (v.cartaz || "PAGUE COM PIX")]),
          qrFalso(c.id),
          el("div", { class: "aviso-cartaz" }, [v.aviso || ""]),
          el("div", { class: "sub", style: "margin-top:2px" }, ["(" + c.remetente + ")"])
        ]),
        el("div", { class: "tela-banco" }, [
          el("div", { class: "sub", style: "font-weight:700" }, ["📱 Tela do seu banco"]),
          el("div", {}, ["Pagar"]),
          el("div", { class: "valor" }, [v.valor || ""]),
          el("div", {}, ["para:"]),
          el("div", { class: "para" }, [v.para || ""]),
          el("div", { class: "sub" }, [v.tipo || ""]),
          el("span", { class: "falso-btn", "aria-hidden": "true" }, ["Confirmar"])
        ])
      ])
    ]);
  }

  function balaoLoja(c, v) {
    return el("div", { class: "balao loja" }, [
      el("div", { class: "cab" }, [
        el("span", { "aria-hidden": "true" }, [v.app ? "📲" : "🔒"]),
        el("span", { class: "barra-endereco" }, [v.endereco || ""]),
        el("strong", {}, [c.remetente])
      ]),
      el("div", { class: "grade-loja" }, [
        el("div", { class: "foto-produto", "aria-hidden": "true" }, [v.emoji || "🛍️"]),
        el("div", {}, [
          v.selo ? el("span", { class: "selo-loja" + (c.resposta === "seguro" ? " ok" : "") }, [v.selo]) : null,
          el("div", { class: "produto" }, [v.produto || ""]),
          v.estrelas ? el("div", { class: "estrelas" }, [v.estrelas]) : null,
          v.precoAntigo ? el("div", { class: "preco-antigo" }, ["de " + v.precoAntigo]) : null,
          v.preco ? el("div", { class: "preco" }, [(v.precoAntigo ? "por " : "") + v.preco]) : null,
          el("div", { class: "desc-loja" }, [texto(c)])
        ])
      ])
    ]);
  }

  function balaoApp(c, v) {
    return el("div", { class: "balao app" }, [
      el("div", { class: "cab" }, [
        el("div", { class: "avatar", "aria-hidden": "true" }, [v.avatar || "📱"]),
        el("div", {}, [el("div", { class: "nome" }, [c.remetente]), el("div", { class: "sub" }, [v.nota || "aplicativo"])])
      ]),
      el("div", { class: "corpo" }, [
        el("div", { class: "notificacao" }, [el("div", { class: "tit" }, ["🔔 Aviso importante"]), texto(c)])
      ])
    ]);
  }

  var DESENHOS = {
    whatsapp: balaoWhatsApp, sms: balaoSMS, ligacao: balaoLigacao, email: balaoEmail,
    anuncio: balaoAnuncio, qrcode: balaoQR, loja: balaoLoja, app: balaoApp
  };

  function balao(c, compacto) {
    var b = (DESENHOS[c.canal] || balaoSMS)(c, c.visual || {});
    if (compacto) b.classList.add("compacto");
    return b;
  }

  function situacao(alvo, c) {
    alvo.textContent = c.contexto ? "📍 " + c.contexto : "";
    alvo.classList.toggle("oculto", !c.contexto);
  }

  /* =========================================================
     Rodada
     ========================================================= */

  function comecar() {
    partida = sortearPartida();
    rodada = 0;
    acertos = 0;
    seguidos = 0;
    partida.forEach(function (c) { vistos[c.id] = true; });
    if (!DEBUG) IA.contar("detector_iniciado");
    mostrarRodada();
  }

  function mostrarRodada() {
    var c = partida[rodada];
    $("#rodada-titulo").textContent = "Mensagem " + (rodada + 1) + " de " + partida.length;
    var prog = $("#rodada-progresso");
    prog.innerHTML = "";
    partida.forEach(function (_, i) { prog.appendChild(el("span", { class: i < rodada ? "feito" : "" })); });
    var ouvir = $("#rodada-ouvir");
    ouvir.innerHTML = "";
    ouvir.appendChild(IA.botaoOuvir(function () { return textoParaOuvir(partida[rodada]); }));
    situacao($("#rodada-situacao"), c);
    var palco = $("#rodada-palco");
    palco.innerHTML = "";
    palco.appendChild(balao(c, false));
    $("#btn-golpe").disabled = false;
    $("#btn-seguro").disabled = false;
    if (rodada > 0) IA.som("rodada");
    IA.mostrarTela("tela-rodada");
  }

  function responder(escolha) {
    if (window.speechSynthesis) try { speechSynthesis.cancel(); } catch (e) {}
    $("#btn-golpe").disabled = true;
    $("#btn-seguro").disabled = true;
    var c = partida[rodada];
    var acertou = escolha === c.resposta;
    if (acertou) acertos++;
    seguidos = acertou ? seguidos + 1 : 0;
    // guarda onde o visitante clicou: o confete sai dali (o botão some ao trocar de tela)
    var alvo = $(escolha === "golpe" ? "#btn-golpe" : "#btn-seguro");
    var r = alvo.getBoundingClientRect();
    mostrarFeedback(c, escolha, acertou, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  $("#btn-golpe").addEventListener("click", function () { responder("golpe"); });
  $("#btn-seguro").addEventListener("click", function () { responder("seguro"); });

  /* =========================================================
     Explicação
     ========================================================= */

  function rotuloResposta(r) { return r === "golpe" ? "🚩 GOLPE" : "✅ SEGURO"; }

  function mostrarFeedback(c, escolha, acertou, ondeClicou) {
    situacao($("#fb-situacao"), c);
    var palco = $("#fb-palco");
    palco.innerHTML = "";
    palco.appendChild(balao(c, true));

    var ehGolpe = c.resposta === "golpe";
    var res = $("#fb-resultado");
    res.className = "feedback " + (acertou ? "certo" : "errado");
    res.innerHTML = "";
    res.appendChild(el("div", { class: "titulo" }, [
      (acertou ? "🎯 Acertou! " : "🤔 Quase! ") + "Era " + rotuloResposta(c.resposta)
    ]));
    res.appendChild(el("div", { class: "voce" }, [
      "Você respondeu " + rotuloResposta(escolha) + "." +
      (!acertou && !ehGolpe ? " Desconfiar é bom — mas esta dava para confiar:" : "")
    ]));

    $("#fb-sinais-tit").textContent = ehGolpe ? "Sinais de golpe:" : "Por que é seguro:";
    var lista = $("#fb-sinais");
    lista.className = "alerta-lista fb-sinais" + (ehGolpe ? "" : " dicas");
    lista.innerHTML = "";
    sinais(c).forEach(function (s) { lista.appendChild(el("li", {}, [s])); });

    var fz = $("#fb-fazer");
    fz.innerHTML = "";
    fz.appendChild(el("strong", {}, ["O que fazer: "]));
    fz.appendChild(document.createTextNode(fazer(c)));

    var ia = $("#fb-ia");
    ia.classList.toggle("oculto", !c.usaIA);
    ia.textContent = c.usaIA ? "🤖 Usa IA: " + c.comoIA : "";

    var ouvir = $("#fb-ouvir");
    ouvir.innerHTML = "";
    ouvir.appendChild(IA.botaoOuvir(function () {
      return paraFala((acertou ? "Acertou! " : "Quase! ") + "Era " + (ehGolpe ? "golpe. " : "seguro. ") +
        sinais(c).join(" ") + " O que fazer: " + fazer(c) + (c.usaIA ? " Usa IA: " + c.comoIA : ""));
    }));

    $("#btn-proxima").textContent = rodada >= partida.length - 1 ? "Ver resultado ▶" : "Próxima ▶";
    IA.mostrarTela("tela-feedback");
    // efeitos depois de trocar de tela (a caixa de feedback já está visível)
    if (!DEBUG) {
      if (acertou) IA.acerto(ondeClicou, { sequencia: seguidos });
      else IA.erro($("#fb-resultado"));
    }
  }

  $("#btn-proxima").addEventListener("click", function () {
    if (window.speechSynthesis) try { speechSynthesis.cancel(); } catch (e) {}
    if (rodada < partida.length - 1) { rodada++; mostrarRodada(); }
    else mostrarResultado();
  });

  /* =========================================================
     Resultado
     ========================================================= */

  function mostrarResultado() {
    var n = partida.length || TOTAL;
    var taxa = acertos / n;
    var faixa = taxa >= 0.8
      ? { titulo: "Olho de águia! 🦅", texto: "Você reconhece os sinais. Agora ensine a regra para alguém da sua família." }
      : taxa >= 0.5
        ? { titulo: "Muito bem! 👏", texto: "Você pegou vários sinais. Com a regra abaixo, fica ainda mais difícil te enganar." }
        : { titulo: "Golpista capricha, né? 🤝", texto: "Até especialista cai. A boa notícia: você não precisa adivinhar — é só seguir a regra abaixo." };

    var placar = $("#res-placar");
    placar.innerHTML = "";
    placar.appendChild(document.createTextNode("Você acertou "));
    placar.appendChild(el("span", { class: "num" }, [String(acertos)]));
    placar.appendChild(document.createTextNode(" de " + n));
    $("#res-titulo").textContent = faixa.titulo;
    $("#res-texto").textContent = faixa.texto;

    var comIA = partida.filter(function (c) { return c.usaIA; }).length;
    $("#res-ia").textContent = comIA
      ? "🤖 " + comIA + (comIA === 1 ? " dessas mensagens usava" : " dessas mensagens usavam") + " IA: voz, rosto e foto podem ser falsos. Por isso, confie na regra, não no ouvido."
      : "";

    if (!DEBUG) IA.contar("detector_concluido");
    IA.mostrarTela("tela-resultado");
    // sempre encorajador: quem foi bem ganha show de fogos, quem não foi ganha um som de etapa
    if (!DEBUG) {
      if (taxa >= 0.8) IA.festa("grande");
      else if (taxa >= 0.5) IA.festa("medio");
      else IA.som("etapa");
    }
  }

  $("#btn-comecar").addEventListener("click", comecar);
  $("#btn-de-novo").addEventListener("click", comecar);
  $("#btn-continuar").addEventListener("click", function () { IA.voltarAoPortal(trilha); });

  /* =========================================================
     Depuração
     ========================================================= */

  function testarSorteio(n) {
    var falhas = [], aparicoes = {}, repetidosNoReplay = 0;
    function checar(p, rot) {
      var ids = p.map(function (c) { return c.id; });
      var ng = p.filter(function (c) { return c.resposta === "golpe"; }).length;
      var erros = [];
      if (p.length !== TOTAL) erros.push("tamanho " + p.length);
      if (ng !== (IA.SIMPLES ? 4 : 7) || p.length - ng !== (IA.SIMPLES ? 2 : 3)) erros.push("golpes/seguros " + ng + "/" + (p.length - ng));
      if (ids.some(function (id, i) { return ids.indexOf(id) !== i; })) erros.push("repetido");
      if (p[0] && p[0].resposta !== "golpe") erros.push("começa com seguro");
      for (var i = 1; i < p.length; i++) {
        if (p[i].resposta === "seguro" && p[i - 1].resposta === "seguro") erros.push("seguros vizinhos");
        if (NIVEL[p[i].dificuldade] < NIVEL[p[i - 1].dificuldade]) erros.push("dificuldade desceu");
      }
      if (IA.SIMPLES && p.some(function (c) { return c.dificuldade === "dificil"; })) erros.push("difícil no modo simples");
      if (erros.length) falhas.push(rot + ": " + erros.join(", ") + " [" + ids.join(" ") + "]");
    }
    for (var k = 0; k < n; k++) {
      vistos = {};
      var p1 = sortearPartida();
      checar(p1, "partida " + k);
      p1.forEach(function (c) { vistos[c.id] = true; aparicoes[c.id] = (aparicoes[c.id] || 0) + 1; });
      var p2 = sortearPartida();
      checar(p2, "replay " + k);
      repetidosNoReplay += p2.filter(function (c) { return p1.indexOf(c) >= 0; }).length;
    }
    vistos = {};
    return {
      modo: IA.SIMPLES ? "simples" : "normal", sorteios: n * 2, falhas: falhas.length, exemplosFalha: falhas.slice(0, 5),
      exemplo: sortearPartida().map(function (c) { return c.resposta[0].toUpperCase() + ":" + c.dificuldade + ":" + c.id; }),
      mediaRepetidosNoJogarDeNovo: +(repetidosNoReplay / n).toFixed(2),
      cenariosQueApareceram: Object.keys(aparicoes).length
    };
  }

  // Joga uma partida inteira clicando nos botões de verdade e registra o que aconteceu
  function autoJogar() {
    var r = { passos: [], erros: [] };
    var ativa = function (id) { return $("#" + id).classList.contains("ativa"); };
    $("#btn-comecar").click();
    if (!ativa("tela-rodada")) r.erros.push("Começar não abriu a rodada");
    var esperado = 0;
    for (var i = 0; i < TOTAL; i++) {
      var c = partida[rodada], escolha = i % 3 === 0 ? "seguro" : "golpe";
      if ($("#rodada-titulo").textContent !== "Mensagem " + (i + 1) + " de " + TOTAL) r.erros.push("título da rodada " + i);
      if (!$("#rodada-palco .balao")) r.erros.push("sem balão na rodada " + i);
      $(escolha === "golpe" ? "#btn-golpe" : "#btn-seguro").click();
      if (escolha === c.resposta) esperado++;
      if (!ativa("tela-feedback")) r.erros.push("feedback não abriu na rodada " + i);
      if ($$("#fb-sinais li").length !== sinais(c).length) r.erros.push("sinais na rodada " + i);
      if (c.usaIA === $("#fb-ia").classList.contains("oculto")) r.erros.push("selo IA na rodada " + i);
      r.passos.push(c.id + " → " + escolha + " (" + (escolha === c.resposta ? "acertou" : "errou") + ")");
      $("#btn-proxima").click();
    }
    if (!ativa("tela-resultado")) r.erros.push("resultado não abriu");
    r.placar = $("#res-placar").textContent;
    if (r.placar !== "Você acertou " + esperado + " de " + TOTAL) r.erros.push("placar diferente do esperado (" + esperado + ")");
    $("#btn-de-novo").click();
    r.jogarDeNovo = ativa("tela-rodada") && $("#rodada-titulo").textContent === "Mensagem 1 de " + TOTAL;
    if (!r.jogarDeNovo) r.erros.push("Jogar de novo não reiniciou");
    r.ok = r.erros.length === 0;
    return r;
  }

  if (DEBUG === "sorteio") {
    document.body.appendChild(el("pre", { id: "resultado-sorteio", style: "white-space:pre-wrap;font-size:14px" },
      [JSON.stringify(testarSorteio(300), null, 2)]));
  } else if (DEBUG === "autoplay") {
    document.body.appendChild(el("pre", { id: "resultado-autoplay", style: "white-space:pre-wrap;font-size:14px" },
      [JSON.stringify(autoJogar(), null, 2)]));
  } else if (DEBUG) {
    // screenshots estáveis: sem animação de entrada das telas
    document.head.appendChild(el("style", {}, [".tela{animation:none!important}"]));
    partida = sortearPartida();
    rodada = 0;
    acertos = 0;
    var alvo = IA.parametro("cenario");
    var escolhido = CENARIOS.filter(function (c) { return c.id === alvo; })[0];
    if (escolhido) {
      partida = [escolhido].concat(partida.filter(function (c) { return c.id !== escolhido.id; })).slice(0, TOTAL);
    }
    if (DEBUG === "rodada") mostrarRodada();
    else if (DEBUG === "feedback") {
      var resp = IA.parametro("resposta") || partida[0].resposta;
      mostrarRodada();
      responder(resp);
    } else if (DEBUG === "resultado") {
      acertos = Math.max(0, Math.min(partida.length, parseInt(IA.parametro("acertos") || "7", 10) || 0));
      mostrarResultado();
    }
    // Selo de QA: altura total do conteúdo. Quiosque em 1366×768 a 100% → janela de 768 px;
    // conteúdo ≤ 768 = sem rolagem.
    setTimeout(function () {
      var altura = document.documentElement.scrollHeight;
      document.body.appendChild(el("div", {
        style: "position:fixed;right:8px;bottom:8px;z-index:9999;padding:2px 10px;border-radius:8px;font:700 14px sans-serif;color:#fff;background:" + (altura > 768 ? "#B3261E" : "#0B7A4B")
      }, ["conteúdo: " + altura + " px " + (altura > 768 ? "(ROLA em 768)" : "(cabe em 768)")]));
    }, 1500);
  }
})();
