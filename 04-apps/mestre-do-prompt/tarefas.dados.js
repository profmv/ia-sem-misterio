/*
 * Dados do app "Mestre do prompt" (04-apps/mestre-do-prompt) — fórmula Saber PEDIR:
 *   P Papel · E Explique a tarefa · D Detalhe o contexto · I Indique o formato · R Revise
 *
 * O pedido é montado com conectores fixos, então fica gramatical em qualquer combinação:
 *   "Você é {papel.texto}. {tarefa.verbo}. Contexto: {contextos[].texto separados por ';'}. Entregue como {formato.texto}."
 *   - papel.texto começa com artigo ("um vendedor experiente")
 *   - tarefa.verbo começa com verbo no imperativo e NÃO termina com ponto
 *   - contexto.texto começa com minúscula e NÃO termina com ponto
 *   - formato.texto começa com artigo ou substantivo ("uma lista de tópicos")
 *
 * Tarefas:
 *   papeis         ids de papel que combinam mais (o app dá uma dica se o visitante escolher outro)
 *   formatoPadrao  formato em que a resposta de exemplo foi escrita (e o usado no modo simples)
 *   fonte          texto que vai "anexado" ao pedido (resumo, carta). O erro plantado é conferido com ele.
 *   contextos      3–4 chips; "essencial: true" já vem marcado e não sai (é onde está o fato que o erro contradiz)
 *   respostaBoa    trechos clicáveis; exatamente 1 com errado: true + explicacao. novaLinha: true quebra a linha antes.
 * Regra do erro plantado: um leigo acha em até 30 s comparando com o que está NA TELA (contexto essencial ou fonte).
 * Respostas: exemplos escritos para a oficina (texto de IA típico, revisado); boa ≤ 90 palavras, ruim genérica.
 */
