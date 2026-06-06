// app/page.tsx — VERSÃO PRODUCTION (sem require())
// ✅ REVISADO — Consome paginateEbooks corretamente (30 itens/página)

import { ebooks, paginateEbooks, allCategories } from "@/data/ebooks";
import type { Ebook } from "@/data/ebooks";
import EbookCard from "@/components/cards/EbookCard";
import Pagination from "@/components/ui/Pagination";
import HeroSection from "./HeroSection";
import StatsBar from "./StatsBar";

// Esta página é DINÂMICA (lê searchParams) — necessário para Vercel
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: {
    page?: string;
    categoria?: string;
  };
}

export default function HomePage({ searchParams }: PageProps) {
  // ── 1. Parse dos parâmetros de URL ──
  const rawPage = parseInt(searchParams.page ?? "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const categoriaFiltro = searchParams.categoria ?? "";

  // ── 2. Filtragem server-side (zero custo no cliente) ──
  const listaFiltrada: Ebook[] = categoriaFiltro
    ? ebooks.filter((e) => e.category === categoriaFiltro)
    : ebooks;

  // ── 3. Paginação — 30 itens por página ──
  const { items, totalPages, currentPage, totalItems } = paginateEbooks(
    page,
    listaFiltrada
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <StatsBar totalEbooks={totalItems} />

      {/* Filtros */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          <a
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !categoriaFiltro
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Todos
          </a>
          {allCategories.map((cat) => (
            <a
              key={cat}
              href={`/?categoria=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoriaFiltro === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* Grid — APENAS 30 itens renderizados */}
      <section className="container mx-auto px-4 pb-12">
        <p className="text-sm text-gray-500 mb-4">
          {totalItems} e-books • Página {currentPage} de {totalPages}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Nenhum e-book encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={
                categoriaFiltro
                  ? `/?categoria=${encodeURIComponent(categoriaFiltro)}&`
                  : "/?"
              }
            />
          </div>
        )}
      </section>
    </main>
  );
}
