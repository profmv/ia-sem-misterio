/*
 * Cenários do jogo "Golpe ou seguro?" (04-apps/detector-de-golpes).
 * 19 cenários: 14 golpes + 5 seguros. Tudo inventado: nenhum banco, loja, órgão ou pessoa real
 * aparece como remetente; números de telefone vêm mascarados (••••) para não cair em ninguém de verdade.
 *
 * Campos obrigatórios:
 *   id, canal ("whatsapp"|"sms"|"ligacao"|"email"|"anuncio"|"qrcode"|"loja"|"app"),
 *   remetente, texto (≤ 60 palavras), resposta ("golpe"|"seguro"),
 *   sinais [2–4 frases curtas] (golpe = sinais de alerta; seguro = por que dá para confiar),
 *   fazer (1–2 frases), usaIA (true/false), comoIA (1 frase, só quando usaIA),
 *   dificuldade ("facil"|"medio"|"dificil"), publico ("todos"|"idoso"|"jovem"|"comerciante").
 * Campos opcionais:
 *   contexto      situação mostrada acima da mensagem ("📍 Situação: ...")
 *   textoSimples  versão curta para ?simples=1 (só cenários fácil/médio entram no modo simples)
 *   fazerSimples  "o que fazer" curto para ?simples=1
 *   visual        detalhes do desenho do canal (número, hora, áudio, preço, QR...)
 *
 * Fatos usados nos sinais (conferidos em 16/09/2026):
 *   - INSS não envia SMS com link sobre prova de vida; prova de vida é feita por cruzamento de dados; central 135.
 *     https://www.gov.br/inss/pt-br/assuntos/noticias/inss-nao-envia-sms-para-informar-sobre-corte-de-beneficio-por-falta-de-prova-de-vida
 *   - Consulta de dinheiro esquecido (Banco Central) é grátis, só no site oficial; o BC não manda links.
 *     https://valoresareceber.bcb.gov.br
 *   - Pix: contestação (MED) pelo app do banco, até 80 dias contados do Pix. Ver 03-conteudo/perigos-casos-e-canais.md, seção 3.
 *   - Eleições 2026: PROPAGANDA ELEITORAL feita com IA tem de vir com aviso (Res. TSE 23.610/2019 alterada pela 23.755/2026).
 *     A regra não vale para "todo vídeo com IA"; conferido em 17/09/2026.
 */
