// Base simulada de HQs.
// Em um produto real, estes dados viriam de uma API ou banco de dados.
export const comics = [
  {
    id: 1,
    title: "Cidade Neon",
    author: "Lia Rocha",
    price: 0,
    level: "Lendário",
    genre: "Cyberpunk",
    coverUrl: "https://placehold.co/360x520/101827/18d6c7/png?text=Cidade+Neon"
  },
  {
    id: 2,
    title: "Guardião da Aurora",
    author: "Mateus Koda",
    price: 18,
    level: "Mestre",
    genre: "Fantasia",
    coverUrl: "https://placehold.co/360x520/172033/ffca3a/png?text=Guardiao+da+Aurora"
  },
  {
    id: 3,
    title: "Rua 47",
    author: "Bia Alves",
    price: 0,
    level: "Em Ascensão",
    genre: "Drama",
    coverUrl: "https://placehold.co/360x520/1d1822/ff595e/png?text=Rua+47"
  },
  {
    id: 4,
    title: "Mar de Tinta",
    author: "Noah Silva",
    price: 12,
    level: "Iniciante",
    genre: "Aventura",
    coverUrl: "https://placehold.co/360x520/142019/8ac926/png?text=Mar+de+Tinta"
  },
  {
    id: 5,
    title: "Ordem dos Astros",
    author: "Clara Voss",
    price: 25,
    level: "Lendário",
    genre: "Fantasia",
    coverUrl: "https://placehold.co/360x520/191326/7b2cbf/png?text=Ordem+dos+Astros"
  },
  {
    id: 6,
    title: "Último Quadro",
    author: "Ravi Torres",
    price: 8,
    level: "Em Ascensão",
    genre: "Mistério",
    coverUrl: "https://placehold.co/360x520/101827/4361ee/png?text=Ultimo+Quadro"
  },
  {
    id: 7,
    title: "Robôs de Domingo",
    author: "Nina Campos",
    price: 0,
    level: "Mestre",
    genre: "Comédia",
    coverUrl: "https://placehold.co/360x520/21180f/f77f00/png?text=Robos+de+Domingo"
  },
  {
    id: 8,
    title: "Vale das Máscaras",
    author: "Iago Mendes",
    price: 16,
    level: "Iniciante",
    genre: "Fantasia",
    coverUrl: "https://placehold.co/360x520/101c24/00bbf9/png?text=Vale+das+Mascaras"
  },
  {
    id: 9,
    title: "Motor Fantasma",
    author: "Tainá Lima",
    price: 30,
    level: "Lendário",
    genre: "Ação",
    coverUrl: "https://placehold.co/360x520/241421/f15bb5/png?text=Motor+Fantasma"
  },
  {
    id: 10,
    title: "Jardim Submerso",
    author: "Eric Nunes",
    price: 0,
    level: "Iniciante",
    genre: "Fantasia",
    coverUrl: "https://placehold.co/360x520/10211e/06d6a0/png?text=Jardim+Submerso"
  },
  {
    id: 11,
    title: "Arquivo Prisma",
    author: "Malu Dias",
    price: 10,
    level: "Em Ascensão",
    genre: "Sci-fi",
    coverUrl: "https://placehold.co/360x520/24151a/ef476f/png?text=Arquivo+Prisma"
  },
  {
    id: 12,
    title: "Nuvem de Papel",
    author: "João Mirai",
    price: 0,
    level: "Iniciante",
    genre: "Slice of Life",
    coverUrl: "https://placehold.co/360x520/241f12/ffd166/png?text=Nuvem+de+Papel"
  }
];

// Perguntas e respostas simuladas para o componente de comunidade.
export const communityThreads = [
  {
    id: 1,
    questionAuthor: "Noah Silva",
    questionLevel: "Iniciante",
    question: "Como faço para criar uma capa que chame atenção sem parecer poluída?",
    answerAuthor: "Clara Voss",
    answerLevel: "Lendário",
    answer: "Escolha uma silhueta forte, limite a paleta e deixe o título respirar. A capa precisa vender uma promessa visual em poucos segundos."
  },
  {
    id: 2,
    questionAuthor: "Iago Mendes",
    questionLevel: "Iniciante",
    question: "Vale publicar capítulos curtos toda semana ou esperar um volume maior?",
    answerAuthor: "Mateus Koda",
    answerLevel: "Mestre",
    answer: "Para começar, capítulos curtos ajudam a criar ritmo e receber feedback. Depois, você pode organizar tudo em arcos maiores."
  },
  {
    id: 3,
    questionAuthor: "João Mirai",
    questionLevel: "Iniciante",
    question: "Como lidar com poucos leitores no começo?",
    answerAuthor: "Nina Campos",
    answerLevel: "Mestre",
    answer: "Trate cada leitor como comunidade. Responda comentários, mostre processo e mantenha consistência antes de perseguir números grandes."
  }
];