window.MESTRE_PROMPT = {

  papeis: [
    { id: "vendedor",   icone: "💼",  rotulo: "Vendedor experiente",              texto: "um vendedor experiente" },
    { id: "professor",  icone: "🎓",  rotulo: "Professor paciente",               texto: "um professor paciente" },
    { id: "redator",    icone: "📱",  rotulo: "Redator de Instagram",             texto: "um redator de Instagram" },
    { id: "cozinheira", icone: "🍲",  rotulo: "Cozinheira de mão cheia",          texto: "uma cozinheira de mão cheia" },
    { id: "atendente",  icone: "😊",  rotulo: "Atendente simpático",              texto: "um atendente simpático" },
    { id: "escritor",   icone: "💌",  rotulo: "Escritor de mensagens carinhosas", texto: "um escritor de mensagens carinhosas" }
  ],

  formatos: [
    { id: "mensagem", icone: "💬", rotulo: "Mensagem curta",   texto: "uma mensagem curta, pronta para enviar" },
    { id: "lista",    icone: "📋", rotulo: "Lista de tópicos", texto: "uma lista de tópicos" },
    { id: "passos",   icone: "🔢", rotulo: "Passo a passo",    texto: "um passo a passo numerado" },
    { id: "simples",  icone: "🗣️", rotulo: "Frases simples",   texto: "frases curtas, em linguagem simples" },
    { id: "cenas",    icone: "🎬", rotulo: "Cenas com tempo",  texto: "um roteiro dividido em cenas, com o tempo de cada uma" }
  ],

  // Modo simples (?simples=1): só as tarefas do dia a dia
  tarefasSimples: ["aniversario", "receita", "carta-banco", "whatsapp-cliente"],

  tarefas: [

    {
      id: "cobranca",
      titulo: "Cobrar um cliente com educação",
      icone: "💸",
      verbo: "Escreva uma mensagem educada de cobrança para uma cliente que atrasou o pagamento",
      papeis: ["atendente", "vendedor"],
      formatoPadrao: "mensagem",
      contextos: [
        { id: "valor",    icone: "💰", rotulo: "Bolo de R$ 180, venceu dia 10", texto: "a cliente, Dona Marta, encomendou um bolo de R$ 180 que venceu no dia 10", essencial: true },
        { id: "antiga",   icone: "🤝", rotulo: "Cliente há 5 anos",             texto: "ela compra comigo há 5 anos e sempre pagou em dia" },
        { id: "parcelar", icone: "➗", rotulo: "Posso dividir em 2 vezes",      texto: "posso dividir o valor em 2 vezes" },
        { id: "tom",      icone: "🌸", rotulo: "Tom gentil, sem ameaça",        texto: "o tom deve ser gentil e sem ameaça" }
      ],
      pedidoRuim: "faz uma cobrança",
      respostaRuim: "Prezado cliente, consta em nosso sistema um débito em aberto. Solicitamos a regularização imediata para evitar as medidas cabíveis. Atenciosamente, Departamento Financeiro.",
      respostaBoa: [
        { texto: "Oi, Dona Marta, tudo bem? 😊", errado: false },
        { texto: "Passando com carinho para lembrar do bolo de aniversário:", errado: false },
        { texto: "o valor de R$ 280 venceu no dia 10.", errado: true,
          explicacao: "No pedido, o bolo custou R$ 180 — a IA escreveu R$ 280. Um valor errado numa cobrança pode ofender a cliente. Confira todo número com a sua anotação antes de enviar." },
        { texto: "Como a senhora compra com a gente há 5 anos e sempre pagou certinho, imagino que foi só um esquecimento.", errado: false },
        { texto: "Se ajudar, posso dividir em 2 vezes.", errado: false },
        { texto: "É só me responder por aqui. Agradeço a confiança de sempre!", errado: false }
      ]
    },

    {
      id: "instagram",
      titulo: "Divulgar um produto no Instagram",
      icone: "📸",
      verbo: "Escreva a descrição de um produto para o Instagram do meu negócio",
      papeis: ["redator", "vendedor"],
      formatoPadrao: "lista",
      contextos: [
        { id: "produto", icone: "🍯", rotulo: "Pão de mel recheado, R$ 6", texto: "o produto é pão de mel artesanal recheado com doce de leite, a R$ 6 cada", essencial: true },
        { id: "entrega", icone: "🛵", rotulo: "Entrega grátis no centro",  texto: "entrego grátis no centro de Londrina" },
        { id: "prazo",   icone: "📅", rotulo: "Encomendas até sexta",      texto: "as encomendas vão até sexta-feira" },
        { id: "tom",     icone: "😄", rotulo: "Tom alegre, com emoji",     texto: "quero um tom alegre, com emoji" }
      ],
      pedidoRuim: "faz um post de doce",
      respostaRuim: "Delicioso doce feito com muito carinho! Venha experimentar. Qualidade e sabor que você merece! #doces #delícia #sabor",
      respostaBoa: [
        { texto: "🍯 Pão de mel artesanal, fofinho e feito à mão!", errado: false },
        { texto: "Recheado com doce de leite cremoso de verdade.", errado: false },
        { texto: "💰 Só R$ 8 cada!", errado: true, novaLinha: true,
          explicacao: "No pedido, cada pão de mel custa R$ 6 — a IA escreveu R$ 8. Se o post sair assim, o cliente vai estranhar na hora de pagar. Confira todo preço antes de publicar." },
        { texto: "🛵 Entrega grátis no centro de Londrina.", errado: false, novaLinha: true },
        { texto: "📅 Encomende até sexta-feira pelo direct!", errado: false, novaLinha: true },
        { texto: "#pãodemel #docecaseiro #Londrina", errado: false, novaLinha: true }
      ]
    },

    {
      id: "resumo",
      titulo: "Resumir um texto longo",
      icone: "📄",
      verbo: "Faça um resumo do aviso do condomínio abaixo",
      papeis: ["professor"],
      formatoPadrao: "lista",
      fonte: {
        titulo: "Aviso do condomínio (anexado ao pedido)",
        texto: "Comunicado aos moradores: a caixa-d'água do prédio passará por limpeza obrigatória. Por isso, a água ficará desligada por 3 dias, de segunda (21/09) a quarta (23/09), das 8h às 17h. Recomendamos encher baldes e garrafas na noite anterior. O elevador de serviço também ficará parado nesses dias. A taxa extra de R$ 35 pela limpeza virá no boleto de outubro. Dúvidas: falar com o síndico, Sr. Paulo, no apartamento 12."
      },
      contextos: [
        { id: "idosa",  icone: "👵", rotulo: "Para uma pessoa idosa",   texto: "é para uma pessoa idosa entender" },
        { id: "rotina", icone: "✂️", rotulo: "Só o que muda na rotina", texto: "quero só o que muda na rotina" },
        { id: "grupo",  icone: "📱", rotulo: "Vou mandar no grupo",     texto: "vou mandar no grupo de WhatsApp dos moradores" }
      ],
      pedidoRuim: "resume isso",
      respostaRuim: "O texto trata de uma manutenção no prédio e traz orientações aos moradores sobre o período e os procedimentos necessários.",
      respostaBoa: [
        { texto: "📢 Resumo do aviso do prédio:", errado: false },
        { texto: "🚱 a água fica desligada por 5 dias,", errado: true, novaLinha: true,
          explicacao: "O aviso diz 3 dias (de segunda, 21/09, a quarta, 23/09) — a IA escreveu 5 dias. Ao resumir, a IA troca números com facilidade: compare sempre com o texto original." },
        { texto: "de segunda (21/09) a quarta (23/09), das 8h às 17h.", errado: false },
        { texto: "💧 Encha baldes e garrafas na noite anterior.", errado: false, novaLinha: true },
        { texto: "🏢 O elevador de serviço também fica parado.", errado: false, novaLinha: true },
        { texto: "💰 A limpeza custa R$ 35 a mais no boleto de outubro.", errado: false, novaLinha: true },
        { texto: "❓ Dúvidas: síndico Sr. Paulo, apartamento 12.", errado: false, novaLinha: true }
      ]
    },

    {
      id: "aniversario",
      titulo: "Mensagem de aniversário para o neto",
      icone: "🎂",
      verbo: "Escreva uma mensagem de aniversário para o meu neto",
      papeis: ["escritor"],
      formatoPadrao: "mensagem",
      contextos: [
        { id: "idade",   icone: "🎂", rotulo: "Pedro faz 12 anos",    texto: "ele se chama Pedro e está fazendo 12 anos", essencial: true },
        { id: "futebol", icone: "⚽", rotulo: "Ama futebol",          texto: "ele adora futebol e joga no time da escola" },
        { id: "longe",   icone: "🚌", rotulo: "Mora em outra cidade", texto: "ele mora em outra cidade e a gente se vê pouco" },
        { id: "curta",   icone: "💛", rotulo: "Carinhosa e curta",    texto: "quero uma mensagem carinhosa e curta" }
      ],
      pedidoRuim: "mensagem de aniversário",
      respostaRuim: "Feliz aniversário! Que seu dia seja repleto de alegria, paz, saúde e muitas realizações. Parabéns!",
      respostaBoa: [
        { texto: "Pedro, meu querido, feliz aniversário! 🎉", errado: false },
        { texto: "13 anos! Que orgulho de ver você crescendo.", errado: true,
          explicacao: "No pedido, o Pedro está fazendo 12 anos — a IA escreveu 13. Idade, nome e data são erros comuns e chateiam quem recebe. Confira antes de enviar." },
        { texto: "Aposto que o melhor presente seria marcar um gol pelo time da escola hoje! ⚽", errado: false },
        { texto: "A distância é grande, mas o meu carinho chega inteirinho aí.", errado: false },
        { texto: "Quando a gente se encontrar, quero ver essas jogadas de perto.", errado: false },
        { texto: "Um abraço bem apertado de quem te ama muito! 💛", errado: false }
      ]
    },

    {
      id: "receita",
      titulo: "Receita com o que tem na geladeira",
      icone: "🍳",
      verbo: "Sugira uma receita com o que eu tenho em casa",
      papeis: ["cozinheira"],
      formatoPadrao: "passos",
      contextos: [
        { id: "ingredientes", icone: "🥚", rotulo: "Tenho 3 ovos, tomate e queijo", texto: "tenho 3 ovos, 2 tomates, uma cebola e um pedaço de queijo", essencial: true },
        { id: "rapida",       icone: "⏱️", rotulo: "Pronta em 15 minutos",          texto: "precisa ficar pronta em 15 minutos" },
        { id: "frigideira",   icone: "🍳", rotulo: "Sem forno, só frigideira",      texto: "não tenho forno, só fogão e frigideira" },
        { id: "sal",          icone: "🧂", rotulo: "Pouco sal",                     texto: "use pouco sal" }
      ],
      pedidoRuim: "me dá uma receita",
      respostaRuim: "Que tal um delicioso bolo de chocolate? Você vai precisar de farinha, açúcar, chocolate em pó, ovos, leite e fermento. Misture tudo e asse por 40 minutos.",
      respostaBoa: [
        { texto: "🍳 Omelete de tomate e queijo (15 minutos)", errado: false },
        { texto: "1. Pique a cebola e os 2 tomates.", errado: false, novaLinha: true },
        { texto: "2. Bata os 5 ovos com uma pitadinha de sal.", errado: true, novaLinha: true,
          explicacao: "Você disse que tem 3 ovos, e a receita pede 5. A IA não sabe o que tem na sua geladeira: ela completa com o que parece comum. Confira as quantidades." },
        { texto: "3. Refogue a cebola e o tomate na frigideira por 3 minutos.", errado: false, novaLinha: true },
        { texto: "4. Junte os ovos, espalhe o queijo e tampe por 5 minutos em fogo baixo.", errado: false, novaLinha: true },
        { texto: "5. Dobre ao meio e sirva. Para dar sabor sem sal, use orégano.", errado: false, novaLinha: true }
      ]
    },

    {
      id: "carta-banco",
      titulo: "Entender uma carta do banco",
      icone: "🏦",
      verbo: "Explique em linguagem simples a carta do banco abaixo",
      papeis: ["professor"],
      formatoPadrao: "simples",
      fonte: {
        titulo: "Carta do banco (exemplo inventado, anexado ao pedido)",
        texto: "Prezado(a) cliente, informamos que a tarifa mensal do Pacote Conta Mais passará de R$ 19,90 para R$ 24,90 a partir de 01/11/2026. Caso não concorde, V.Sa. poderá solicitar a migração para os serviços essenciais gratuitos, sem custo, em qualquer canal de atendimento, até 31/10/2026. A alteração não afeta os demais produtos contratados."
      },
      contextos: [
        { id: "leigo", icone: "🤷", rotulo: "Não entendo termos de banco", texto: "não entendo os termos que o banco usa" },
        { id: "fazer", icone: "❓", rotulo: "Preciso fazer alguma coisa?", texto: "quero saber se preciso fazer alguma coisa" },
        { id: "prazo", icone: "📅", rotulo: "Tem prazo?",                  texto: "quero saber se tem prazo" }
      ],
      pedidoRuim: "o que é isso",
      respostaRuim: "Trata-se de comunicado bancário referente à alteração contratual de tarifas do pacote de serviços, conforme a regulamentação vigente.",
      respostaBoa: [
        { texto: "Em palavras simples:", errado: false },
        { texto: "o banco vai aumentar a taxa mensal da sua conta, de R$ 19,90 para R$ 24,90.", errado: false },
        { texto: "O aumento começa em 01/12/2026.", errado: true,
          explicacao: "A carta diz que o aumento começa em 01/11/2026 — a IA escreveu 01/12/2026. Com a data errada, você pode perder o prazo. Confira datas sempre no documento original." },
        { texto: "Se não quiser pagar, você pode pedir para mudar para os serviços básicos gratuitos, sem custo nenhum.", errado: false },
        { texto: "O pedido pode ser feito no app, na agência ou por telefone, até 31/10/2026.", errado: false },
        { texto: "Os outros serviços que você contratou não mudam.", errado: false }
      ]
    },

    {
      id: "roteiro-video",
      titulo: "Roteiro de vídeo para divulgar um serviço",
      icone: "🎬",
      verbo: "Crie um roteiro de vídeo curto para divulgar o meu serviço",
      papeis: ["redator", "vendedor"],
      formatoPadrao: "cenas",
      contextos: [
        { id: "barbearia", icone: "💈", rotulo: "Barbearia: terça a sábado, 9h às 19h", texto: "tenho uma barbearia que abre de terça a sábado, das 9h às 19h", essencial: true },
        { id: "duracao",   icone: "⏱️", rotulo: "Vídeo de 30 segundos",                 texto: "o vídeo tem 30 segundos" },
        { id: "publico",   icone: "👔", rotulo: "Para quem trabalha no centro",         texto: "o público é quem trabalha no centro e tem pouco tempo" },
        { id: "promo",     icone: "🎁", rotulo: "Promoção: corte + barba R$ 50",        texto: "a promoção do mês é corte + barba por R$ 50" }
      ],
      pedidoRuim: "faz um vídeo pra minha barbearia",
      respostaRuim: "Mostre o seu estabelecimento, apresente os serviços oferecidos e convide as pessoas a conhecerem. Use uma música animada e finalize com seu contato.",
      respostaBoa: [
        { texto: "🎬 Cena 1 (0–5 s): close da tesoura. Texto na tela: “Sem tempo pra cortar o cabelo?”", errado: false },
        { texto: "Cena 2 (5–15 s): cliente de camisa social senta na cadeira; corte em câmera rápida.", errado: false, novaLinha: true },
        { texto: "Cena 3 (15–25 s): antes e depois. Fala: “Corte + barba por R$ 50 este mês!”", errado: false, novaLinha: true },
        { texto: "Cena 4 (25–30 s): fachada. Texto: “Aberto de segunda a sábado, das 9h às 19h.”", errado: true, novaLinha: true,
          explicacao: "No pedido, a barbearia abre de terça a sábado — a IA escreveu segunda a sábado. Quem for na segunda vai dar com a porta fechada. Confira dias e horários." },
        { texto: "Legenda: “Seu visual renovado, pertinho do trabalho. 💈”", errado: false, novaLinha: true }
      ]
    },

    {
      id: "whatsapp-cliente",
      titulo: "Responder cliente no WhatsApp",
      icone: "💬",
      verbo: "Escreva a resposta para um cliente que perguntou no WhatsApp o horário da loja e como funciona a entrega",
      papeis: ["atendente"],
      formatoPadrao: "mensagem",
      contextos: [
        { id: "horario",   icone: "🕕", rotulo: "Loja abre 8h e fecha 18h",      texto: "a loja abre às 8h e fecha às 18h", essencial: true },
        { id: "frete",     icone: "🛵", rotulo: "Entrega grátis acima de R$ 50", texto: "a entrega é grátis em compras acima de R$ 50" },
        { id: "mesmo-dia", icone: "📦", rotulo: "Pedido até 15h chega hoje",     texto: "pedido feito até as 15h chega no mesmo dia" },
        { id: "curta",     icone: "🙂", rotulo: "Curta e simpática",             texto: "a resposta deve ser curta e simpática" }
      ],
      pedidoRuim: "responde o cliente",
      respostaRuim: "Olá! Agradecemos o seu contato. Em breve retornaremos com mais informações. Atenciosamente, equipe de atendimento.",
      respostaBoa: [
        { texto: "Oi! Tudo bem? 😊", errado: false },
        { texto: "A loja abre às 8h e fecha às 20h.", errado: true,
          explicacao: "No pedido, a loja fecha às 18h — a IA escreveu 20h. O cliente pode chegar com a loja fechada. Horário, endereço e preço: confira sempre." },
        { texto: "Fazendo o pedido até as 15h, ele chega no mesmo dia.", errado: false },
        { texto: "E a entrega é grátis para compras acima de R$ 50. 🛵", errado: false },
        { texto: "Quer que eu já anote o seu pedido?", errado: false }
      ]
    }
  ]
};
