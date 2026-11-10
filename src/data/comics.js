// Base simulada de HQs.
// Em um produto real, estes dados viriam de uma API ou banco de dados.
import sampleComicPage from "../assets/sonhos-da-pandemia.png";
import secondSampleComicPage from "../assets/Confissão Entre Pétalas e Livros.png";

export const comics = [
  {
    id: 1,
    title: "Confissão Entre Pétalas e Livros",
    author: "HQLivre",
    price: 0,
    level: "Lendário",
    genre: "Romance",
    coverUrl: sampleComicPage,
    pages: [
      {
        imageUrl: sampleComicPage,
        balloons: [
          { type: "narration", x: 2.3, y: 1.6, width: 24, height: 9.2, text: "Às vezes, a vida nos surpreende nos lugares mais simples..." },
          { x: 2, y: 31.8, width: 12.5, height: 7.2, text: "Ah..." },
          { x: 2.5, y: 38.5, width: 11.7, height: 5.1, text: "É você..." },
          { x: 87.6, y: 17.4, width: 11.4, height: 9, text: "Oi!" },
          { x: 83.7, y: 26.4, width: 15, height: 14.4, text: "Já faz tempo, não é?" },
          { x: 2.8, y: 45.8, width: 13, height: 7, text: "É... sim." },
          { x: 2.6, y: 52.9, width: 14.6, height: 12.8, text: "Mas... como você soube que eu estava aqui?" },
          { x: 79.1, y: 44.6, width: 19.6, height: 20.3, text: "Ah, eu só passava por aqui... e vi você saindo da biblioteca." },
          { x: 0, y: 66.5, width: 17, height: 11.1, text: "...E eu fiquei feliz de verdade." },
          { x: 0, y: 78.6, width: 16.3, height: 14.8, text: "Então... quer ir comigo?" },
          { x: 85.3, y: 66.8, width: 14.5, height: 13.9, text: "Claro...!" },
          { type: "narration", x: 77.3, y: 87.8, width: 21.3, height: 8.9, text: "...para transformar um reencontro em algo ainda maior." }
        ]
      },
      {
        imageUrl: secondSampleComicPage,
        balloons: [
          { x: 2.3, y: 13.7, width: 11, height: 8.7, text: "Sim..." },
          { x: 79.2, y: 1, width: 20.6, height: 17, text: "Então... você realmente quer saber o que eu sinto?" },
          { x: 1.8, y: 27.5, width: 21.7, height: 23.4, text: "Eu gosto de você, de verdade. Desde o dia em que te conheci..." },
          { x: 78.2, y: 27.2, width: 21.1, height: 23.6, text: "...e não é só uma paixão passageira. Eu quero caminhar ao seu lado, sempre." },
          { x: 1.8, y: 53.3, width: 13.6, height: 12.3, text: "E-Eu também...!" },
          { x: 0, y: 68.4, width: 16.2, height: 12.3, text: "Eu gosto de você...!" },
          { x: 42.8, y: 70.2, width: 10.8, height: 8.9, text: "...Sim." },
          { x: 83.7, y: 51.4, width: 16.1, height: 11.8, text: "Então... ficamos juntos?" },
          { type: "narration", x: 2.5, y: 85, width: 29.3, height: 6.3, text: "E assim, entre livros, sonhos e um futuro pela frente..." },
          { type: "narration", x: 73.4, y: 85.8, width: 24.5, height: 7.6, text: "...começou a nossa mais bonita história." },
          { type: "narration", x: 89.8, y: 94.4, width: 8.3, height: 3.9, text: "Fim." }
        ]
      }
    ]
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
