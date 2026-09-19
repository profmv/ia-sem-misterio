(function () {
  "use strict";

  var D = window.PROXIMA_PALAVRA, el = IA.el, $ = IA.$;

  // Trilha que recebe o carimbo (o portal pode mandar ?trilha=...)
  var trilha = IA.TRILHAS[IA.parametro("trilha")] ? IA.parametro("trilha") : "incriveis";
  document.body.className = IA.TRILHAS[trilha].classe + (IA.SIMPLES ? " simples" : "");
  IA.topo({ titulo: "Próxima Palavra", trilha: trilha });
  // ?palco=1 (PC do instrutor, show 4): não reinicia sozinho quando fica parado
  if (IA.parametro("palco") !== "1") IA.autoReset();
  IA.contar("proxima-palavra_iniciado");
  // Modo simples: só 2 rodadas de adivinhação (a fácil e a difícil)
  if (IA.SIMPLES) D.adivinhe = [D.adivinhe[0], D.adivinhe[D.adivinhe.length - 1]];

  var NOMES_PROPRIOS = { londrina: "Londrina", "igapó": "Igapó", whatsapp: "WhatsApp", pix: "Pix" };
  function bonita(w) { return NOMES_PROPRIOS[w] || w; }
  function pct(p) { return Math.round(p * 100) + "%"; }
  function rotulo(palavra) { return palavra === "." ? "⏹ fim da frase" : bonita(palavra); }

  // Linha de opção com barra de probabilidade
  function linhaOpcao(palavra, p, aoClicar, opcoes) {
    opcoes = opcoes || {};
    var enche = el("div", { class: "enche" });
    var b = el("button", {
      class: "opcao" + (opcoes.semBarra ? " sem-barra" : "") + (opcoes.melhor ? " melhor" : ""),
      type: "button", onclick: aoClicar, disabled: !aoClicar
    }, [
      el("span", {}, [rotulo(palavra)]),
      el("div", { class: "trilho" }, [enche]),
      el("span", { class: "pct" }, [pct(p)])
    ]);
    requestAnimationFrame(function () { requestAnimationFrame(function () { enche.style.width = Math.max(1, p * 100) + "%"; }); });
    return b;
  }

  /* =========================================================
     1 → 2. Você é a IA
     ========================================================= */

  var rodada = 0;

  $("#btn-comecar").addEventListener("click", function () { rodada = 0; mostrarRodada(); IA.mostrarTela("tela-adivinhe"); });

  function mostrarRodada() {
    var r = D.adivinhe[rodada];
    $("#rodada-num").textContent = rodada + 1;
    $("#progresso-adivinhe").innerHTML = "";
    D.adivinhe.forEach(function (_, i) { $("#progresso-adivinhe").appendChild(el("span", { class: i <= rodada ? "feito" : "" })); });

    var partes = r.frase.split("___");
    var frase = $("#frase-adivinhe");
    frase.innerHTML = "";
    frase.appendChild(document.createTextNode(partes[0]));
    frase.appendChild(el("span", { class: "lacuna", id: "lacuna" }, ["?"]));
    frase.appendChild(document.createTextNode(partes[1] || ""));

    $("#comentario-adivinhe").classList.add("oculto");
    $("#btn-proxima-rodada").classList.add("oculto");

    var total = r.opcoes.reduce(function (s, o) { return s + o[1]; }, 0);
    var caixa = $("#opcoes-adivinhe");
    caixa.innerHTML = "";
    IA.embaralhar(r.opcoes).forEach(function (o) {
      caixa.appendChild(linhaOpcao(o[0], o[1] / total, function () { revelar(o[0]); }, { semBarra: true }));
    });
  }

  function revelar(escolha) {
    var r = D.adivinhe[rodada];
    var total = r.opcoes.reduce(function (s, o) { return s + o[1]; }, 0);
    var ordenadas = r.opcoes.slice().sort(function (a, b) { return b[1] - a[1]; });
    var melhor = ordenadas[0][0];

    $("#lacuna").textContent = escolha;
    var caixa = $("#opcoes-adivinhe");
    caixa.innerHTML = "";
    ordenadas.forEach(function (o) {
      var linha = linhaOpcao(o[0], o[1] / total, null, { melhor: o[0] === melhor });
      if (o[0] === escolha) linha.classList.add("escolhida");
      caixa.appendChild(linha);
    });

    var acertou = escolha === melhor;
    var fb = $("#comentario-adivinhe");
    fb.className = "feedback " + (acertou ? "certo" : "errado");
    fb.innerHTML = "";
    fb.appendChild(el("div", { class: "titulo" }, [acertou ? "✅ Igualzinho à IA!" : "🤔 A mais provável era “" + melhor + "”"]));
    fb.appendChild(el("p", { style: "margin:0" }, [r.comentario]));
    // errar aqui não é falha: só um "quase", sem efeito punitivo
    if (acertou) IA.acerto(fb); else IA.som("quase");

    var ultima = rodada === D.adivinhe.length - 1;
    $("#btn-proxima-rodada").textContent = ultima ? "Ver a máquina escrevendo ▶" : "Próxima ▶";
    $("#btn-proxima-rodada").classList.remove("oculto");
  }

  $("#btn-proxima-rodada").addEventListener("click", function () {
    if (rodada < D.adivinhe.length - 1) { rodada++; mostrarRodada(); }
    else { iniciarMaquina(D.comecos[0]); IA.mostrarTela("tela-maquina"); }
  });

  /* =========================================================
     3. Modelo de brinquedo (trigramas + bigramas do corpus)
     ========================================================= */

  var tri = {}, bi = {}, uni = {};
  D.corpus.forEach(function (f) {
    var t = f.trim().toLowerCase().split(/\s+/).concat(["."]);
    for (var i = 0; i < t.length; i++) {
      uni[t[i]] = (uni[t[i]] || 0) + 1;
      if (i >= 1) { bi[t[i - 1]] = bi[t[i - 1]] || {}; bi[t[i - 1]][t[i]] = (bi[t[i - 1]][t[i]] || 0) + 1; }
      if (i >= 2) { var k = t[i - 2] + " " + t[i - 1]; tri[k] = tri[k] || {}; tri[k][t[i]] = (tri[k][t[i]] || 0) + 1; }
    }
  });
  $("#n-frases").textContent = D.corpus.length;

  function normalizar(contagens) {
    var total = 0, r = {};
    Object.keys(contagens).forEach(function (w) { total += contagens[w]; });
    Object.keys(contagens).forEach(function (w) { r[w] = contagens[w] / total; });
    return r;
  }

  function distribuicao(palavras) {
    var n = palavras.length, d = {};
    var b = n >= 1 && bi[palavras[n - 1]] ? normalizar(bi[palavras[n - 1]]) : null;
    var t = n >= 2 && tri[palavras[n - 2] + " " + palavras[n - 1]] ? normalizar(tri[palavras[n - 2] + " " + palavras[n - 1]]) : null;
    if (t && b) {
      Object.keys(t).forEach(function (w) { d[w] = (d[w] || 0) + 0.8 * t[w]; });
      Object.keys(b).forEach(function (w) { d[w] = (d[w] || 0) + 0.2 * b[w]; });
    } else if (t || b) {
      d = t || b;
    } else {
      var semPonto = {};
      Object.keys(uni).forEach(function (w) { if (w !== ".") semPonto[w] = uni[w]; });
      d = normalizar(semPonto);
    }
    return Object.keys(d).map(function (w) { return { palavra: w, p: d[w] }; })
      .sort(function (a, c) { return c.p - a.p; });
  }

  function comTemperatura(lista, T) {
    var soma = 0;
    var pesos = lista.map(function (o) { var w = Math.pow(o.p, 1 / T); soma += w; return w; });
    return lista.map(function (o, i) { return { palavra: o.palavra, p: pesos[i] / soma }; })
      .sort(function (a, c) { return c.p - a.p; });
  }

  function sortear(lista) {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < lista.length; i++) { acc += lista[i].p; if (r <= acc) return lista[i].palavra; }
    return lista[lista.length - 1].palavra;
  }

  /* ---------- Interface da máquina ---------- */

  var palavras = [], terminou = false, autoTimer = null;
  var MAX_PALAVRAS = 18;

  D.comecos.forEach(function (c) {
    $("#comecos").appendChild(el("button", {
      class: "chip", type: "button", "data-comeco": c,
      onclick: function () { iniciarMaquina(c); }
    }, [c + "…"]));
  });

  function temperatura() { return parseFloat($("#temperatura").value); }

  function explicarTemperatura() {
    var T = temperatura();
    $("#explica-temperatura").textContent =
      T <= 0.4 ? "Nível: CERTINHA — quase sempre a palavra mais provável. Frases seguras, mas repetitivas." :
      T <= 1.2 ? "Nível: EQUILÍBRIO — às vezes surpreende, quase sempre faz sentido." :
                 "Nível: MALUCA — arrisca palavras raras e começa a falar bobagem.";
  }

  function iniciarMaquina(comeco) {
    clearInterval(autoTimer);
    palavras = comeco.split(" ");
    terminou = false;
    IA.$$("#comecos .chip").forEach(function (b) { b.classList.toggle("ativo", b.getAttribute("data-comeco") === comeco); });
    desenharMaquina(false);
  }

  function desenharMaquina(destacarUltima) {
    var caixa = $("#texto-gerado");
    caixa.innerHTML = "";
    palavras.forEach(function (w, i) {
      if (w === ".") return;
      if (i > 0) caixa.appendChild(document.createTextNode(" "));
      var txt = bonita(w);
      if (i === 0) txt = txt.charAt(0).toUpperCase() + txt.slice(1);
      caixa.appendChild(el("span", { class: destacarUltima && i === palavras.length - 1 ? "nova" : "" }, [txt]));
    });
    if (terminou) caixa.appendChild(document.createTextNode("."));
    else caixa.appendChild(el("span", { class: "cursor" }));

    var opcoes = $("#opcoes-maquina");
    opcoes.innerHTML = "";
    if (terminou) {
      opcoes.appendChild(el("div", { class: "feedback certo" }, [
        el("div", { class: "titulo" }, ["Frase pronta!"]),
        el("p", { style: "margin:0" }, ["Escolha outro começo, mude a criatividade ou toque em Recomeçar."])
      ]));
    } else {
      var lista = comTemperatura(distribuicao(palavras), temperatura()).slice(0, 6);
      lista.forEach(function (o, i) {
        opcoes.appendChild(linhaOpcao(o.palavra, o.p, function () { adicionar(o.palavra); }, { melhor: i === 0 }));
      });
    }
    $("#btn-ia-escolhe").disabled = terminou;
    $("#btn-completar").disabled = terminou;
    explicarTemperatura();
  }

  function adicionar(palavra) {
    if (terminou) return;
    palavras.push(palavra);
    if (palavra === "." || palavras.length >= MAX_PALAVRAS) terminou = true;
    desenharMaquina(true);
  }

  function iaEscolhe() {
    var lista = comTemperatura(distribuicao(palavras), temperatura());
    adicionar(sortear(lista));
  }

  $("#btn-ia-escolhe").addEventListener("click", iaEscolhe);
  $("#btn-completar").addEventListener("click", function () {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      if (terminou) { clearInterval(autoTimer); return; }
      iaEscolhe();
    }, 550);
  });
  $("#btn-recomecar").addEventListener("click", function () {
    var ativo = IA.$("#comecos .chip.ativo");
    iniciarMaquina(ativo ? ativo.getAttribute("data-comeco") : D.comecos[0]);
  });
  // alterna Ouvir/Parar: o segundo clique cala a voz (IA.ligarOuvir cuida do rótulo)
  IA.ligarOuvir($("#btn-ouvir"), function () {
    return palavras.filter(function (w) { return w !== "."; }).map(bonita).join(" ");
  });
  $("#temperatura").addEventListener("input", function () { if (!terminou) desenharMaquina(false); else explicarTemperatura(); });

  /* =========================================================
     4. A IA inventa (alucinação)
     ========================================================= */

  var passo = 0, frasesInvencao = [];

  $("#btn-ir-invencao").addEventListener("click", function () {
    clearInterval(autoTimer);
    passo = 0;
    frasesInvencao = [];
    $("#revelacao").classList.add("oculto");
    $("#acoes-invencao").classList.add("oculto");
    desenharInvencao();
    IA.mostrarTela("tela-invencao");
  });

  function textoInvencao() {
    var s = D.invencao.frase;
    frasesInvencao.forEach(function (w) { s += (w === "." || w === "," ? "" : " ") + w; });
    return s;
  }

  function desenharInvencao() {
    var caixa = $("#texto-invencao");
    caixa.innerHTML = "";
    caixa.appendChild(document.createTextNode(D.invencao.frase));
    frasesInvencao.forEach(function (w, i) {
      if (w !== "." && w !== ",") caixa.appendChild(document.createTextNode(" "));
      caixa.appendChild(el("span", { class: i === frasesInvencao.length - 1 ? "nova" : "" }, [w]));
    });
    var acabou = passo >= D.invencao.passos.length;
    if (!acabou) caixa.appendChild(el("span", { class: "cursor" }));

    var opcoes = $("#opcoes-invencao");
    opcoes.innerHTML = "";
    $("#btn-proxima-palavra").classList.add("oculto");

    if (acabou) {
      $("#instrucao-invencao").textContent = "";
      $("#revelacao-texto").textContent = D.invencao.revelacao;
      $("#revelacao-nota").textContent = D.invencao.nota;
      $("#revelacao").classList.remove("oculto");
      $("#acoes-invencao").classList.remove("oculto");
      IA.falar(textoInvencao());
      return;
    }

    var lista = D.invencao.passos[passo];
    var total = lista.reduce(function (s, o) { return s + o[1]; }, 0);
    if (passo === 0) {
      $("#instrucao-invencao").textContent = "Escolha o nome que a IA vai usar:";
      lista.forEach(function (o, i) {
        opcoes.appendChild(linhaOpcao(o[0], o[1] / total, function () { frasesInvencao.push(o[0]); passo++; desenharInvencao(); }, { melhor: i === 0 }));
      });
    } else {
      $("#instrucao-invencao").textContent = "A IA escolhe a palavra mais provável (amarela):";
      lista.forEach(function (o, i) { opcoes.appendChild(linhaOpcao(o[0], o[1] / total, null, { melhor: i === 0 })); });
      $("#btn-proxima-palavra").classList.remove("oculto");
    }
  }

  $("#btn-proxima-palavra").addEventListener("click", function () {
    var lista = D.invencao.passos[passo];
    frasesInvencao.push(lista[0][0]);
    passo++;
    desenharInvencao();
  });

  /* =========================================================
     5. Fim
     ========================================================= */

  $("#btn-ir-fim").addEventListener("click", function () { IA.mostrarTela("tela-fim"); IA.festa("medio"); IA.contar("proxima-palavra_concluido"); });
  $("#btn-carimbo").addEventListener("click", function () { IA.voltarAoPortal(trilha); });
})();
