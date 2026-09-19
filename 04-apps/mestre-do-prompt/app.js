/*
 * "Mestre do prompt" — monte um pedido bom em 5 cliques (fórmula Saber PEDIR).
 * Fluxo: início → P Papel → E Tarefa → D Contexto → I Formato → pedido montado → resposta ruim × boa
 *        → R Revise (ache o erro plantado) → fim (molde + QR para o celular + Meta AI) → portal.
 *
 * Parâmetros de URL:
 *   ?trilha=produtividade   trilha para onde "Continuar ▶" volta no portal (padrão: produtividade)
 *   ?simples=1              pula o passo Formato (usa o formato da tarefa) e mostra só 4 tarefas do dia a dia
 *
 * Depuração (abre direto numa tela, com escolhas de exemplo; não soma contadores):
 *   ?debug=papel|tarefa|contexto|formato|pedido|resposta|erro|achou|fim [&tarefa=<id>] [&papel=<id>] [&formato=<id>]
 *   "erro" = passo Revise antes de clicar; "achou" = Revise depois de achar o erro.
 *   ?debug=autoplay   percorre o fluxo de todas as tarefas clicando nos botões e mostra as checagens (QA)
 */
(function () {
  "use strict";

  var D = window.MESTRE_PROMPT, el = IA.el, $ = IA.$, $$ = IA.$$;

  var trilha = IA.TRILHAS[IA.parametro("trilha")] ? IA.parametro("trilha") : "produtividade";
  document.body.className = IA.TRILHAS[trilha].classe + (IA.SIMPLES ? " simples" : "");
  IA.topo({ titulo: "Peça melhor para a IA", trilha: trilha });
  IA.autoReset();

  var DEBUG = IA.parametro("debug");
  var LETRAS = [
    { l: "P", rot: "Papel" }, { l: "E", rot: "Tarefa" }, { l: "D", rot: "Contexto" },
    { l: "I", rot: "Formato" }, { l: "R", rot: "Revise" }
  ];
  var TELA_LETRA = { "tela-papel": 0, "tela-tarefa": 1, "tela-contexto": 2, "tela-formato": 3, "tela-pedido": 3.5, "tela-resposta": 3.5, "tela-revise": 4, "tela-fim": 5 };
  // 3.5 = P·E·D·I feitos e R ainda por vir (nenhuma letra "atual")

  var tarefas = IA.SIMPLES
    ? D.tarefasSimples.map(function (id) { return porId(D.tarefas, id); }).filter(Boolean)
    : D.tarefas;

  var estado = novoEstado();
  var concluiu = false;

  function novoEstado() { return { papel: null, tarefa: null, contextos: [], formato: null, erros: 0, achou: false }; }
  function porId(lista, id) { return lista.filter(function (x) { return x.id === id; })[0] || null; }

  /* =========================================================
     Navegação e trilho P·E·D·I·R
     ========================================================= */

  function ir(telaId) {
    var atual = TELA_LETRA[telaId];
    $$("#" + telaId + " .pedir").forEach(function (caixa) {
      caixa.innerHTML = "";
      LETRAS.forEach(function (x, i) {
        var cls = "l c-" + x.l;
        if (x.l === "I" && IA.SIMPLES) cls += " auto";
        if (i < atual) cls += " feito";
        else if (i === atual) cls += " atual";
        caixa.appendChild(el("div", { class: cls, "aria-hidden": "true" }, [el("b", {}, [x.l]), x.l === "I" && IA.SIMPLES ? "Auto" : x.rot]));
      });
    });
    IA.mostrarTela(telaId);
  }

  $$("[data-voltar]").forEach(function (b) {
    b.addEventListener("click", function () {
      var destino = b.getAttribute("data-voltar");
      if (destino === "tela-contexto") mostrarContextos();
      else if (destino === "tela-tarefa") mostrarTarefas();
      else if (destino === "tela-papel") mostrarPapeis();
      else ir(destino);
    });
  });

  /* =========================================================
     Início
     ========================================================= */

  var sigla = $("#inicio-sigla");
  [["P", "Papel"], ["E", "Explique a tarefa"], ["D", "Detalhe o contexto"], ["I", "Indique o formato"], ["R", "Revise"]].forEach(function (x) {
    sigla.appendChild(el("div", { class: "l c-" + x[0] }, [el("b", {}, [x[0]]), x[1]]));
  });

  $("#btn-comecar").addEventListener("click", function () {
    estado = novoEstado();
    concluiu = false;
    if (!DEBUG) IA.contar("mestre_iniciado");
    mostrarPapeis();
  });

  /* =========================================================
     P — Papel
     ========================================================= */

  function mostrarPapeis() {
    var caixa = $("#lista-papeis");
    caixa.innerHTML = "";
    D.papeis.forEach(function (p) {
      caixa.appendChild(el("button", {
        class: "opcao" + (estado.papel === p ? " marcado" : ""), type: "button",
        onclick: function () { estado.papel = p; mostrarTarefas(); }
      }, [el("span", { class: "ic", "aria-hidden": "true" }, [p.icone]), el("span", {}, [p.rotulo])]));
    });
    ir("tela-papel");
  }

  /* =========================================================
     E — Tarefa
     ========================================================= */

  function mostrarTarefas() {
    var caixa = $("#lista-tarefas");
    caixa.className = "opcoes " + (tarefas.length <= 4 ? "g2" : "g4");
    caixa.innerHTML = "";
    tarefas.forEach(function (t) {
      caixa.appendChild(el("button", {
        class: "opcao vertical" + (estado.tarefa === t ? " marcado" : ""), type: "button",
        onclick: function () { escolherTarefa(t); }
      }, [el("span", { class: "ic", "aria-hidden": "true" }, [t.icone]), el("span", {}, [t.titulo])]));
    });
    ir("tela-tarefa");
  }

  function escolherTarefa(t) {
    if (estado.tarefa !== t) {
      estado.tarefa = t;
      estado.contextos = t.contextos.filter(function (c) { return c.essencial; }).map(function (c) { return c.id; });
      estado.formato = null;
    }
    mostrarContextos();
  }

  /* =========================================================
     D — Contexto (pode marcar vários; o essencial já vem marcado)
     ========================================================= */

  function mostrarContextos() {
    var t = estado.tarefa;
    $("#contexto-recap").textContent = "Sua tarefa: " + t.icone + " " + t.titulo;
    var temEssencial = t.contextos.some(function (c) { return c.essencial; });
    $("#contexto-instrucao").textContent = temEssencial
      ? "O 📌 já vem marcado: é a informação principal. Toque em mais detalhes que a IA precisa saber."
      : "Toque nos detalhes que a IA precisa saber. Pode escolher mais de um.";
    desenharContextos();
    ir("tela-contexto");
  }

  function desenharContextos() {
    var t = estado.tarefa, caixa = $("#lista-contextos");
    caixa.innerHTML = "";
    t.contextos.forEach(function (c) {
      var marcado = estado.contextos.indexOf(c.id) >= 0;
      caixa.appendChild(el("button", {
        class: "opcao" + (marcado ? " marcado" : ""), type: "button", "aria-pressed": marcado ? "true" : "false",
        onclick: function () { alternarContexto(c); }
      }, [
        el("span", { class: "ic", "aria-hidden": "true" }, [c.icone]),
        el("span", {}, [c.rotulo]),
        el("span", { class: "marca" }, [c.essencial ? "📌 essencial" : (marcado ? "✓ marcado" : "+ marcar")])
      ]));
    });
    $("#btn-contexto-pronto").disabled = estado.contextos.length === 0;
  }

  function alternarContexto(c) {
    if (c.essencial) { IA.toast("📌 Este detalhe é essencial: fica marcado."); return; }
    var i = estado.contextos.indexOf(c.id);
    if (i >= 0) estado.contextos.splice(i, 1);
    else estado.contextos.push(c.id);
    desenharContextos();
  }

  $("#btn-contexto-pronto").addEventListener("click", function () {
    if (!estado.contextos.length) return;
    if (IA.SIMPLES) { estado.formato = porId(D.formatos, estado.tarefa.formatoPadrao); mostrarPedido(); }
    else mostrarFormatos();
  });

  /* =========================================================
     I — Formato
     ========================================================= */

  function mostrarFormatos() {
    var caixa = $("#lista-formatos");
    caixa.innerHTML = "";
    D.formatos.forEach(function (f) {
      var recomendado = f.id === estado.tarefa.formatoPadrao;
      caixa.appendChild(el("button", {
        class: "opcao" + (estado.formato === f ? " marcado" : ""), type: "button",
        onclick: function () { estado.formato = f; mostrarPedido(); }
      }, [
        el("span", { class: "ic", "aria-hidden": "true" }, [f.icone]),
        el("span", {}, [f.rotulo]),
        recomendado ? el("span", { class: "rec" }, ["⭐ combina"]) : null
      ]));
    });
    ir("tela-formato");
  }

  /* =========================================================
     Pedido montado (P·E·D·I coloridos e rotulados)
     ========================================================= */

  function contextosEscolhidos() {
    var t = estado.tarefa;
    return t.contextos.filter(function (c) { return estado.contextos.indexOf(c.id) >= 0; });
  }

  // Conectores fixos: gramatical em qualquer combinação
  function partesDoPedido() {
    return [
      { l: "P", rot: "Papel",    txt: "Você é " + estado.papel.texto + "." },
      { l: "E", rot: "Tarefa",   txt: estado.tarefa.verbo + "." },
      { l: "D", rot: "Contexto", txt: "Contexto: " + contextosEscolhidos().map(function (c) { return c.texto; }).join("; ") + "." },
      { l: "I", rot: "Formato",  txt: "Entregue como " + estado.formato.texto + "." }
    ];
  }

  function mostrarPedido() {
    var caixa = $("#pedido-montado");
    caixa.innerHTML = "";
    partesDoPedido().forEach(function (p) {
      caixa.appendChild(el("div", { class: "parte c-" + p.l }, [
        el("div", { class: "badge" }, [el("b", {}, [p.l]), el("small", {}, [p.rot])]),
        el("div", { class: "txt" }, [p.txt, p.l === "I" && IA.SIMPLES ? el("span", { class: "auto" }, [" (escolhido para você)"]) : null])
      ]));
    });

    var t = estado.tarefa, fonte = $("#pedido-fonte");
    fonte.innerHTML = "";
    fonte.classList.toggle("oculto", !t.fonte);
    if (t.fonte) {
      fonte.appendChild(el("strong", {}, ["📎 " + t.fonte.titulo + ": "]));
      fonte.appendChild(document.createTextNode(t.fonte.texto));
    }

    var dica = $("#pedido-dica");
    var combina = (t.papeis || []).indexOf(estado.papel.id) >= 0;
    var sugerido = porId(D.papeis, (t.papeis || [])[0]);
    dica.classList.toggle("oculto", combina || !sugerido);
    dica.textContent = !combina && sugerido
      ? "💡 Dica: para esta tarefa, o papel “" + sugerido.rotulo + "” combinaria ainda mais. Tudo bem — a IA faz assim mesmo."
      : "";
    ir("tela-pedido");
  }

  $("#btn-pedido-voltar").addEventListener("click", function () {
    if (IA.SIMPLES) mostrarContextos(); else mostrarFormatos();
  });
  $("#btn-ver-resposta").addEventListener("click", mostrarResposta);

  /* =========================================================
     Resposta: pedido ruim × pedido bom
     ========================================================= */

  function preencherComQuebras(alvo, t) {
    alvo.innerHTML = "";
    t.respostaBoa.forEach(function (x, i) {
      if (i > 0) alvo.appendChild(x.novaLinha ? el("br") : document.createTextNode(" "));
      alvo.appendChild(document.createTextNode(x.texto));
    });
  }

  function mostrarResposta() {
    var t = estado.tarefa;
    $("#resp-ruim-pedido").textContent = "“" + t.pedidoRuim + "”";
    $("#resp-ruim").textContent = t.respostaRuim;

    var partes = $("#resp-bom-partes");
    partes.innerHTML = "";
    partesDoPedido().forEach(function (p) { partes.appendChild(el("span", { class: "c-" + p.l }, [p.l + " · " + p.rot])); });
    preencherComQuebras($("#resp-bom"), t);

    var nota = $("#resp-nota");
    var padrao = porId(D.formatos, t.formatoPadrao);
    var diferente = estado.formato && padrao && estado.formato.id !== padrao.id;
    nota.classList.toggle("oculto", !diferente);
    nota.textContent = diferente
      ? "ℹ️ Você pediu “" + estado.formato.rotulo + "”; este exemplo veio como “" + padrao.rotulo + "”. Numa IA de verdade, o formato mudaria."
      : "";
    ir("tela-resposta");
  }

  $("#btn-revisar").addEventListener("click", mostrarRevise);

  /* =========================================================
     R — Revise: ache o erro plantado
     ========================================================= */

  function status(msg, tipo) {
    var s = $("#revise-status");
    s.className = "status" + (tipo ? " " + tipo : "");
    s.textContent = msg;
  }

  function referencia() {
    var t = estado.tarefa;
    if (t.fonte) {
      return el("div", { class: "referencia" }, [
        el("div", { class: "tit" }, ["📎 Texto original"]),
        el("div", {}, [t.fonte.texto])
      ]);
    }
    return el("div", { class: "referencia" }, [
      el("div", { class: "tit" }, ["📋 O que você disse no pedido"]),
      el("ul", {}, contextosEscolhidos().map(function (c) {
        return el("li", {}, [c.essencial ? el("strong", {}, [c.texto]) : c.texto]);
      }))
    ]);
  }

  function mostrarRevise() {
    var t = estado.tarefa;
    estado.erros = 0;
    estado.achou = false;
    status("Toque no pedaço da resposta que não bate com " + (t.fonte ? "o texto original." : "o que você disse no pedido."));

    var esquerda = $("#revise-esquerda");
    esquerda.className = "";
    esquerda.innerHTML = "";
    esquerda.appendChild(referencia());
    $("#revise-acoes").classList.add("oculto");

    var caixa = $("#revise-trechos");
    caixa.innerHTML = "";
    t.respostaBoa.forEach(function (x, i) {
      if (i > 0) caixa.appendChild(x.novaLinha ? el("br") : document.createTextNode(" "));
      var span = el("span", { class: "trecho", role: "button", tabindex: "0", "data-i": String(i) }, [x.texto]);
      span.addEventListener("click", function () { clicarTrecho(x, span); });
      caixa.appendChild(span);
    });
    ir("tela-revise");
  }

  function spanErrado() {
    var idx = estado.tarefa.respostaBoa.map(function (x) { return !!x.errado; }).indexOf(true);
    return $('#revise-trechos .trecho[data-i="' + idx + '"]');
  }

  function clicarTrecho(x, span) {
    if (estado.achou) return;
    if (x.errado) { achouErro(span); return; }
    if (span.classList.contains("conferido")) {
      status("Esse você já conferiu: está certo. Tente outro pedaço.", "errado");
      return;
    }
    span.classList.add("conferido");
    estado.erros++;
    if (estado.erros >= 2) {
      var alvo = spanErrado();
      if (alvo) alvo.classList.add("dica");
      status("💡 Dica: o erro está no pedaço piscando em amarelo. Compare os números com " + (estado.tarefa.fonte ? "o texto original" : "o seu pedido") + " e toque nele.", "errado");
    } else {
      status("🤔 Esse pedaço está certo. Procure um número, nome, dia ou horário que não bate.", "errado");
    }
  }

  function achouErro(span) {
    var x = estado.tarefa.respostaBoa.filter(function (y) { return y.errado; })[0];
    estado.achou = true;
    span.classList.remove("dica");
    span.classList.add("achado");
    var semDica = estado.erros < 2;
    status(semDica ? "🎯 Achou! Esse pedaço está errado." : "🎯 Isso! Esse é o pedaço errado.", "certo");
    if (semDica && !DEBUG) IA.festa();

    var esquerda = $("#revise-esquerda");
    esquerda.className = "achou";
    esquerda.innerHTML = "";
    esquerda.appendChild(el("div", { class: "feedback certo" }, [
      el("div", { class: "titulo" }, ["Por que está errado"]),
      el("p", {}, [x.explicacao])
    ]));
    esquerda.appendChild(el("div", { class: "regra-r c-R" }, ["A IA inventa com confiança: confira nome, número e data."]));

    var acoes = $("#revise-acoes");
    acoes.innerHTML = "";
    acoes.appendChild(IA.botaoOuvir(function () { return x.explicacao + " A IA inventa com confiança: confira nome, número e data."; }));
    acoes.appendChild(el("button", { class: "btn destaque grande", type: "button", onclick: mostrarFim }, ["Continuar ▶"]));
    acoes.classList.remove("oculto");
  }

  /* =========================================================
     Fim
     ========================================================= */

  function mostrarFim() {
    var caixa = $("#fim-qr");
    caixa.innerHTML = "";
    var chat = porId(window.FERRAMENTAS || [], "chatgpt-sem-login");
    // sem a descrição longa do catálogo, para a tela caber sem rolagem
    if (chat) caixa.appendChild(IA.qrCelular(Object.assign({}, chat, { descricao: "" }), { titulo: "📱 Faça no seu celular: " + chat.nome, tamanho: 130 }));
    if (!concluiu && !DEBUG) { IA.contar("mestre_concluido"); concluiu = true; }
    ir("tela-fim");
  }

  $("#btn-outro").addEventListener("click", function () {
    var papel = estado.papel;
    estado = novoEstado();
    estado.papel = papel;
    mostrarTarefas();
  });
  $("#btn-continuar").addEventListener("click", function () { IA.voltarAoPortal(trilha); });

  /* =========================================================
     Depuração
     ========================================================= */

  // Percorre o fluxo inteiro clicando nos botões de verdade (1 tarefa) e registra o que aconteceu
  function autoMontar(tarefaId) {
    var r = { tarefa: tarefaId, erros: [] };
    var ativa = function (id) { return $("#" + id).classList.contains("ativa"); };
    var t = porId(tarefas, tarefaId);
    $("#btn-comecar").click();
    if (!ativa("tela-papel") || $$("#lista-papeis .opcao").length !== D.papeis.length) r.erros.push("papéis");
    $$("#lista-papeis .opcao")[0].click();
    if (!ativa("tela-tarefa") || $$("#lista-tarefas .opcao").length !== tarefas.length) r.erros.push("tarefas");
    $$("#lista-tarefas .opcao")[tarefas.indexOf(t)].click();
    if (!ativa("tela-contexto")) r.erros.push("contexto não abriu");
    var chips = $$("#lista-contextos .opcao");
    var essenciais = t.contextos.filter(function (c) { return c.essencial; }).length;
    r.marcadosNoInicio = $$("#lista-contextos .opcao.marcado").length;
    if (r.marcadosNoInicio !== essenciais) r.erros.push("essencial não veio marcado");
    if (!essenciais && !$("#btn-contexto-pronto").disabled) r.erros.push("Pronto habilitado sem contexto");
    var idxOpcional = t.contextos.map(function (c) { return !c.essencial; }).indexOf(true);
    chips[idxOpcional].click();
    if (!$$("#lista-contextos .opcao")[idxOpcional].classList.contains("marcado")) r.erros.push("chip opcional não marcou");
    if (essenciais) {
      var idxEss = t.contextos.map(function (c) { return !!c.essencial; }).indexOf(true);
      $$("#lista-contextos .opcao")[idxEss].click();
      if (!$$("#lista-contextos .opcao")[idxEss].classList.contains("marcado")) r.erros.push("essencial desmarcou");
    }
    $("#btn-contexto-pronto").click();
    if (IA.SIMPLES) {
      if (!ativa("tela-pedido")) r.erros.push("modo simples não pulou o formato");
    } else {
      if (!ativa("tela-formato") || $$("#lista-formatos .opcao").length !== D.formatos.length) r.erros.push("formatos");
      $$("#lista-formatos .opcao")[0].click();
    }
    if (!ativa("tela-pedido") || $$("#pedido-montado .parte").length !== 4) r.erros.push("pedido montado");
    r.pedido = $$("#pedido-montado .parte .txt").map(function (x) { return x.textContent; }).join(" ");
    $("#btn-ver-resposta").click();
    if (!ativa("tela-resposta") || !$("#resp-bom").textContent || !$("#resp-ruim").textContent) r.erros.push("comparação");
    $("#btn-revisar").click();
    if (!ativa("tela-revise")) r.erros.push("revise não abriu");
    var spans = $$("#revise-trechos .trecho");
    var certos = spans.filter(function (s) { return !t.respostaBoa[+s.getAttribute("data-i")].errado; });
    certos[0].click();
    if ($(".trecho.dica")) r.erros.push("dica cedo demais");
    certos[1].click();
    if (!$(".trecho.dica")) r.erros.push("dica não apareceu após 2 erros");
    $(".trecho.dica").click();
    if (!$(".trecho.achado") || $("#revise-acoes").classList.contains("oculto")) r.erros.push("achou/explicação");
    r.explicacao = ($("#revise-esquerda .feedback p") || {}).textContent;
    $("#revise-acoes .btn.destaque").click();
    if (!ativa("tela-fim") || !$("#fim-qr svg")) r.erros.push("fim sem QR");
    r.ok = r.erros.length === 0;
    return r;
  }

  if (DEBUG === "autoplay") {
    var resultados = tarefas.map(function (t) {
      try { return autoMontar(t.id); } catch (e) { return { tarefa: t.id, ok: false, erros: [String(e)] }; }
    });
    document.body.appendChild(el("pre", { id: "resultado-autoplay", style: "white-space:pre-wrap;font-size:14px" },
      [JSON.stringify({ modo: IA.SIMPLES ? "simples" : "normal", tudoOk: resultados.every(function (x) { return x.ok; }), resultados: resultados }, null, 2)]));
  } else if (DEBUG) {
    // screenshots estáveis: sem animação de entrada das telas
    document.head.appendChild(el("style", {}, [".tela{animation:none!important}"]));
    var tDebug = porId(tarefas, IA.parametro("tarefa")) || tarefas[0];
    estado.papel = porId(D.papeis, IA.parametro("papel")) || porId(D.papeis, (tDebug.papeis || [])[0]) || D.papeis[0];
    estado.tarefa = tDebug;
    estado.contextos = tDebug.contextos.map(function (c) { return c.id; });
    estado.formato = porId(D.formatos, IA.parametro("formato")) || porId(D.formatos, tDebug.formatoPadrao);
    var acoes = {
      papel: mostrarPapeis, tarefa: mostrarTarefas, contexto: mostrarContextos, formato: mostrarFormatos,
      pedido: mostrarPedido, resposta: mostrarResposta, erro: mostrarRevise,
      achou: function () { mostrarRevise(); var s = spanErrado(); if (s) achouErro(s); },
      fim: mostrarFim
    };
    if (acoes[DEBUG]) acoes[DEBUG]();
    // Selo de QA: altura total do conteúdo. Quiosque em 1366×768 a 100% → janela de 768 px.
    setTimeout(function () {
      var altura = document.documentElement.scrollHeight;
      document.body.appendChild(el("div", {
        style: "position:fixed;right:8px;bottom:8px;z-index:9999;padding:2px 10px;border-radius:8px;font:700 14px sans-serif;color:#fff;background:" + (altura > 768 ? "#B3261E" : "#0B7A4B")
      }, ["conteúdo: " + altura + " px " + (altura > 768 ? "(ROLA em 768)" : "(cabe em 768)")]));
    }, 1500);
  }
})();
