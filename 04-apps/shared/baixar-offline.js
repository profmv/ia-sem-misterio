/*
 * Botão discreto (canto inferior direito) para baixar o site inteiro e usar neste computador, sem internet.
 * O ZIP (IA-sem-Misterio-offline.zip) é gerado por _trabalho/ferramentas/montar_site.py e fica na raiz do site publicado.
 * Só aparece no site publicado (http/https); rodando do disco (file://) já é a versão local, então não faz nada.
 * Uso: <script src=".../shared/baixar-offline.js"></script> (o ZIP é achado relativo a este arquivo).
 */
(function () {
  "use strict";
  if (location.protocol === "file:") return;

  var atual = document.currentScript;
  if (!atual || !atual.src) return;
  var zip = new URL("../../IA-sem-Misterio-offline.zip", atual.src).href;

  function montar() {
    var st = document.createElement("style");
    st.textContent =
      ".offline-baixar{position:fixed;right:10px;bottom:10px;z-index:50;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
      "color:#14161A;background:transparent;opacity:.16;transition:opacity .15s,background .15s;text-decoration:none}" +
      ".offline-baixar:hover,.offline-baixar:focus-visible{opacity:1;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.25);outline:2px solid #14161A}" +
      ".offline-baixar svg{width:17px;height:17px}" +
      ".offline-aviso{position:fixed;right:10px;bottom:48px;z-index:50;max-width:260px;background:#14161A;color:#fff;font:14px/1.35 'Segoe UI',system-ui,sans-serif;" +
      "padding:10px 12px;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.35)}" +
      "@media print{.offline-baixar,.offline-aviso{display:none}}";
    document.head.appendChild(st);

    var a = document.createElement("a");
    a.className = "offline-baixar";
    a.href = zip;
    a.setAttribute("download", "IA-sem-Misterio-offline.zip");
    a.setAttribute("title", "Baixar o site inteiro para usar neste computador (sem internet)");
    a.setAttribute("aria-label", "Baixar o site inteiro para usar neste computador (sem internet)");
    a.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>';

    a.addEventListener("click", function () {
      var aviso = document.createElement("div");
      aviso.className = "offline-aviso";
      aviso.setAttribute("role", "status");
      aviso.textContent = "Baixando o site. Extraia o ZIP e dê duplo clique em ABRIR-SITE.bat (ou abra o index.html no navegador).";
      document.body.appendChild(aviso);
      setTimeout(function () { aviso.remove(); }, 9000);
    });
    document.body.appendChild(a);
  }

  if (document.body) montar(); else document.addEventListener("DOMContentLoaded", montar);
})();
