// ─── Export principal corrigido ──────────────────────────────────────────────
export const ebooks = generateEbooks();

// Mude de CATEGORIES para categories para bater com o que os outros arquivos esperam
export const categories = CATEGORIES; 

// Garante que todas as funções importantes estão exportadas
export function getEbookById(id: string): Ebook | undefined {
  return ebooks.find((e) => e.id === id);
}

export function getEbookBySlug(slug: string): Ebook | undefined {
  return ebooks.find((e) => e.slug === slug);
}

export function getCategoryBySlug(slug: string): string | undefined {
  return CATEGORIES.find(c => c.toLowerCase().replace(/\s+/g, '-') === slug);
}

export function getEbooksByCategory(category: string): Ebook[] {
  return ebooks.filter((e) => e.category === category);
}