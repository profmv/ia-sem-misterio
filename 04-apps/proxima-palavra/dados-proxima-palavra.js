/*
 * Dados do app "Próxima Palavra".
 * - adivinhe: rodadas do jogo "você é a IA" (porcentagens ILUSTRATIVAS).
 * - corpus: frases que "treinam" o modelo de brinquedo. Pode acrescentar frases
 *   (minúsculas, sem pontuação). Quanto mais frases com começos parecidos, mais opções.
 * - invencao: demonstração de "alucinação" (a IA inventa algo que soa certo).
 */
window.PROXIMA_PALAVRA = {
  adivinhe: [
    {
      frase: "Parabéns pra ___",
      opcoes: [["você", 92], ["todos", 3], ["ti", 3], ["vocês", 2]],
      comentario: "Fácil! Essa frase aparece milhões de vezes nos textos. A IA também acertaria."
    },
    {
      frase: "Bom dia, tudo ___",
      opcoes: [["bem", 88], ["certo", 6], ["joia", 5], ["ótimo", 1]],
      comentario: "Você acabou de fazer exatamente o que a IA faz: escolheu a palavra mais provável."
    },
    {
      frase: "Eu comprei um ___",
      opcoes: [["celular", 16], ["carro", 15], ["presente", 11], ["livro", 9]],
      comentario: "Aqui ficou difícil: pouco contexto, muitas palavras possíveis. Com a IA é igual — se o seu pedido for vago, ela chuta. Dê detalhes!"
    }
  ],

  // Começos sugeridos para a "máquina de palavras"
  comecos: ["hoje eu", "no sábado", "minha avó", "eu gosto", "a inteligência artificial", "em londrina"],

  corpus: [
    "hoje eu vou ao mercado comprar pão e café",
    "hoje eu vou ao lago igapó caminhar com meu cachorro",
    "hoje eu vou ao centro de londrina com minha mãe",
    "hoje eu vou trabalhar cedo e voltar tarde para casa",
    "hoje eu vou fazer um bolo de fubá para a família",
    "hoje eu vou ficar em casa assistindo um filme",
    "hoje eu quero tomar um café bem forte",
    "hoje eu quero aprender a usar a inteligência artificial",
    "hoje o dia está quente em londrina",
    "hoje o dia está lindo para caminhar no lago igapó",
    "no sábado eu vou ao mercado comprar frutas e verduras",
    "no sábado eu vou à feira com minha avó",
    "no sábado eu gosto de tomar café com pão de queijo",
    "no sábado eu gosto de caminhar no lago igapó",
    "no sábado de manhã eu gosto de dormir até tarde",
    "no sábado de manhã a feira fica cheia de gente",
    "no sábado a carreta da inovação está no centro de londrina",
    "no domingo eu vou almoçar na casa da minha mãe",
    "no domingo a família toda almoça junto",
    "minha mãe faz o melhor bolo de fubá do mundo",
    "minha mãe gosta de tomar café com leite de manhã",
    "minha mãe mandou uma mensagem no whatsapp",
    "minha avó faz o melhor pão de queijo do mundo",
    "minha avó gosta de ouvir música no rádio",
    "minha avó mandou um áudio no whatsapp",
    "meu cachorro gosta de caminhar no parque",
    "meu cachorro come ração e dorme o dia todo",
    "meu filho gosta de jogar futebol no parque",
    "meu filho quer aprender a programar computadores",
    "eu gosto de café com pão de queijo",
    "eu gosto de caminhar no parque de manhã",
    "eu gosto de ouvir música sertaneja no carro",
    "eu gosto de assistir futebol com meus amigos",
    "eu gosto de aprender coisas novas no computador",
    "eu quero aprender a usar o computador melhor",
    "eu quero tomar um café com leite",
    "em londrina o dia está quente e ensolarado",
    "em londrina o lago igapó é lindo no fim da tarde",
    "em londrina tem muita gente simpática",
    "em londrina a catedral fica no centro da cidade",
    "o café da manhã tem pão queijo e café com leite",
    "o lago igapó é lindo no fim da tarde",
    "o centro de londrina fica cheio no sábado",
    "a inteligência artificial ajuda a escrever textos",
    "a inteligência artificial ajuda a resumir textos longos",
    "a inteligência artificial pode errar com muita confiança",
    "a inteligência artificial aprende com muitos textos da internet",
    "a inteligência artificial não sabe o que é verdade",
    "a inteligência artificial escolhe a palavra mais provável",
    "a inteligência artificial pode criar imagens e músicas",
    "a inteligência artificial pode ser usada em golpes",
    "o golpe chega pelo whatsapp com muita pressa",
    "o golpe pede um pix com urgência",
    "nunca faça um pix com pressa",
    "sempre ligue de volta para confirmar",
    "a família combinou uma palavra secreta contra golpes"
  ],

  // Só o 1º passo deixa o visitante escolher; os demais seguem a palavra mais provável,
  // para a frase final sair sempre coerente (e convincente).
  invencao: {
    frase: "O dinossauro que morava no Lago Igapó se chamava",
    passos: [
      [["Igapossauro", 24], ["Rex", 19], ["Dino", 16], ["Tobias", 11], ["Zeca", 8]],
      [["e", 41], [",", 20], [".", 17], ["que", 12], ["porque", 5]],
      [["comia", 33], ["nadava", 24], ["gostava", 15], ["vivia", 11], ["assustava", 8]],
      [["peixes", 36], ["pão", 21], ["tudo", 14], ["capivaras", 10], ["pipoca", 7]],
      [["e", 39], [".", 30], ["do", 12], ["com", 9], ["todo", 5]],
      [["pão", 31], ["capivaras", 22], ["pipoca", 17], ["patos", 13], ["algas", 9]],
      [["de", 72], ["com", 11], ["doce", 7], [".", 6], ["frito", 4]],
      [["queijo", 81], ["milho", 9], ["forma", 6], ["mel", 3], ["batata", 1]],
      [[".", 88], ["mineiro", 6], ["quentinho", 4], ["com", 1], ["e", 1]]
    ],
    revelacao: "Nunca existiu dinossauro no Lago Igapó — ele é um lago artificial, feito pela cidade! Mas um modelo de palavras não \"sabe\" disso: ele só escolhe palavras que combinam. O texto saiu convincente, com nome e tudo. Isso se chama ALUCINAÇÃO: a IA inventa com confiança.",
    nota: "Os assistentes modernos (ChatGPT, Gemini, Copilot…) erram bem menos numa pergunta tão absurda, mas continuam inventando — principalmente nomes, datas, números, leis, remédios e links. Informação importante? Confira em outra fonte."
  }
};
