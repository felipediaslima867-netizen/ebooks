// ─── Interfaces e Dados ───────────────────────────────────────────────────────
export interface Ebook {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  coverImage: string;
  downloadUrl: string;
  slug: string;
}

const CATEGORIES = [
  "Marketing Digital", "Finanças Pessoais", "Desenvolvimento Pessoal",
  "Empreendedorismo", "Tecnologia", "Saúde e Bem-Estar", "Educação", "Culinária"
];

// ... (Aqui vai o resto do seu código de geração de e-books, mantendo a função generateEbooks)

export const ebooks = generateEbooks();

// ─── EXPORTS OBRIGATÓRIOS (Não remova nada abaixo) ─────────────────────────────
export const categories = CATEGORIES;
export const allCategories = Array.from(new Set(ebooks.map((e) => e.category))).sort();

export function getEbookById(id: string): Ebook | undefined { return ebooks.find((e) => e.id === id); }
export function getEbookBySlug(slug: string): Ebook | undefined { return ebooks.find((e) => e.slug === slug); }
export function getCategoryBySlug(slug: string): string | undefined { 
  return categories.find(c => c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') === slug); 
}
export function getEbooksByCategory(category: string): Ebook[] { return ebooks.filter((e) => e.category === category); }

export const ITEMS_PER_PAGE = 30;

export function paginateEbooks(page: number, list: Ebook[] = ebooks) {
  const safePage = Math.max(1, Math.floor(page));
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(safePage, totalPages);
  return {
    items: list.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    totalPages,
    currentPage,
    totalItems: list.length
  };
}