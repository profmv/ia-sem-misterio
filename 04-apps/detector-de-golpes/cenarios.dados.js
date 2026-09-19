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
 */
window.CENARIOS = [

  /* ======================= GOLPES (20) ======================= */

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
    id: "video-bombastico-poupanca",
    canal: "whatsapp",
    remetente: "Família Unida 👪",
    visual: { status: "grupo", avatar: "👪", encaminhado: true, video: "0:42", hora: "19:58" },
    texto: "🚨 BOMBA!!! Vazou vídeo de um apresentador famoso avisando que o governo vai bloquear a poupança de todo mundo na segunda. A TV está escondendo! Compartilhe em 20 grupos ANTES QUE APAGUEM!!!",
    resposta: "golpe",
    sinais: [
      "Escândalo e urgência: “bomba”, “antes que apaguem”.",
      "Pede para espalhar, não para conferir.",
      "“Encaminhado com frequência” e nenhuma fonte citada.",
      "Vídeo “vazado” de gente famosa pode ser deepfake: rosto e voz imitados por IA."
    ],
    fazer: "Não compartilhe no calor da emoção. Procure a notícia em jornais e agências de checagem; se ninguém confirmou, não passe adiante — vale para qualquer notícia bombástica.",
    usaIA: true,
    comoIA: "Rosto e voz de uma pessoa famosa podem ser imitados por IA em vídeo: é o chamado deepfake.",
    dificuldade: "dificil",
    publico: "todos"
  },

  {
    id: "motoboy-recolhe-cartao",
    canal: "ligacao",
    remetente: "Central de Prevenção a Fraudes",
    visual: { numero: "(11) 3•••-••40", rotulo: "Chamada recebida" },
    contexto: "Ligam dizendo que é do seu banco. Pedem que você desligue e ligue para o número do verso do cartão — e a ligação parece continuar normal.",
    texto: "Seu cartão foi clonado, senhor. Já cancelamos. Para sua segurança, um motoboy do banco passa aí em 30 minutos para buscar o cartão antigo. Corte ao meio, mas deixe o chip inteiro. Antes, digite sua senha no telefone para o cancelamento ficar registrado.",
    textoSimples: "Seu cartão foi clonado. Um motoboy do banco vai buscar o cartão aí. Digite sua senha agora para cancelar.",
    resposta: "golpe",
    sinais: [
      "Banco nenhum manda alguém buscar cartão na sua casa.",
      "Pediu senha: senha e código, ninguém pede, ninguém dá.",
      "O golpista não desliga a linha: você disca e cai nele de novo.",
      "Cortar o cartão deixando o chip inteiro é justamente o que o ladrão quer."
    ],
    fazer: "Não entregue o cartão e não digite senha. Desligue e ligue de OUTRO telefone (ou espere 1 minuto e confira o tom de discar) para o número do verso do cartão. Se já entregou, peça o bloqueio na hora e registre B.O. on-line na Polícia Civil do PR.",
    fazerSimples: "Não entregue o cartão e não diga a senha. Ligue de outro telefone para o banco.",
    usaIA: false,
    dificuldade: "medio",
    publico: "idoso"
  },

  {
    id: "codigo-de-seis-digitos",
    canal: "whatsapp",
    remetente: "Tia Nilza ❤️",
    visual: { status: "salvo", avatar: "👵", hora: "18:33" },
    contexto: "Chega mensagem da sua tia, do número de sempre. Um minuto antes, chegou um SMS com um código de 6 números que você não pediu.",
    texto: "Oi, querido! Fui cadastrar uma coisa e coloquei seu número sem querer 🤦. Chegou um código de 6 números aí? Me passa rapidinho que eu preciso terminar antes das 19h, por favor!",
    textoSimples: "Chegou um código de 6 números no seu celular? Me passa rapidinho, coloquei seu número sem querer!",
    resposta: "golpe",
    sinais: [
      "Código que chega sem você ter pedido nada é para ENTRAR na sua conta.",
      "A conta da tia provavelmente já foi roubada: quem escreve é o golpista.",
      "Pressa outra vez: “antes das 19h”.",
      "Contato salvo não prova nada — prova é a pessoa falando ao vivo."
    ],
    fazer: "Não passe o código para ninguém, nem para parente. Ligue para a sua tia no número de sempre e avise que a conta dela pode ter sido roubada. Ative a confirmação em duas etapas do WhatsApp (Configurações → Conta).",
    fazerSimples: "Nunca passe o código para ninguém. Ligue para a sua tia e avise.",
    usaIA: false,
    dificuldade: "medio",
    publico: "todos"
  },

  {
    id: "entrega-taxa-alfandega",
    canal: "sms",
    remetente: "SMS 27•••",
    visual: { hora: "13:52" },
    contexto: "Você comprou um fone pela internet na semana passada.",
    texto: "SUA ENCOMENDA ESTÁ RETIDA. Pendência de taxa de R$ 4,87. Regularize em 24h ou o pacote será devolvido ao remetente: rastreio-entrega24h.info/pagar",
    textoSimples: "Sua encomenda está parada. Pague R$ 4,87 neste link em 24 horas ou ela volta.",
    resposta: "golpe",
    sinais: [
      "Valor pequeno de propósito: você paga sem pensar e entrega os dados do cartão.",
      "Prazo curto para você não conferir.",
      "Endereço estranho, que não é o dos Correios nem o da loja.",
      "Chegou por SMS, e não dentro do app onde você comprou."
    ],
    fazer: "Não clique. Abra o app ou o site da loja que você mesmo usou e veja o rastreio por lá. Taxa de verdade aparece no canal oficial, nunca só por SMS.",
    fazerSimples: "Não clique. Veja o rastreio no app da loja onde você comprou.",
    usaIA: false,
    dificuldade: "facil",
    publico: "todos"
  },

  {
    id: "investimento-jornalista-falso",
    canal: "anuncio",
    remetente: "Renda Livre · Patrocinado",
    visual: { avatar: "📈", emoji: "🎙️", legenda: "▶ VÍDEO · “âncora de telejornal”", botao: "Quero participar" },
    contexto: "Vídeo patrocinado no seu feed, com cara de reportagem de telejornal.",
    texto: "Âncora do jornal anuncia: “Plataforma brasileira paga R$ 300 por dia para quem investir R$ 200 hoje.” Vagas no grupo de VIPs encerram à meia-noite. Últimos 9 lugares. Clique e fale com nosso consultor no WhatsApp.",
    textoSimples: "Vídeo do jornal diz: invista R$ 200 e ganhe R$ 300 por dia. Só até meia-noite!",
    resposta: "golpe",
    sinais: [
      "Ganho garantido e altíssimo: investimento de verdade não promete isso.",
      "Cara de telejornal, mas a notícia não existe em nenhum jornal.",
      "Rosto e voz de jornalista podem ser imitados por IA.",
      "Tudo termina num grupo de WhatsApp com “consultor”."
    ],
    fazer: "Não clique e não fale com o “consultor”. Procure o nome da empresa no site da CVM (cvm.gov.br) e a notícia no site do próprio jornal. Denuncie o anúncio na rede social.",
    fazerSimples: "Não clique. Dinheiro fácil garantido é golpe.",
    usaIA: true,
    comoIA: "O rosto e a voz do apresentador foram imitados por IA num vídeo que ele nunca gravou.",
    dificuldade: "medio",
    publico: "jovem"
  },

  {
    id: "comprovante-falso-balcao",
    canal: "loja",
    remetente: "Cliente no balcão",
    visual: {
      emoji: "🧾", produto: "2 botijões de gás · R$ 220",
      selo: "📱 “Olha aqui, já mandei”", endereco: "Comprovante mostrado na tela do celular"
    },
    contexto: "Você tem uma revenda de gás. O cliente mostra na tela do celular um comprovante de Pix de R$ 220 e pede para levar a mercadoria.",
    texto: "Pronto, patrão, já fiz o Pix! Olha o comprovante aqui na tela. Deve estar demorando por causa do horário, o banco tá lento hoje. Deixa eu já levar que o carro tá em fila dupla lá fora.",
    textoSimples: "“Já fiz o Pix, olha o comprovante!” Mas o dinheiro ainda não apareceu na sua conta.",
    resposta: "golpe",
    sinais: [
      "Comprovante na tela é uma imagem: dá para editar em segundos.",
      "Pix de verdade cai na hora, a qualquer horário.",
      "Pressa para sair antes de você conferir.",
      "Quem confirma o pagamento é o seu extrato, não a tela do cliente."
    ],
    fazer: "Só entregue depois de ver o valor entrando no SEU extrato ou no maquininha/app da sua conta. Se já entregou, guarde as imagens e registre B.O. on-line na Polícia Civil do PR.",
    fazerSimples: "Só entregue depois de ver o dinheiro na sua conta.",
    usaIA: false,
    dificuldade: "medio",
    publico: "comerciante"
  },

  {
    id: "corte-de-energia-hoje",
    canal: "ligacao",
    remetente: "Atendimento · Energia",
    visual: { numero: "(43) 3•••-••08", rotulo: "Chamada recebida" },
    contexto: "Ligam dizendo que é da companhia de energia.",
    texto: "Boa tarde. Consta uma fatura de outubro em aberto no seu endereço e a equipe de corte já está na rua. Dá para evitar o corte pagando agora por Pix: vou passar a chave, é CPF. O senhor manda o comprovante para este mesmo número.",
    textoSimples: "Sua luz vai ser cortada hoje! Pague agora um Pix para a chave que eu vou passar.",
    resposta: "golpe",
    sinais: [
      "Susto e prazo de minutos: é a receita do golpe.",
      "Pix para chave que é CPF de pessoa física, não da empresa.",
      "Foram eles que ligaram — e querem o pagamento fora dos canais da conta.",
      "Você não conferiu a fatura em lugar nenhum."
    ],
    fazer: "Desligue. Confira a fatura no app ou no site da concessionária que você mesmo abriu, ou na conta de papel. Nunca pague por Pix passado no telefone.",
    fazerSimples: "Desligue. Confira a conta de luz no app ou no papel.",
    usaIA: false,
    dificuldade: "facil",
    publico: "todos"
  },

  /* ======================= SEGUROS (7) ======================= */

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
  },

  {
    id: "rastreio-no-app-da-loja",
    canal: "app",
    remetente: "App da loja onde você comprou",
    visual: { avatar: "📦", nota: "aberto por você" },
    contexto: "Você comprou um fone semana passada. Abriu o app da loja para ver onde está.",
    texto: "Pedido nº 77120 · Seu fone saiu para entrega hoje. Previsão: até as 18h. Acompanhe em “Meus pedidos”. Nenhuma taxa adicional é cobrada para esta entrega.",
    textoSimples: "Seu pedido saiu para entrega hoje. Não tem nenhuma taxa para pagar.",
    resposta: "seguro",
    sinais: [
      "Você abriu o app; ninguém mandou link para você.",
      "É a compra que você mesmo fez.",
      "Não pede pagamento, senha nem dado novo.",
      "O número do pedido bate com o que está na sua conta."
    ],
    fazer: "Tudo certo. Guarde a regra: rastreio se confere DENTRO do app ou site que você mesmo abriu — nunca por link de SMS.",
    fazerSimples: "Tudo certo. Veja rastreio sempre no app, nunca por link de SMS.",
    usaIA: false,
    dificuldade: "medio",
    publico: "todos"
  },

  {
    id: "codigo-que-voce-pediu",
    canal: "sms",
    remetente: "SMS do aplicativo",
    visual: { hora: "20:07" },
    contexto: "Você trocou de celular e está instalando o WhatsApp de novo. A tela do aplicativo está pedindo o código neste momento.",
    texto: "482-193 é o seu código de verificação. Não compartilhe este código com ninguém.",
    textoSimples: "482-193 é o seu código. Não passe para ninguém.",
    resposta: "seguro",
    sinais: [
      "Foi você que pediu, agora, na tela do seu aparelho.",
      "O código é para você DIGITAR no aplicativo, não para repassar.",
      "A própria mensagem avisa: não compartilhe.",
      "Ninguém entrou em contato pedindo nada."
    ],
    fazer: "Digite o código só na tela do aplicativo. Se um dia chegar um código que você NÃO pediu, é sinal de que alguém está tentando entrar na sua conta: não passe para ninguém, nem para parente.",
    fazerSimples: "Digite o código no aplicativo. Nunca mande o código para outra pessoa.",
    usaIA: false,
    dificuldade: "dificil",
    publico: "todos"
  }
];
