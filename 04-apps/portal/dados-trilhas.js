/*
 * Conteúdo do PORTAL (tela de atração + 4 trilhas).
 * Edite os textos à vontade. Campos terminados em "Simples" são usados no modo "Letras maiores"
 * (criança/idoso) quando existirem.
 *
 * Caminhos de mídia são relativos a 04-apps/portal/. A mídia do instrutor (voz, vídeo, música)
 * fica em 05-apresentacao/midia/ — veja 05-apresentacao/midia/LISTA-DE-MIDIA.md.
 * Se um arquivo faltar, o portal mostra um aviso no lugar e continua funcionando.
 */
(function () {
  var M = "../../05-apresentacao/midia/";

  window.TRILHAS_PORTAL = {
    ordem: ["perigos", "generativa", "produtividade", "incriveis"],

    // Cartelas que giram a cada 8 s quando ninguém está usando o computador
    ocioso: [
      { imagem: M + "rostos/rosto-10.jpg", icone: "🤖", titulo: "Essa pessoa não existe.", texto: "Uma IA inventou esse rosto. Você perceberia?" },
      { icone: "🛡️", titulo: "Golpe ou seguro?", texto: "Teste seu olho em 3 minutos." },
      { icone: "🎵", titulo: "Uma música feita por IA em 1 minuto", texto: "Veja o que dá pra criar de graça." },
      { icone: "🎤", proximoShow: true, texto: "Tópico de 8 minutos, ao vivo, aqui dentro." },
      { icone: "🆓", titulo: "Grátis · Sem cadastro · 5 minutos", texto: "Não precisa saber nada de computador." },
      { icone: "🗳️", titulo: "Propaganda eleitoral feita com IA tem de vir com aviso.", texto: "É regra do TSE. Vídeo bombástico e urgente? Confira antes de compartilhar." }
    ],

    trilhas: {

      /* =============================================================== */
      perigos: {
        descricao: "Voz, rosto e mensagem falsos: aprenda a regra que te protege.",
        duracao: "10 min",
        ver: [
          {
            titulo: "Quem dessas pessoas existe?",
            texto: "Olhe com calma. Alguma delas é de verdade?",
            galeria: [M + "rostos/rosto-09.jpg", M + "rostos/rosto-12.jpg", M + "rostos/rosto-10.jpg",
                      M + "rostos/rosto-11.jpg", M + "rostos/rosto-13.jpg", M + "rostos/rosto-05.jpg"],
            botaoRevelar: "Ver a resposta",
            revelarTitulo: "Nenhuma existe!",
            revelar: "Todas foram inventadas por uma IA em segundos. Golpistas usam rostos assim em perfis falsos de namoro, de vendedor e de \"atendente do banco\". Foto não é prova.",
            revelarSimples: "Todas foram feitas por computador. Foto não prova que a pessoa existe."
          },
          {
            titulo: "Escute esta voz",
            texto: "É a voz do instrutor pedindo um Pix para a mãe. Use o fone, se tiver.",
            audio: M + "voz-clonada-golpe.mp3",
            emoji: "📞",
            transcricao: "“Mãe, sou eu. Troquei de número, meu celular quebrou. Preciso de um Pix agora, depois eu explico.”",
            botaoRevelar: "Qual é o truque?",
            revelarTitulo: "Ele nunca disse isso!",
            revelar: "Um site copiou a voz dele a partir de uma gravação curta — podia ser tirada de qualquer vídeo na internet. Seu ouvido não é suficiente para descobrir. Você precisa de uma regra — ela está no final desta trilha.",
            revelarSimples: "Um computador copiou a voz dele. Não dá pra confiar só no ouvido."
          },
          {
            titulo: "E em vídeo também",
            texto: "Rosto e voz podem ser imitados em vídeo. Famosos, médicos e jornalistas já apareceram em anúncios falsos vendendo remédio e \"investimento\".",
            textoSimples: "Dá pra fazer vídeo falso de qualquer pessoa, até de gente famosa.",
            video: M + "deepfake-instrutor.mp4",
            nota: "Perto da eleição: propaganda eleitoral feita com IA tem de vir com aviso (regra do TSE), para qualquer candidato. Vídeo bombástico e urgente? Confira antes de compartilhar."
          }
        ],
        fazer: {
          app: "detector-de-golpes",
          emoji: "🕵️",
          titulo: "Golpe ou seguro?",
          texto: "Mensagens de WhatsApp, SMS, ligação e anúncio. Você decide: é golpe ou é seguro?",
          textoSimples: "Leia a mensagem e diga: é golpe ou é seguro?",
          botao: "Jogar agora",
          duracao: "5 minutos"
        },
        levar: {
          fraseChave: "Pediu dinheiro com pressa? Desliga e liga de volta pro número de sempre.",
          regra: {
            titulo: "A regra contra golpe",
            linhas: ["PRESSA?", "DESLIGA", "LIGA DE VOLTA", "PERGUNTA A PALAVRA"],
            rodape: "Senha e código: ninguém pede, ninguém dá."
          },
          dicas: [
            "Hoje ainda: combine uma palavra secreta com sua família.",
            "Caiu num golpe de Pix? Avise o banco na hora e peça a contestação no app (MED)."
          ],
          // ids de 04-apps/shared/dados-ferramentas.js (catálogo verificado)
          ferramentas: ["teste-phishing-jigsaw", "which-face-is-real"]
        }
      },

      /* =============================================================== */
      generativa: {
        descricao: "Imagem, música e vídeo de graça: aprenda a pedir do jeito certo.",
        duracao: "8 min",
        ver: [
          {
            titulo: "O segredo está no pedido",
            texto: "Mesma IA, dois pedidos. Veja a diferença.",
            comparar: [
              { rotulo: "Pedido vago", pedido: "“Um cachorro.”", imagem: M + "pedido/cachorro-ruim.jpg" },
              { rotulo: "Pedido detalhado", pedido: "“Foto realista de um vira-lata caramelo sentado na frente de uma catedral, numa cidade brasileira, ao pôr do sol.”", imagem: M + "pedido/cachorro-bom.jpg" }
            ]
          },
          {
            titulo: "Uma música em 1 minuto",
            texto: "Letra, voz e instrumentos: tudo criado por IA a partir de uma frase.",
            audio: M + "musica-01.mp3",
            emoji: "🎵",
            transcricao: "Pedido usado: “Sertanejo alegre sobre a turma da Carreta da Inovação em Londrina numa manhã de sábado.”"
          },
          {
            titulo: "O que dá pra criar de graça",
            texto: "🖼️ Imagem: descreva e ela desenha.  🎵 Música: diga o estilo e o tema.  🎬 Vídeo curto: descreva a cena.  🗣️ Voz: o texto vira fala.",
            emoji: "🎨",
            nota: "Cuidado: tudo que você digita vai para uma empresa. Não coloque documento, dado de cliente ou foto de criança."
          }
        ],
        fazer: {
          app: "monte-seu-pedido",
          emoji: "🎨",
          titulo: "Monte seu pedido de imagem",
          texto: "Escolha o assunto, o estilo e o lugar — e veja a imagem que a IA criou com o seu pedido.",
          botao: "Montar meu pedido",
          duracao: "3 minutos"
        },
        levar: {
          fraseChave: "Descreva o que você quer como se fosse pra um desenhista que não te conhece.",
          regra: {
            titulo: "Pedido de imagem que funciona",
            linhas: ["O QUÊ", "QUE ESTILO", "ONDE", "QUE DETALHES"],
            rodape: "Ex.: “pintura a óleo de um gato astronauta no espaço, cores vivas”."
          },
          dicas: [
            "Vai usar no seu negócio? Leia a licença da ferramenta.",
            "A mesma tecnologia que faz sua música faz a voz falsa do golpe."
          ],
          ferramentas: ["duck-ai", "bing-image-creator"]
        }
      },

      /* =============================================================== */
      produtividade: {
        descricao: "Peça do jeito certo e confira: a IA vira sua assistente.",
        duracao: "10 min",
        ver: [
          {
            titulo: "Pedido ruim × pedido bom",
            texto: "A IA não adivinha o que você quer. Quem pede melhor, recebe melhor.",
            comparar: [
              { rotulo: "Pedido ruim", pedido: "“Faz um texto pra vender pastel.”",
                resultado: "“Venha provar nosso delicioso pastel! Sabor e qualidade que você merece.” Serve pra qualquer lugar — ou seja, pra nenhum." },
              { rotulo: "Pedido bom", pedido: "“Você é um vendedor de feira experiente. Escreva 3 frases curtas para o Instagram de uma pastelaria de família em Londrina, para quem almoça no centro. Use emoji, até 15 palavras cada.”",
                resultado: "“Pastel de carne quentinho no seu horário de almoço 🥟⏱️ Pronto em 5 minutos!”" }
            ]
          },
          {
            titulo: "Saber PEDIR",
            texto: "P — Papel: quem ela deve ser.  E — Explique a tarefa.  D — Detalhe o contexto.  I — Indique o formato.  R — Revise: melhore e confira.",
            emoji: "✍️",
            nota: "Molde: “Você é ___. Preciso de ___. É para ___. Entregue como ___.”"
          },
          {
            titulo: "A IA erra com confiança",
            texto: "Pedimos a uma IA: “um relógio marcando 6h30” e “uma mão aberta”. Olhe bem.",
            galeria: [M + "ia-erra/relogio.jpg", M + "ia-erra/mao.jpg", M + "ia-erra/placa.jpg"],
            botaoRevelar: "O que está errado?",
            revelarTitulo: "Ela imita, não sabe",
            revelar: "Horário errado, dedos a mais, letras trocadas. Com texto acontece igual: nome, número, data, remédio e lei — você sempre confere em outra fonte."
          }
        ],
        fazer: {
          app: "mestre-do-prompt",
          emoji: "🚀",
          titulo: "Monte um pedido em 5 cliques",
          texto: "Escolha papel, tarefa, contexto e formato. Veja a resposta — e ache o erro que a IA cometeu.",
          botao: "Montar meu pedido",
          duracao: "5 minutos"
        },
        levar: {
          fraseChave: "IA boa é IA bem pedida — e conferida.",
          regra: {
            titulo: "Saber PEDIR",
            linhas: ["Papel · Explique a tarefa", "Detalhe o contexto", "Indique o formato · Revise"],
            rodape: "Você é ___. Preciso de ___. É para ___. Entregue como ___."
          },
          dicas: [
            "IA no seu bolso: Meta AI no WhatsApp (o círculo azul e roxo) e o app do Google.",
            "Não cole senha, documento ou dado de cliente na conversa."
          ],
          ferramentas: ["chatgpt-sem-login", "duck-ai"]
        }
      },

      /* =============================================================== */
      incriveis: {
        descricao: "Coisas que só a IA faz — e como ela \"pensa\" de verdade.",
        duracao: "8 min",
        ver: [
          {
            titulo: "Ela aprendeu com milhões de desenhos",
            texto: "No Quick, Draw!, do Google, você desenha e a IA adivinha o que é em 20 segundos. Ela aprendeu vendo desenhos de gente do mundo inteiro.",
            textoSimples: "Você desenha e o computador adivinha o que é. Ele aprendeu vendo muitos desenhos.",
            emoji: "✏️"
          },
          {
            titulo: "Você ensina, ela aprende",
            texto: "Mostre 30 fotos de uma mão fazendo \"joinha\" e o computador aprende a reconhecer. É assim que se ensina uma IA a achar doenças em exames ou reconhecer plantas pelo celular.",
            emoji: "👍",
            nota: "Isso é o Teachable Machine, do Google: grátis, sem cadastro. Dá pra testar em casa, num computador com câmera."
          },
          {
            titulo: "Já está no seu bolso",
            texto: "Aponte a câmera e descubra o nome da planta. Grave o canto e descubra o pássaro. Converse com alguém de outro idioma. E na ciência, a IA AlphaFold previu a forma de mais de 200 milhões de proteínas — e virou Prêmio Nobel de Química em 2024.",
            textoSimples: "O celular já descobre nome de planta, de passarinho e traduz conversa.",
            emoji: "🌿"
          }
        ],
        fazer: {
          app: "proxima-palavra",
          emoji: "🧠",
          titulo: "Seja o ChatGPT por 3 minutos",
          texto: "Descubra como a IA escolhe cada palavra — e por que às vezes inventa coisas.",
          botao: "Começar",
          duracao: "3 minutos"
        },
        levar: {
          fraseChave: "O computador não sabe — ele chuta a próxima palavra muito bem.",
          regra: {
            titulo: "3 para brincar em casa",
            linhas: ["Quick, Draw!", "Which Face Is Real", "Pl@ntNet (plantas)"],
            rodape: "Grátis. Criança, sempre com um adulto por perto."
          },
          dicas: [
            "Por \"chutar\" palavras, a IA pode inventar. Informação importante: confira."
          ],
          // Mesmos sites da lista "3 para brincar em casa" (Teachable Machine não funciona bem no celular)
          ferramentas: ["quick-draw", "plantnet"]
        }
      }
    }
  };
})();
