export const communities = [
  {
    id: 1,
    name: "Dicas de Roteiro",
    members: 12840,
    description: "Compartilhe estruturas, ritmo e soluções para transformar ideias em histórias memoráveis.",
    icon: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    privacy: "Pública",
    role: "Dono",
    owner: "Marta S.",
    topics: [
      { id: 1, title: "Como escrever um início que gera curiosidade", author: "Ravi Torres", date: "Hoje", replies: 42 },
      { id: 2, title: "O que fazer com uma sequência de capítulos", author: "Nina Campos", date: "2 dias", replies: 31 },
      { id: 3, title: "A estrutura ideal para um arco de 12 páginas", author: "Lia Rocha", date: "5 dias", replies: 18 }
    ]
  },
  {
    id: 2,
    name: "Eu tenho medo do hiatus",
    members: 6842,
    description: "Para quem sofre, comemora e tenta sobreviver ao ciclo de publicação de uma série.",
    icon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
    privacy: "Restrita",
    role: "Moderador",
    owner: "Caio Nunes",
    topics: [
      { id: 4, title: "Você não precisa desaparecer: uma estratégia de retorno", author: "Noah Silva", date: "Ontem", replies: 67 },
      { id: 5, title: "Como falar de uma pausa sem perder a atenção", author: "Bia Alves", date: "3 dias", replies: 24 }
    ]
  },
  {
    id: 3,
    name: "Roteiro em 30",
    members: 9350,
    description: "Um espaço colaborativo para autores iniciantes escrever, revisar e publicar em 30 dias.",
    icon: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80",
    privacy: "Pública",
    role: "Dono",
    owner: "Elisa Voss",
    topics: [
      { id: 6, title: "O primeiro mês de uma série: o que publicar", author: "João Mirai", date: "4 dias", replies: 54 },
      { id: 7, title: "Revisão de roteiro: o que cortar", author: "Malu Dias", date: "1 semana", replies: 29 }
    ]
  },
  {
    id: 4,
    name: "Arte e Literatura",
    members: 5210,
    description: "Artistas e leitores discutem referências, paletas, composição e a estética das HQs.",
    icon: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80",
    privacy: "Pública",
    role: "Moderador",
    owner: "Theo Lara",
    topics: [
      { id: 8, title: "Como construir uma composição para uma página", author: "Tainá Lima", date: "6 dias", replies: 36 },
      { id: 9, title: "Paletas que funcionam em cenas de tensão", author: "Eric Nunes", date: "2 semanas", replies: 16 }
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
