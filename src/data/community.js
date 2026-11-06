export const communities = [
  {
    id: 1,
    name: "Dicas de Roteiro",
    members: 12840,
    description: "Compartilhe estruturas, ritmo e soluções para transformar ideias em histórias memoráveis.",
    icon: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    privacy: "Pública",
    category: "Roteiro e escrita",
    role: "Dono",
    owner: "Marta S.",
    topics: [
      {
        id: 1, title: "Como escrever um início que gera curiosidade", author: "Ravi Torres", authorLevel: "Iniciante",
        date: "Hoje", replies: 2, kind: "question", answeredBy: { name: "Marta S.", level: "Mestre" },
        body: "Estou começando um roteiro de mistério. Como apresentar o conflito sem explicar tudo logo na primeira página?",
        responses: [
          { author: "Marta S.", level: "Mestre", body: "Comece por uma ação que levante uma pergunta. Você pode mostrar uma consequência estranha antes de revelar a causa." },
          { author: "Ravi Torres", level: "Iniciante", body: "Gostei da ideia de apresentar primeiro a consequência. Vou testar isso no roteiro!" }
        ]
      },
      {
        id: 2, title: "Vamos revisar os primeiros capítulos uns dos outros?", author: "Nina Campos", authorLevel: "Em Ascensão",
        date: "2 dias", replies: 31, kind: "collaboration",
        recruitment: ["Procura-se Ilustrador", "Roteirista Disponível"],
        body: "Quero formar um pequeno grupo para trocar feedback construtivo e revisar os começos das nossas histórias.",
        responses: [{ author: "Lia Rocha", level: "Mestre", body: "Topo participar! Posso revisar no fim de semana." }]
      },
      {
        id: 3, title: "Uma história precisa começar com ação?", author: "Lia Rocha", authorLevel: "Mestre",
        date: "5 dias", replies: 18, kind: "debate",
        body: "A abertura cheia de ação prende mais o leitor ou um momento silencioso pode ser igualmente forte?",
        responses: [{ author: "Caio Nunes", level: "Em Ascensão", body: "Para mim depende da promessa da história. Um silêncio carregado também cria expectativa." }]
      }
    ]
  },
  {
    id: 2,
    name: "Eu tenho medo do hiatus",
    members: 6842,
    description: "Para quem sofre, comemora e tenta sobreviver ao ciclo de publicação de uma série.",
    icon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
    privacy: "Restrita",
    category: "Publicação",
    role: "Moderador",
    owner: "Caio Nunes",
    topics: [
      { id: 4, title: "Você não precisa desaparecer: uma estratégia de retorno", author: "Noah Silva", authorLevel: "Lendário", date: "Ontem", replies: 67, kind: "debate", body: "Compartilhe estratégias para retomar uma série depois de uma pausa sem perder o vínculo com os leitores.", responses: [{ author: "Bia Alves", level: "Mestre", body: "Uma nota transparente e um cronograma realista ajudam muito." }] },
      { id: 5, title: "Como falar de uma pausa sem perder a atenção", author: "Bia Alves", authorLevel: "Iniciante", date: "3 dias", replies: 24, kind: "question", body: "Preciso pausar por algumas semanas. Como avisar sem deixar quem acompanha a série inseguro?", responses: [{ author: "Caio Nunes", level: "Lendário", body: "Explique o motivo que puder compartilhar e dê uma previsão honesta, mesmo que seja aproximada." }], answeredBy: { name: "Caio Nunes", level: "Lendário" } }
    ]
  },
  {
    id: 3,
    name: "Roteiro em 30",
    members: 9350,
    description: "Um espaço colaborativo para autores iniciantes escrever, revisar e publicar em 30 dias.",
    icon: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80",
    privacy: "Pública",
    category: "Desafios de escrita",
    role: "Dono",
    owner: "Elisa Voss",
    topics: [
      { id: 6, title: "O primeiro mês de uma série: o que publicar", author: "João Mirai", authorLevel: "Em Ascensão", date: "4 dias", replies: 54, kind: "collaboration", recruitment: ["Procura-se Ilustrador", "Roteirista Disponível"], body: "Vamos montar juntos um calendário de publicação sustentável para o primeiro mês?", responses: [{ author: "Malu Dias", level: "Mestre", body: "Podemos alternar páginas completas com pequenos extras de bastidores." }] },
      { id: 7, title: "Revisão de roteiro: o que cortar", author: "Malu Dias", authorLevel: "Mestre", date: "1 semana", replies: 29, kind: "question", body: "Como decidir se uma cena está desenvolvendo a história ou apenas repetindo uma informação?", responses: [{ author: "Elisa Voss", level: "Lendário", body: "Pergunte o que muda para o personagem entre o início e o fim da cena." }], answeredBy: { name: "Elisa Voss", level: "Lendário" } }
    ]
  },
  {
    id: 4,
    name: "Arte e Literatura",
    members: 5210,
    description: "Artistas e leitores discutem referências, paletas, composição e a estética das HQs.",
    icon: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80",
    privacy: "Pública",
    category: "Arte e ilustração",
    role: "Moderador",
    owner: "Theo Lara",
    topics: [
      { id: 8, title: "Como construir uma composição para uma página", author: "Tainá Lima", authorLevel: "Iniciante", date: "6 dias", replies: 36, kind: "question", body: "Tenho dificuldade em guiar o olhar entre os quadros. Que princípios ajudam a planejar a composição?", responses: [{ author: "Theo Lara", level: "Mestre", body: "Pense no caminho de leitura como uma sequência de contrastes de forma, escala e direção." }], answeredBy: { name: "Theo Lara", level: "Mestre" } },
      { id: 9, title: "Paletas que funcionam em cenas de tensão", author: "Eric Nunes", authorLevel: "Em Ascensão", date: "2 semanas", replies: 16, kind: "debate", body: "Tons saturados aumentam a tensão ou uma paleta reduzida cria mais desconforto?", responses: [{ author: "Tainá Lima", level: "Iniciante", body: "Uma paleta reduzida pode dar espaço para um único detalhe de cor se destacar." }] }
    ]
  }
];

export const fanarts = [
  { id: 1, title: "A guarda da aurora", artist: "Lina Park", likes: 284, comic: "Guardião da Aurora", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=700&q=80" },
  { id: 2, title: "Cidade em movimento", artist: "Milo Cruz", likes: 196, comic: "Cidade Neon", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80" },
  { id: 3, title: "O olhar do espaço", artist: "Sora N.", likes: 412, comic: "Ordem dos Astros", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=700&q=80" },
  { id: 4, title: "Noite de máscaras", artist: "Nami Vale", likes: 159, comic: "Vale das Máscaras", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80" },
  { id: 5, title: "A última estação", artist: "Davi K.", likes: 321, comic: "Último Quadro", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=700&q=80" },
  { id: 6, title: "Jardim secreto", artist: "Iris T.", likes: 247, comic: "Jardim Submerso", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80" }
];
