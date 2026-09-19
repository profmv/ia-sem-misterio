/*
 * DADOS DAS TELAS DOS 4 TÓPICOS — lidos por 05-apresentacao/slides.html (abrir slides.html?show=1 … ?show=4; o parâmetro continua se chamando show).
 * Ordem oficial (plano-mestre 4.1): 10:15 tópico 1 · 10:45 tópico 2 · 11:15 tópico 3 · 11:45 tópico 4 · 12:15 tópico 1 (bis).
 * Roteiros literais: 02-roteiros/02-show-1-golpes.md … 05-show-4-impossivel.md (arquivos mantêm o nome antigo).
 * Caminhos de mídia relativos a 05-apresentacao/. Lista completa: midia/LISTA-DE-MIDIA.md.
 * Tipos: audio, video, imagens, frase, regra, comparar, chamada. Máx. 6 telas por tópico.
 * Opções extras: imagens.revelarSozinho (ao revelar, some título+legenda) · audio.mostrarTranscricao (letra visível durante o áudio) · video.alternativa (linhas exibidas se o vídeo faltar).
 * Textos de tela ≤ 12 palavras (transcricao e linhas são exceção). "notas" = fala-guia para o instrutor (não aparece na tela).
 * [NOME] (se aparecer) é trocado pelo primeiro nome do instrutor de config.js.
 * Notas (tecla N) ficam numa camada separada: abrir/fechar não interrompe áudio/vídeo (corrigido 17/09).
 * Números de aba = ordem do 07-scripts/ABRIR-palco.bat
 * (1 painel · 2–5 slides · 6 portal · 7 Which Face · 8 duck.ai · 9 Suno · 10 Gemini · 11 Teachable Machine · 12 Quick, Draw! · 13 Content Credentials · 14 Próxima Palavra modo palco).
 */
