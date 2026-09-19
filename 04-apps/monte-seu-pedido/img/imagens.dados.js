/*
 * Rótulos e ícones em pt-BR das 27 imagens de "Monte seu pedido".
 * app.js lê window.IMAGENS_PEDIDO.{assuntos,estilos,lugares} = [{id, rotulo, icone}, ...]
 * e usa esses valores só para sobrescrever rotulo/icone do padrão interno (as frases do pedido
 * continuam vindo do PADRAO definido em app.js). O campo "ingles" é só documentação (o app não lê).
 * Nomes de arquivo (formato que o app monta): img/<assunto>-<estilo>-<lugar>.jpg
 */
window.IMAGENS_PEDIDO = {
  assuntos: [
    { id: "cachorro", rotulo: "Cachorro caramelo",    icone: "🐕", ingles: "a caramel colored mixed-breed dog" },
    { id: "bolo",     rotulo: "Bolo de aniversário",  icone: "🎂", ingles: "a colorful birthday cake with candles and frosting" },
    { id: "robo",     rotulo: "Robô simpático",       icone: "🤖", ingles: "a friendly cute round robot character" }
  ],
  estilos: [
    { id: "foto",    rotulo: "Foto realista",   icone: "📷", ingles: "realistic smartphone photo" },
    { id: "pintura", rotulo: "Pintura a óleo",  icone: "🖌️", ingles: "oil painting with visible brush strokes" },
    { id: "desenho", rotulo: "Desenho animado", icone: "✏️", ingles: "colorful cartoon illustration for kids" }
  ],
  lugares: [
    { id: "praia",  rotulo: "Na praia",          icone: "🏖️", ingles: "on a sunny beach" },
    { id: "cidade", rotulo: "Na cidade à noite", icone: "🌃", ingles: "on a city street at night with lights" },
    { id: "espaco", rotulo: "No espaço",         icone: "🚀", ingles: "floating in outer space among planets and stars" }
  ]
};
