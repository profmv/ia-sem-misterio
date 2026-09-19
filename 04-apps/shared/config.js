/*
 * CONFIGURAÇÃO DO EVENTO — edite SÓ este arquivo para personalizar todos os apps.
 * Abra no Bloco de Notas, troque os textos entre aspas e salve.
 * Campos vazios ("") simplesmente não aparecem nas telas.
 */
window.EVENTO = {
  nomeOficina: "IA sem Mistério",
  slogan: "Crie com IA. Trabalhe melhor. Não caia em golpe.",
  data: "Sábado, 19/09/2026",
  local: "Carreta da Inovação — Centro de Londrina",
  horarioAtendimento: "10h às 12h30",

  instrutor: {
    nome: "Seu Nome Aqui",
    titulo: "Instrutor de Tecnologia e Inteligência Artificial"
  },

  marca: {
    nome: "Sua Escola / Sua Marca",
    instagram: "@seuperfil",
    whatsapp: "(43) 90000-0000",
    site: "",
    // Link do SITE PUBLICADO (GitHub Pages) com apresentações e atividades. Vira o QR Code dos slides.
    // Os apps e impressos GERAM o QR Code sozinhos a partir deste link, sem internet.
    linkMateriais: "https://profmv.github.io/ia-sem-misterio/",
    // Link que o QR "siga nas redes" abre (ex.: https://instagram.com/seuperfil). Opcional.
    linkRedes: "",
    // Só use se preferir uma imagem de QR pronta em vez da gerada. Deixe "" normalmente.
    qrMateriais: ""
  },

  // Chamada para ação exibida no LEVAR das trilhas, no fim dos tópicos e na tela de atração.
  // O QR aponta para marca.linkMateriais: uma página sua com "Baixar o kit (sem cadastro)"
  // e "Quero a aula gratuita" (formulário com consentimento). Veja 01-planejamento.
  oferta: {
    titulo: "Leve o kit completo",
    texto: "Material de hoje grátis, sem cadastro. E, se quiser, uma aula gratuita de IA.",
    aulaGratuita: "Aula gratuita on-line: DIA/HORA A DEFINIR"
  },

  // Horários dos tópicos de 8 minutos no PC do instrutor (P0).
  // Aparecem no portal, na tela de atração e no painel. (o campo continua se chamando "show") = número do tópico nos slides.
  shows: [
    { hora: "10:15", show: 1, trilha: "perigos",       titulo: "Golpe com IA: como te enganam e como escapar" },
    { hora: "10:45", show: 2, trilha: "generativa",    titulo: "Crie algo em 2 minutos" },
    { hora: "11:15", show: 3, trilha: "produtividade", titulo: "Use IA melhor que a maioria" },
    { hora: "11:45", show: 4, trilha: "incriveis",     titulo: "Coisas que só a IA faz" },
    { hora: "12:15", show: 1, trilha: "perigos",       titulo: "Golpe com IA (bis): como escapar" }
  ],

  // Segundos parado até aparecer "Ainda está aí?" e segundos de contagem até recomeçar.
  inatividadeSegundos: 45,
  avisoSegundos: 30,

  // false nos PCs de visitante: sites externos viram QR Code para o celular.
  // Mude para true SÓ no PC do instrutor, se quiser que os botões "Abrir aqui" apareçam.
  linksExternos: false
};