window.SHOWS = {
  "1": {
    titulo: "Golpe com IA: como te enganam e como escapar",
    trilha: "perigos",
    telas: [
      {
        tipo: "audio",
        titulo: "Escuta.",
        midia: "midia/voz-clonada-golpe.mp3",
        transcricao: "Mãe, sou eu. Troquei de número, meu celular quebrou. Preciso de um Pix agora, depois eu explico.",
        notas: "Play antes de cumprimentar. 2 s de silêncio. Se o áudio foi clonado da SUA voz: 'Essa voz é minha. Eu nunca gravei essa frase.' Se é a voz sintética padrão: 'Essa voz não existe: um computador fez em segundos, de graça.' Se o som falhar: lê a transcrição em tom de pressa."
      },
      {
        tipo: "frase",
        titulo: "Pressa + segredo + dinheiro",
        texto: "A receita é velha. A IA só deixou barato.",
        notas: "Pergunta: 'quais são os três ingredientes?' Se ninguém: 'pressa'. Número: 258 golpes por hora no Brasil (Anuário FBSP 2026). 'Segundo uma empresa de segurança', quase metade das fraudes financeiras já usa IA (VU, 15/09/2026 — dado privado)."
      },
      {
        tipo: "imagens",
        titulo: "Quem dessas pessoas existe?",
        midia: [
          "midia/rostos/rosto-09.jpg",
          "midia/rostos/rosto-12.jpg",
          "midia/rostos/rosto-10.jpg",
          "midia/rostos/rosto-11.jpg",
          "midia/rostos/rosto-13.jpg",
          "midia/rostos/rosto-05.jpg"
        ],
        revelar: "Nenhuma. Foto não é prova.",
        revelarSozinho: true,
        notas: "Diga em voz alta (não está mais no slide): 'Levanta a mão quem acha que pelo menos uma existe.' Espera mão. Revela (somem o título e a galeria fica só com a resposta). 6 rostos: 3 de thispersondoesnotexist.com (09, 10, 11), 2 fotos de IA recentes (12, 13) e 1 retrato de IA (05). Pistas nas antigas: fundo derretido — 'e as pistas estão sumindo': nas novas não há pista nenhuma. Perfil falso de namoro, vendedor, 'funcionário do banco'."
      },
      {
        tipo: "video",
        titulo: "Esse sou eu. Eu nunca disse isso.",
        midia: "midia/deepfake-instrutor.mp4",
        legenda: "SIMULAÇÃO",
        alternativa: ["Uma foto sua.", "Um minuto da sua voz.", "Um vídeo dizendo o que você nunca disse."],
        notas: "20 s. Olha o público, não a tela. Casos com fonte: Gisele/kit anti-rugas (CNN, 2025); Mion/Outback (Correio Braziliense, 2025); médicos falsos (NetLab/UFRJ). Eleição: só a regra — vídeo bombástico + urgência = confere; propaganda com IA tem aviso, golpista não põe. ZERO nome de candidato. Plano B: midia/deepfake-print.jpg."
      },
      {
        tipo: "regra",
        titulo: "A regra",
        linhas: ["PRESSA?", "DESLIGA", "LIGA DE VOLTA", "PERGUNTA A PALAVRA"],
        rodape: "Senha e código: ninguém pede, ninguém dá.",
        notas: "Ler junto, apontando. Desliga = no WhatsApp, para de responder. Liga de volta = número da agenda / atrás do cartão. 'Combinem a palavra no almoço.' Depois, quiz A/B pelo Explorador: voz-real.mp3 × voz-clonada-neutra.mp3 (no bis, inverte). 'Muita gente erra; regra, não ouvido.' MED: app do banco, 'contestar Pix', até 80 dias contados do Pix, quanto antes melhor; guarda prints."
      },
      {
        tipo: "chamada",
        titulo: "Leve para casa",
        texto: "Foto não é prova. Voz não é prova. Regra é prova.",
        notas: "Cartão na saída (regra na frente, PEDIR atrás). QR = material + aula gratuita [DIA], só quem quiser; ninguém entra em grupo. 'Senta num computador vermelho: Golpe ou seguro?' Próximo tópico 10:45 (no bis: 'último tópico; PCs abertos até 12:30')."
      }
    ]
  },

  "2": {
    titulo: "Crie algo em 2 minutos",
    trilha: "generativa",
    telas: [
      {
        tipo: "frase",
        titulo: "Vamos compor uma música. Agora.",
        texto: "Sertanejo, funk ou rock? Três primeiros nomes.",
        notas: "'Quem já compôs uma música?' Grito decide o estilo. 3 primeiros nomes, só adulto. Cola o pedido-molde no gerador (Gemini 'Criar música', aba 10; ou Suno, aba 9) e dispara. Diz em voz alta: 'isso foi pra um computador de uma empresa lá fora; por isso só o primeiro nome'. Sem internet: 'trouxe uma pronta de ontem'."
      },
      {
        tipo: "imagens",
        titulo: "Ninguém desenhou. Ninguém fotografou.",
        midia: [
          "midia/pedido/galeria-cartao-aniversario.jpg",
          "midia/pedido/galeria-logo-pastelaria.jpg",
          "midia/pedido/galeria-carreta-noite.jpg",
          "midia/pedido/galeria-gato-astronauta.jpg"
        ],
        legenda: "Segundos cada. Grátis. Pedido escrito em português.",
        notas: "Aponta uma a uma: cartão de aniversário, logo de pastelaria inventada, bonde numa rua à noite, gato astronauta (tipo de pedido que criança adora). 'Não é código, é português.' Sites grátis no material do QR do cartão. Também música, voz e vídeo — 'quem viu o tópico anterior me viu dizendo o que nunca disse'."
      },
      {
        tipo: "comparar",
        titulo: "O segredo é o pedido",
        esquerda: {
          rotulo: "Faz um cachorro",
          texto: "Um cachorro qualquer. Banco de imagem.",
          midia: "midia/pedido/cachorro-ruim.jpg"
        },
        direita: {
          rotulo: "Vira-lata caramelo, catedral, pôr do sol",
          texto: "Foto realista. Cidade brasileira. Luz de fim de tarde.",
          midia: "midia/pedido/cachorro-bom.jpg"
        },
        notas: "Não diga 'Catedral de Londrina': a imagem é uma catedral inventada. 'Mesma ferramenta, mesmo dia. Mudou o pedido.' Dica única: descreva como para um desenhista que nunca te viu — o quê, como, onde, com que luz. Pergunta: 'e de chapéu de festa?' → 'com chapéu de festa', só isso; é conversa."
      },
      {
        tipo: "regra",
        titulo: "Três avisos",
        linhas: [
          "Tudo que você digita vai pra uma empresa lá fora",
          "Pra usar no negócio, olhe a licença do plano",
          "A mesma tecnologia faz a voz falsa do golpe"
        ],
        rodape: "Quem cria também precisa saber desconfiar.",
        notas: "1: nada de cliente, documento, exame, foto de criança; dá pra desligar 'usar minhas conversas' e usar modo temporário. 2: festa e igreja pode; vender, plano pago; música do plano grátis = uso pessoal. 3: não existe 'IA do bem' e 'do mal'; existe quem usa."
      },
      {
        tipo: "audio",
        titulo: "A música de vocês",
        midia: "midia/musica-01.mp3",
        mostrarTranscricao: true,
        transcricao: "LETRA_MUSICA_PLACEHOLDER",
        notas: "Confere o gerador (aba 10 Gemini / aba 9 Suno). Pronta e boa → toca de lá, 40 s, 'estreia mundial'. Não pronta / ruim / nome errado → 'a IA erra; vamos com a de ontem' → este arquivo. Silêncio durante a música. Depois: 'faz dois anos custava um estúdio'. Se ficou ruim, pede de novo: 'mais lenta', 'tira o meio'."
      },
      {
        tipo: "chamada",
        titulo: "Leve para casa",
        texto: "Descreva como para um desenhista que nunca te viu.",
        notas: "PC roxo: monte seu pedido de imagem em 3 cliques e leve pro celular. Criança pede com o adulto do lado, sem foto dela. Cartão: fórmula atrás. QR: ferramentas grátis (com/sem cadastro) + aula gratuita [DIA]. Próximo tópico 11:15: 'o problema não é a IA, é o pedido'."
      }
    ]
  },

  "3": {
    titulo: "Use IA melhor que a maioria",
    trilha: "produtividade",
    telas: [
      {
        tipo: "frase",
        titulo: "Resposta meia-boca?",
        texto: "Não era a IA. Era o pedido.",
        notas: "'Quem já achou a resposta genérica, com cara de robô?' Espera mão. 'Provo em 60 segundos.' Promete: fórmula de 5 letras, a IA errando na frente deles, e a IA que já está no celular."
      },
      {
        tipo: "comparar",
        titulo: "Pedido ruim × pedido bom",
        // Textos já no slide (respostas geradas por IA). Se o instrutor fizer prints no duck.ai,
        // pode acrescentar midia: "midia/pedido/ruim.jpg" / "midia/pedido/bom.jpg" (opcional).
        esquerda: {
          rotulo: "“Faz um texto pra vender pastel.”",
          texto: "“Venha experimentar nosso delicioso pastel! Ingredientes selecionados e muito carinho. Qualidade e sabor que você merece!” → Serve pra qualquer pastelaria. Ou seja: nenhuma."
        },
        direita: {
          rotulo: "Vendedor de feira · 3 frases · Londrina · almoço · emoji",
          texto: "“🥟 Pastel de carne quentinho, pronto em 5 minutos pro seu almoço!” · “⏰ Saiu do trabalho? Seu pastel já tá na chapa.” · “❤️ Receita da família, aqui no centro de Londrina.” → Mesma IA. Pedido diferente."
        },
        notas: "Lê 2 frases da ruim em tom monótono; lê as 3 boas com energia. 'Alguém compraria esse pastel?' O que faltou no ruim: quem é, pra quem, onde. 'Ela não pergunta: preenche com o mais comum.' Pastelaria inventada: Pastel da Nona."
      },
      {
        tipo: "regra",
        titulo: "Saber PEDIR",
        linhas: [
          "P — Papel: quem ela é",
          "E — Explique a tarefa",
          "D — Detalhe o contexto",
          "I — Indique o formato",
          "R — Revise: refine e confira"
        ],
        rodape: "Você é ___. Preciso de ___. É para ___. Entregue como ___.",
        notas: "Aponta linha a linha com exemplo: 'vendedor experiente' / '3 frases pro Instagram' / 'Londrina, almoço, trabalhador' / 'lista, 15 palavras, com emoji'. 'Se você não diz, ela escolhe o mais comprido.' Funciona pra e-mail, contrato, sogra, geladeira, carta do INSS. '30 segundos a mais no pedido.'"
      },
      {
        tipo: "imagens",
        titulo: "A IA erra na sua frente",
        midia: [
          "midia/ia-erra/relogio.jpg",
          "midia/ia-erra/mao.jpg",
          "midia/ia-erra/placa.jpg"
        ],
        legenda: "Pedi: relógio às 6h30 · uma mão · placa em português",
        revelar: "Ela não sabe. Ela imita.",
        notas: "'Que horas marca?' (10h10 — hora das fotos de propaganda). 'Conta os dedos.' 'Lê a placa.' Revela. Depois, Alt+Tab para midia/ia-erra/texto-01.png: erro em fato de Londrina (só se pré-testado). 'Estagiário brilhante que nunca admite que não sabe.' Regra do R: nome, número e data — confere. 'De onde você tirou isso?'"
      },
      {
        tipo: "frase",
        titulo: "É conversa, não busca.",
        texto: "Refine: 'mais curto', 'sem emoji', 'de onde tirou isso?'",
        notas: "duck.ai (aba 8): cola o pedido bom → 'deixa mais curto e sem emoji' → 'coloca o nome: Pastel da Nona'. 'Eu respondi à resposta.' Sem internet: conta em 2 frases. IA no bolso: WhatsApp (círculo azul e roxo) e app do Google — sem instalar, sem pagar. 3 pedidos (estão no material do QR). Não cola senha, documento, exame."
      },
      {
        tipo: "chamada",
        titulo: "Leve para casa",
        texto: "IA boa é IA bem pedida — e conferida.",
        notas: "PC azul: pedido em 5 cliques + ache o erro escondido (< 30 s = melhor que a maioria). Comerciante: descrição de produto hoje; estudante: resumo; aposentado: carta do INSS. Cartão: fórmula atrás. QR: colinha com 8 pedidos + aula gratuita [DIA]. Próximo tópico 11:45: 'ensino o computador a reconhecer um joinha ao vivo'."
      }
    ]
  },

  "4": {
    titulo: "Veja o impossível",
    trilha: "incriveis",
    telas: [
      {
        tipo: "video",
        titulo: "Vou ensinar este computador. Ao vivo.",
        midia: "midia/teachable-machine.mp4",
        legenda: "Só a mão de um adulto. Nada fica salvo.",
        alternativa: ["1. Mostro 30 fotos de MÃO ABERTA", "2. Mostro 30 fotos de JOINHA", "3. Clico em TREINAR (20 segundos)", "4. Testo: ele acerta sozinho"],
        notas: "Com webcam + internet: Teachable Machine (aba 11), câmera na bancada, voluntário adulto, classes 'mão aberta' e 'joinha' (30 amostras cada), treinar 20 s, testar. Errou? 'Mostra mais exemplos.' Sem webcam/internet: toca este vídeo e narra por cima. 'Não expliquei o que é um dedo. Só mostrei exemplos.' Fecha a aba sem salvar."
      },
      {
        tipo: "frase",
        titulo: "Não programei. Mostrei exemplos.",
        texto: "Câncer em exame, placa no radar, planta pelo celular, minha voz.",
        notas: "Segredo de toda IA: exemplos, não regras. Perto deles: desbloqueio por rosto, filtro de spam, banco desconfiando de compra. 'E foi assim que imitaram minha voz: um minuto de mim. Mesmo truque, pro bem e pro mal.' 'Dado é exemplo — por isso as empresas querem os seus.'"
      },
      {
        tipo: "frase",
        titulo: "Ela não sabe. Ela chuta a próxima palavra.",
        texto: "Bilhões de textos. Uma palavra de cada vez.",
        notas: "'Era uma vez…' — a cabeça completa 'uma'. Vai para a aba 14 (proxima-palavra em modo palco, não reinicia) e clica em Começar. Usa as 3 frases do início: 'Parabéns pra…' (você), 'Bom dia, tudo…' (bem), 'Eu comprei um…' (barras parecidas = pouco contexto, ela chuta). Máquina com criatividade no máximo só se sobrar tempo. 'Repete de uma em uma até parecer que pensou.' Por isso inventa — lembra o relógio 10h10. 'A confiança dele não muda; o acerto muda.' Nome, número e data: confere."
      },
      {
        tipo: "imagens",
        titulo: "Não existia há cinco anos. Hoje é grátis.",
        midia: [
          "midia/incriveis/foto-restaurada.jpg",
          "midia/incriveis/traducao-voz.jpg",
          "midia/incriveis/descreve-mundo.jpg",
          "midia/incriveis/proteinas.jpg"
        ],
        legenda: "Foto restaurada · tradução ao vivo · descreve o mundo · proteínas",
        notas: "Uma a uma: foto do avô restaurada e colorida; fala português, ouve espanhol ao vivo; app que descreve o mundo pra quem não enxerga; forma de milhões de proteínas (remédio nasce disso). Mais: legenda automática, exame sem especialista, aviso de enchente. Lado ruim, sem nome/cidade: deepfake sexual em escola (SaferNet). 'Mesmo truque do joinha, com mais exemplos.'"
      },
      {
        tipo: "imagens",
        titulo: "Desenha. Ele adivinha.",
        midia: ["midia/incriveis/quick-draw.jpg"],
        legenda: "Ele aprendeu com 50 milhões de desenhos. Principalmente ruins.",
        revelar: "Ele chuta antes de você terminar.",
        notas: "Com internet: Quick, Draw! (aba 12) com criança + adulto ao lado, ou jovem; sem câmera. 1–2 rodadas, 60 s; lê os chutes em voz alta. Sem internet: imagem midia/incriveis/quick-draw.jpg + pasta midia/rostos ('essa pessoa existe?'), público vota. Ninguém quer? O instrutor desenha mal de propósito. 'Em casa: está no QR do cartão, grátis, sem cadastro.'"
      },
      {
        tipo: "chamada",
        titulo: "Leve para casa",
        texto: "O computador não sabe — ele chuta muito bem.",
        notas: "3 frases: aprende por exemplo; não sabe, chuta; chuta bem — por isso cria, erra com confiança e golpista usa. 'Vai dominar o mundo? Ela não quer nada; quem quer é quem aperta o botão.' PC verde: proxima-palavra. 3 sites (fim da trilha verde e QR do cartão): desenhos, rostos, plantas. QR + aula gratuita [DIA]. Último tópico 12:15: golpes — 'o mais importante dos cinco'."
      }
    ]
  }
};