window.CENARIOS = [

  /* ======================= GOLPES (14) ======================= */

  {
    id: "voz-clonada-neto",
    canal: "ligacao",
    remetente: "Número desconhecido",
    visual: { numero: "(11) 9••••-7320", rotulo: "Chamada recebida" },
    contexto: "O telefone toca. A voz é igualzinha à do seu neto.",
    texto: "Vó, sou eu! Bati o carro e o outro motorista quer chamar a polícia. Preciso de R$ 1.800 no Pix agora pra resolver. Não conta pro pai, pelo amor de Deus! Vou passar pro moço te falar a chave dele.",
    textoSimples: "Vó, sou eu! Bati o carro. Preciso de R$ 1.800 no Pix agora. Não conta pro pai!",
    resposta: "golpe",
    sinais: [
      "Pressa: quer o Pix “agora”.",
      "Segredo: “não conta pro pai”.",
      "O dinheiro vai para a chave de um estranho, não do neto.",
      "Voz igual não prova nada: a IA copia uma voz com poucos segundos de vídeo."
    ],
    fazer: "Desligue e ligue de volta para o número de sempre do seu neto. Pergunte a palavra combinada da família; se já pagou, peça a contestação do Pix no app do banco na hora.",
    fazerSimples: "Desligue e ligue para o número de sempre do seu neto.",
    usaIA: true,
    comoIA: "A voz do neto foi copiada por IA a partir de vídeos que ele postou nas redes sociais.",
    dificuldade: "medio",
    publico: "idoso"
  },

  {
    id: "troquei-de-numero",
    canal: "whatsapp",
    remetente: "(43) 9••••-4471",
    visual: { status: "novo", avatar: "🧑", hora: "09:12" },
    contexto: "Chega mensagem de um número que você não conhece, com a foto do seu filho.",
    texto: "Oi, mãe! Troquei de número, salva esse aqui. O outro celular caiu na água 😩. Tenho um boleto que vence hoje e o app do banco não abre no celular novo. Paga pra mim? Amanhã te devolvo, prometo.",
    textoSimples: "Oi, mãe! Troquei de número. Paga um boleto pra mim hoje? Amanhã te devolvo.",
    resposta: "golpe",
    sinais: [
      "Número novo, que não está nos seus contatos.",
      "Logo depois de “trocar de número”, já pede dinheiro.",
      "Pressa: o boleto “vence hoje”.",
      "A foto do perfil é fácil de copiar da rede social."
    ],
    fazer: "Não pague. Ligue para o número antigo do seu filho e pergunte a palavra da família antes de qualquer Pix ou boleto.",
    fazerSimples: "Não pague. Ligue para o número antigo do seu filho.",
    usaIA: false,
    dificuldade: "facil",
    publico: "todos"
  },

  {
    id: "deepfake-remedio",
    canal: "anuncio",
    remetente: "Cápsula Glico Livre",
    visual: { avatar: "💊", emoji: "🩺", legenda: "▶ VÍDEO · “médico famoso da TV”", botao: "Comprar agora" },
    contexto: "Anúncio patrocinado que aparece na sua rede social.",
    texto: "Médico famoso da TV revela: “Com 2 cápsulas por dia, você larga a insulina em 7 dias.” Aprovado por especialistas. Só hoje: 70% de desconto e frete grátis. Restam só 17 unidades!",
    textoSimples: "Médico famoso da TV: “Com esta cápsula você larga a insulina em 7 dias.” Só hoje, 70% de desconto!",
    resposta: "golpe",
    sinais: [
      "Promessa de cura rápida e de largar o remédio.",
      "Urgência: “só hoje”, “restam 17”.",
      "Famoso “recomendando” em anúncio: rosto e voz podem ter sido feitos por IA.",
      "Venda só pelo link do anúncio."
    ],
    fazer: "Não compre e nunca pare um remédio por causa de anúncio. Pergunte ao seu médico ou no posto de saúde e denuncie o anúncio na própria rede social.",
    fazerSimples: "Não compre. Pergunte ao seu médico ou no posto de saúde.",
    usaIA: true,
    comoIA: "O vídeo usa o rosto e a voz de um médico conhecido, imitados por IA sem ele saber.",
    dificuldade: "medio",
    publico: "idoso"
  },

  {
    id: "namoro-fotos-ia",
    canal: "whatsapp",
    remetente: "Ricardo 💙",
    visual: { status: "conhecido", nota: "conversam há 2 meses", avatar: "🧔", hora: "22:47" },
    contexto: "Vocês se conheceram num app de namoro há 2 meses. Ele sempre tem desculpa para não fazer chamada de vídeo.",
    texto: "Meu amor, meu contrato no exterior acabou e semana que vem finalmente vou te conhecer! 😍 Só que a alfândega segurou minhas coisas e cobra R$ 2.400 de taxa. Minha conta está bloqueada aqui. Você me ajuda? Te devolvo assim que chegar. Só confio em você.",
    resposta: "golpe",
    sinais: [
      "Nunca aparece em chamada de vídeo ao vivo.",
      "Muito carinho rápido e, depois, um pedido de dinheiro.",
      "Sempre surge um problema que só o seu dinheiro resolve.",
      "Fotos perfeitas demais podem ter sido criadas por IA."
    ],
    fazer: "Não mande dinheiro para quem você nunca viu ao vivo e conte para alguém de confiança. Se já mandou, avise o banco na hora e registre B.O. on-line na Polícia Civil do PR.",
    usaIA: true,
    comoIA: "As fotos do perfil foram geradas por IA: a pessoa das fotos não existe.",
    dificuldade: "dificil",
    publico: "todos"
  },

  {
    id: "falsa-central-banco",
    canal: "ligacao",
    remetente: "Central de Segurança",
    visual: { numero: "0800 •••-••00", rotulo: "Chamada recebida" },
    contexto: "Ligação de alguém que diz ser da central de segurança do seu banco.",
    texto: "Aqui é da Central de Segurança. Identificamos uma compra de R$ 3.290 no seu cartão. Não foi o senhor? Então, para proteger seu dinheiro, vamos passar o saldo para uma conta segura. Vai chegar um código por SMS: me fale o número para confirmar.",
    textoSimples: "Aqui é do banco. Teve uma compra estranha no seu cartão. Me fale o código que chegou por SMS.",
    resposta: "golpe",
    sinais: [
      "Banco nunca pede código, senha ou Pix para “conta segura”.",
      "Susto e pressa: “compra suspeita”, “proteger seu dinheiro”.",
      "O número que aparece na tela pode ser falsificado.",
      "Foram eles que ligaram, não você."
    ],
    fazer: "Desligue. Ligue você mesmo para o número do verso do cartão ou abra o app do banco — senha e código: ninguém pede, ninguém dá.",
    fazerSimples: "Desligue e ligue para o número do verso do seu cartão.",
    usaIA: false,
    dificuldade: "medio",
    publico: "todos"
  },

  {
    id: "tarefa-paga",
    canal: "whatsapp",
    remetente: "(11) 9••••-2210",
    visual: { status: "novo", avatar: "👩", perfil: "Juliana · Recrutamento", hora: "14:05" },
    texto: "Olá! Seu perfil foi selecionado para trabalhar de casa: é só curtir vídeos e ganhar R$ 30 por curtida, até R$ 900 por dia! Hoje você já recebe R$ 60 de teste. Para liberar as tarefas VIP, faça um depósito de R$ 150. Vagas limitadas!",
    textoSimples: "Ganhe R$ 900 por dia só curtindo vídeos! Para começar, deposite R$ 150.",
    resposta: "golpe",
    sinais: [
      "Dinheiro fácil demais por pouco trabalho.",
      "Chegou do nada: você nem se candidatou.",
      "Pede depósito para “liberar” tarefas: emprego de verdade não cobra.",
      "Paga um pouquinho no começo só para ganhar sua confiança."
    ],
    fazer: "Não deposite nada e pare de responder. Bloqueie e denuncie o número no próprio aplicativo.",
    fazerSimples: "Não pague nada. Bloqueie o número.",
    usaIA: true,
    comoIA: "A foto da “recrutadora” foi criada por IA e as respostas vêm de um robô de conversa.",
    dificuldade: "facil",
    publico: "jovem"
  },

  {
    id: "loja-falsa",
    canal: "loja",
    remetente: "Loja Mega Ofertas",
    visual: {
      endereco: "mega-ofertas-queimatotal.online", emoji: "📱",
      produto: "Celular 256 GB · câmera tripla", estrelas: "★★★★★ (12 avaliações)",
      precoAntigo: "R$ 4.999", preco: "R$ 399", selo: "⏰ Termina em 09:58"
    },
    texto: "QUEIMA DE ESTOQUE! Celular top de linha 256 GB de R$ 4.999 por R$ 399. Pagamento só no Pix, sem troca e sem devolução. Loja nova, todas as avaliações são 5 estrelas. Oferta termina em 10 minutos!",
    textoSimples: "Celular de R$ 4.999 por R$ 399! Só no Pix. A oferta termina em 10 minutos!",
    resposta: "golpe",
    sinais: [
      "Preço impossível: menos de 10% do valor normal.",
      "Só aceita Pix, sem troca e sem devolução.",
      "Relógio correndo para você não pensar.",
      "Fotos e avaliações perfeitas demais podem ter sido feitas por IA."
    ],
    fazer: "Não pague. Desconfie de loja sem CNPJ e endereço; se já pagou no Pix, peça a contestação no app do banco (MED) e registre B.O. on-line.",
    fazerSimples: "Não pague. Preço bom demais é golpe.",
    usaIA: true,
    comoIA: "As fotos do produto e as “avaliações de clientes” foram criadas por IA.",
    dificuldade: "facil",
    publico: "jovem"
  },

  {
    id: "qrcode-colado",
    canal: "qrcode",
    remetente: "Adesivo no balcão da lanchonete",
    visual: {
      cartaz: "PAGUE COM PIX", aviso: "NOVO QR CODE — o antigo não vale mais",
      valor: "R$ 38,00", para: "Marcos A. S.", tipo: "conta de pessoa física"
    },
    contexto: "Você vai pagar o lanche na Lanchonete Sabor da Praça e lê o QR Code do balcão.",
    texto: "Adesivo colado por cima do QR Code antigo: “NOVO QR CODE — o antigo não vale mais”. Na tela do seu banco aparece: pagar R$ 38,00 para Marcos A. S., conta de pessoa física.",
    textoSimples: "Você lê o QR Code da lanchonete, mas o Pix vai para “Marcos A. S.”, e não para a lanchonete.",
    resposta: "golpe",
    sinais: [
      "Adesivo colado por cima de outro.",
      "O nome de quem recebe não é o da lanchonete.",
      "O aviso “o antigo não vale mais” é para você não estranhar."
    ],
    fazer: "Antes de confirmar qualquer Pix, leia o nome de quem vai receber; se não bater, não pague e avise o atendente. Se você tem comércio, confira seus QR Codes todo dia.",
    fazerSimples: "Antes de pagar, leia o nome de quem vai receber o Pix.",
    usaIA: false,
    dificuldade: "medio",
    publico: "todos"
  },

  {
    id: "dinheiro-esquecido",
    canal: "sms",
    remetente: "SMS 28•••",
    visual: { hora: "08:03" },
    texto: "AVISO: Você tem R$ 1.247,32 esquecidos em banco no seu CPF. Saque até HOJE às 23h59 ou o valor volta para o governo. Pague a taxa de liberação de R$ 49,90 no link: resgate-valor-cpf.site",
    textoSimples: "Você tem R$ 1.247 esquecidos no banco! Pague R$ 49,90 hoje para receber.",
    resposta: "golpe",
    sinais: [
      "Cobra “taxa” para liberar um dinheiro que seria seu.",
      "Prazo apertado: “até hoje”.",
      "Link estranho recebido por SMS.",
      "O Banco Central não manda link nem cobra nada para isso."
    ],
    fazer: "Não clique. A consulta de dinheiro esquecido é grátis e só no site oficial do Banco Central, digitado por você.",
    fazerSimples: "Não clique e não pague taxa nenhuma.",
    usaIA: false,
    dificuldade: "facil",
    publico: "todos"
  },

  {
    id: "falso-suporte-tecnico",
    canal: "email",
    remetente: "Suporte Técnico",
    visual: { de: "alerta@suporte-seguranca-conta.info", assunto: "⚠ URGENTE: seu computador foi invadido" },
    texto: "Detectamos 5 vírus e acesso de hackers ao seu computador. Para não perder suas fotos e senhas, ligue AGORA para nosso técnico: 0800 •••-••17. Ele vai acessar seu computador a distância e resolver em 10 minutos. Valor do serviço: R$ 199.",
    textoSimples: "Seu computador tem vírus! Ligue agora e deixe o técnico entrar no seu computador.",
    resposta: "golpe",
    sinais: [
      "Susto e pressa: “vírus”, “hackers”, “agora”.",
      "Quer controlar seu computador a distância.",
      "Endereço de e-mail estranho, de empresa que você não conhece.",
      "Cobra para resolver um problema que você nem tinha."
    ],
    fazer: "Não ligue e não instale nada. Apague o e-mail; se ficou preocupado, peça ajuda a um técnico de confiança que você mesmo escolheu.",
    fazerSimples: "Não ligue. Apague o e-mail.",
    usaIA: false,
    dificuldade: "medio",
    publico: "todos"
  },

  {
    id: "prova-de-vida",
    canal: "sms",
    remetente: "Aviso Aposentadoria",
    visual: { hora: "07:41" },
    texto: "Sua aposentadoria será BLOQUEADA amanhã por falta de prova de vida. Regularize em 24h: envie uma selfie com seu documento e a senha do cartão pelo link provadevida-beneficio.online",
    textoSimples: "Sua aposentadoria vai ser bloqueada! Mande uma selfie e a senha do cartão neste link.",
    resposta: "golpe",
    sinais: [
      "Ameaça de bloqueio com prazo curto.",
      "Pede selfie com documento e senha por link.",
      "A prova de vida hoje é automática: o governo não manda SMS com link."
    ],
    fazer: "Não clique: para tirar dúvida sobre aposentadoria, ligue 135 ou use o app oficial que você mesmo instalou. Senha: ninguém pede, ninguém dá.",
    fazerSimples: "Não clique. Ligue 135 para tirar a dúvida.",
    usaIA: false,
    dificuldade: "facil",
    publico: "idoso"
  },

  {
    id: "pix-por-engano",
    canal: "whatsapp",
    remetente: "(41) 9••••-3308",
    visual: { status: "novo", avatar: "👩", anexo: "🧾 comprovante-pix.jpg", hora: "16:20" },
    contexto: "Chega esta mensagem com a foto de um comprovante de Pix.",
    texto: "Boa tarde! Mil desculpas, fiz um Pix de R$ 480 pra você por engano, era o aluguel da minha mãe 😢. O comprovante está aí. Você pode devolver hoje nesta outra chave? É que a minha conta foi bloqueada. Deus te abençoe!",
    resposta: "golpe",
    sinais: [
      "Foto de comprovante não prova que o dinheiro caiu.",
      "Pede devolução para outra chave, não para a conta que mandou.",
      "Apelo emocional e pressa: “hoje”.",
      "Devolvendo para outra chave, você pode acabar pagando duas vezes."
    ],
    fazer: "Olhe no app do banco se o dinheiro entrou de verdade. Se entrou, devolva só pela opção “Devolver” desse Pix, nunca para outra chave — na dúvida, fale com seu banco.",
    usaIA: false,
    dificuldade: "dificil",
    publico: "todos"
  },

  {
    id: "fornecedor-audio-clonado",
    canal: "whatsapp",
    remetente: "(43) 9••••-5186",
    visual: { status: "novo", avatar: "👨", audio: "0:24", hora: "11:30" },
    contexto: "Você tem um mercadinho. Chega um áudio com a voz do Jorge, o representante que vende bebidas para você há anos.",
    texto: "Fala, amigo! Aqui é o Jorge, tô com número novo. Seu pedido de bebidas chega amanhã. Esse mês mudou a conta: faz o Pix pra conta nova da empresa, que te mando agora. Pagando hoje, te dou 8% de desconto, beleza?",
    resposta: "golpe",
    sinais: [
      "A conta para pagamento “mudou” por mensagem.",
      "Número novo e desconto só se pagar hoje.",
      "Voz conhecida não é garantia: a IA copia voz com poucos segundos de áudio.",
      "A conta nova pode estar no nome de um desconhecido."
    ],
    fazer: "Ligue para o número antigo do Jorge ou para a empresa e confirme a conta antes de pagar. Nunca troque dados de pagamento só por áudio ou mensagem.",
    usaIA: true,
    comoIA: "A voz do representante foi clonada por IA a partir de áudios antigos dele.",
    dificuldade: "dificil",
    publico: "comerciante"
  },

  {
    id: "video-bombastico-eleicao",
    canal: "whatsapp",
    remetente: "Família Unida 👪",
    visual: { status: "grupo", avatar: "👪", encaminhado: true, video: "0:42", hora: "19:58" },
    texto: "🚨 BOMBA!!! Vazou vídeo do candidato confessando que vai acabar com a aposentadoria se ganhar. A TV está escondendo! Compartilhe em 20 grupos ANTES QUE APAGUEM! Faltam poucos dias para a eleição!!!",
    resposta: "golpe",
    sinais: [
      "Escândalo e urgência: “bomba”, “antes que apaguem”.",
      "Pede para espalhar, não para conferir.",
      "“Encaminhado com frequência” e nenhuma fonte citada.",
      "Na eleição, propaganda feita com IA tem de vir com aviso — golpista não avisa."
    ],
    fazer: "Não compartilhe no calor da emoção. Procure a notícia em jornais e agências de checagem; se ninguém confirmou, não passe adiante — vale para qualquer candidato.",
    usaIA: true,
    comoIA: "Rosto e voz de um político podem ser imitados por IA em vídeo: é o chamado deepfake.",
    dificuldade: "dificil",
    publico: "todos"
  },

  /* ======================= SEGUROS (5) ======================= */

  {
    id: "filha-chegou-de-viagem",
    canal: "whatsapp",
    remetente: "Ana (filha) ❤️",
    visual: { status: "salvo", avatar: "👩", hora: "21:15" },
    contexto: "Sua filha viajou ontem para Curitiba, como vocês tinham combinado.",
    texto: "Mãe, cheguei bem em Curitiba! Está um frio danado 🥶. Amanhã à noite te ligo por vídeo pra senhora ver o apartamento. Dá um beijo no pai. Te amo!",
    textoSimples: "Mãe, cheguei bem em Curitiba! Amanhã te ligo por vídeo. Te amo!",
    resposta: "seguro",
    sinais: [
      "É o contato salvo, o número de sempre.",
      "Fala de algo que você já sabia: a viagem.",
      "Não pede dinheiro, senha nem código.",
      "Sem pressa e sem link."
    ],
    fazer: "Pode responder tranquilo. Se um dia vier pedido de dinheiro com pressa, aí vale a regra: ligue de volta e pergunte a palavra.",
    fazerSimples: "Pode responder tranquilo.",
    usaIA: false,
    dificuldade: "medio",
    publico: "idoso"
  },

  {
    id: "compra-feita-no-app",
    canal: "loja",
    remetente: "App da Loja Casa & Cozinha",
    visual: {
      app: true, endereco: "App oficial · instalado por você", emoji: "🍲",
      produto: "Panela de pressão 4,5 L", preco: "R$ 139,90", selo: "✔ Pedido confirmado"
    },
    contexto: "Há 5 minutos você comprou uma panela de pressão no app da loja. Aparece dentro do app:",
    texto: "Pedido nº 48213 confirmado! Panela de pressão 4,5 L — R$ 139,90 no cartão final 2291. Entrega prevista: 23/09. Acompanhe em “Meus pedidos”, aqui no aplicativo.",
    resposta: "seguro",
    sinais: [
      "Foi você que fez a compra, agora há pouco.",
      "Produto e valor batem com o que você escolheu.",
      "Aparece dentro do app que você mesmo abriu.",
      "Não pede senha, código nem pagamento extra."
    ],
    fazer: "Tudo certo. Mesmo assim, confira pedidos sempre dentro do app ou site que você mesmo abriu — nunca por link que chegou por mensagem.",
    usaIA: false,
    dificuldade: "dificil",
    publico: "todos"
  },

  {
    id: "lembrete-de-consulta",
    canal: "sms",
    remetente: "Clínica Bem Cuidar",
    visual: { hora: "10:00" },
    contexto: "Na semana passada você marcou uma consulta nessa clínica.",
    texto: "Clínica Bem Cuidar: lembrete da sua consulta com o clínico geral na quinta, 24/09, às 8h. Chegue 15 minutos antes e traga documento com foto. Para remarcar, ligue para a clínica.",
    textoSimples: "Lembrete: sua consulta é quinta, 24/09, às 8h. Traga documento com foto.",
    resposta: "seguro",
    sinais: [
      "Foi você que marcou essa consulta.",
      "Não tem link.",
      "Não pede dados, senha nem pagamento.",
      "Para remarcar, é você quem liga."
    ],
    fazer: "Pode confiar. Se tiver dúvida, ligue para o número da clínica que você já tem.",
    fazerSimples: "Pode confiar. É só ir na consulta.",
    usaIA: false,
    dificuldade: "facil",
    publico: "idoso"
  },

  {
    id: "amigo-chama-pro-almoco",
    canal: "whatsapp",
    remetente: "Carlão (amigo)",
    visual: { status: "salvo", avatar: "😄", audio: "0:18", hora: "12:40" },
    texto: "E aí, meu irmão! Sábado tem almoço lá em casa, a Rita vai fazer aquela feijoada. Chega meio-dia e traz a família. Se der, leva um refrigerante. Abraço!",
    textoSimples: "E aí! Sábado tem almoço lá em casa. Chega meio-dia. Abraço!",
    resposta: "seguro",
    sinais: [
      "É o contato salvo de um amigo de sempre.",
      "É só um convite: não pede dinheiro nem código.",
      "Sem pressa e sem segredo."
    ],
    fazer: "Pode responder e aproveitar o almoço! Só acenda o alerta se, no meio da conversa, aparecer pedido de dinheiro com pressa.",
    fazerSimples: "Pode responder e ir no almoço!",
    usaIA: false,
    dificuldade: "facil",
    publico: "todos"
  },

  {
    id: "banco-avisa-no-app",
    canal: "app",
    remetente: "App do seu banco",
    visual: { avatar: "🏦", nota: "aberto por você" },
    contexto: "Você mesmo abriu o aplicativo do seu banco para ver o saldo. Aparece este aviso:",
    texto: "Atenção: nunca pedimos sua senha, código de SMS ou transferência para “conta segura”. Se alguém ligar dizendo ser do banco, desligue e ligue para o número do verso do seu cartão.",
    textoSimples: "Aviso: o banco nunca pede sua senha nem código. Se ligarem pedindo, desligue.",
    resposta: "seguro",
    sinais: [
      "Aparece dentro do app que você mesmo abriu.",
      "Não pede nada: só avisa.",
      "Ensina a regra certa: desliga e liga de volta."
    ],
    fazer: "Aviso de verdade. Guarde a dica: senha e código, ninguém pede, ninguém dá.",
    fazerSimples: "Aviso de verdade. Banco nunca pede senha.",
    usaIA: false,
    dificuldade: "medio",
    publico: "todos"
  }
];
