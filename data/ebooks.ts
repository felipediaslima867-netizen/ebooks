// data/ebooks.ts
// ✅ REVISADO — Gera 300 e-books com caminho correto para /downloads/ebook-XXX.pdf

export interface Ebook {
  id: string;          // ex: "ebook-001"
  title: string;
  description: string;
  category: string;
  price: number;       // em centavos (R$ 29,90 = 2990)
  coverImage: string;
  downloadUrl: string; // caminho público: /downloads/ebook-XXX.pdf
  slug: string;
}

// ─── Categorias disponíveis ───────────────────────────────────────────────────
const CATEGORIES = [
  "Marketing Digital",
  "Finanças Pessoais",
  "Desenvolvimento Pessoal",
  "Empreendedorismo",
  "Tecnologia",
  "Saúde e Bem-Estar",
  "Educação",
  "Culinária",
];

// ─── Títulos de amostra por categoria (cicla caso precise de mais) ────────────
const SAMPLE_TITLES: Record<string, string[]> = {
  "Marketing Digital": [
    "Tráfego Pago do Zero ao Avançado",
    "SEO na Prática",
    "Copywriting que Converte",
    "Instagram para Negócios",
    "E-mail Marketing Lucrativo",
  ],
  "Finanças Pessoais": [
    "Investindo com Segurança",
    "Saia das Dívidas em 12 Meses",
    "Independência Financeira Acelerada",
    "Renda Passiva Real",
    "Tesouro Direto para Iniciantes",
  ],
  "Desenvolvimento Pessoal": [
    "Hábitos Atômicos na Prática",
    "Mentalidade de Crescimento",
    "Produtividade sem Burnout",
    "Comunicação Assertiva",
    "Liderança Eficaz",
  ],
  "Empreendedorismo": [
    "Validando sua Ideia de Negócio",
    "Startup do Zero",
    "Vendas B2B Modernas",
    "Precificação Estratégica",
    "Escalando seu Negócio",
  ],
  "Tecnologia": [
    "Python para Iniciantes",
    "IA na Prática",
    "Cibersegurança Essencial",
    "Desenvolvimento Web Moderno",
    "Banco de Dados na Nuvem",
  ],
  "Saúde e Bem-Estar": [
    "Nutrição Funcional",
    "Exercícios em Casa",
    "Meditação Mindfulness",
    "Sono de Qualidade",
    "Redução de Estresse",
  ],
  "Educação": [
    "Aprendizado Acelerado",
    "Ensino por Projetos",
    "Gamificação na Educação",
    "Leitura Dinâmica",
    "Memorização Eficaz",
  ],
  "Culinária": [
    "Receitas Fitness",
    "Culinária Vegana",
    "Confeitaria Profissional",
    "Churrasco Perfeito",
    "Cozinha Rápida e Saudável",
  ],
};

// ─── Gerador de e-books ────────────────────────────────────────────────────────
function generateEbooks(): Ebook[] {
  const ebooks: Ebook[] = [];

  for (let i = 1; i <= 300; i++) {
    const paddedIndex = String(i).padStart(3, "0"); // "001", "002" … "300"
    const id = `ebook-${paddedIndex}`;

    // Distribui categorias em sequência
    const categoryIndex = (i - 1) % CATEGORIES.length;
    const category = CATEGORIES[categoryIndex];

    // Seleciona título ciclando dentro da categoria
    const titlesForCategory = SAMPLE_TITLES[category];
    const titleIndex = Math.floor((i - 1) / CATEGORIES.length) % titlesForCategory.length;
    const baseTitle = titlesForCategory[titleIndex];
    const title = i > CATEGORIES.length * titlesForCategory.length
      ? `${baseTitle} – Vol. ${Math.floor(i / 40) + 1}`
      : baseTitle;

    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    ebooks.push({
      id,
      title,
      description: `Guia completo sobre ${title.toLowerCase()}. Conteúdo prático e atualizado para você aplicar imediatamente.`,
      category,
      price: 2990, // R$ 29,90 em centavos
      coverImage: `/covers/${id}.jpg`,  // coloque suas capas aqui ou use placeholder
      // ✅ CAMINHO CRÍTICO — aponta para public/downloads/ebook-XXX.pdf
      downloadUrl: `/downloads/${id}.pdf`,
      slug,
    });
  }

  return ebooks;
}

// ─── Export principal ──────────────────────────────────────────────────────────
export const ebooks = generateEbooks();

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getEbookById(id: string): Ebook | undefined {
  return ebooks.find((e) => e.id === id);
}

export function getEbookBySlug(slug: string): Ebook | undefined {
  return ebooks.find((e) => e.slug === slug);
}

export function getEbooksByCategory(category: string): Ebook[] {
  return ebooks.filter((e) => e.category === category);
}

// ─── Paginação ────────────────────────────────────────────────────────────────
export const ITEMS_PER_PAGE = 30; // exibe exatamente 30 por página

export interface PaginatedResult {
  items: Ebook[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

/**
 * Retorna fatia de e-books para a página solicitada.
 * @param page  número da página (começa em 1)
 * @param list  lista de e-books (default: todos os 300)
 */
export function paginateEbooks(
  page: number,
  list: Ebook[] = ebooks
): PaginatedResult {
  // Garante que a página seja pelo menos 1
  const safePage = Math.max(1, Math.floor(page));
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Clipa a página ao máximo disponível
  const currentPage = Math.min(safePage, totalPages);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  return {
    items: list.slice(start, end),
    totalPages,
    currentPage,
    totalItems,
  };
}

// ─── Categorias únicas (para menu/filtros) ────────────────────────────────────
export const allCategories = Array.from(
  new Set(ebooks.map((e) => e.category))
).sort();
