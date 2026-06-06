"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Filter } from "lucide-react";
import { Category, Ebook } from "@/data/ebooks";
import EbookCard from "@/components/cards/EbookCard";
import Pagination from "@/components/ui/Pagination";

interface PaginationData {
  items: Ebook[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface Props {
  category: Category;
  pagination: PaginationData;
  currentPage: number;
  slug: string;
}

export default function CategoryPageClient({
  category,
  pagination,
  currentPage,
  slug,
}: Props) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/categoria/${slug}?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="pt-20 min-h-screen">
      {/* Header */}
      <section
        className="relative overflow-hidden border-b border-border/50 py-14"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${category.color}12 0%, transparent 70%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs text-text-muted mb-6 font-mono"
          >
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: category.color }}>{category.name}</span>
          </motion.div>

          <div className="flex items-start justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-4"
              >
                <div
                  className="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>
                <div>
                  <h1 className="font-display font-extrabold text-4xl text-text-primary">
                    {category.name}
                  </h1>
                  <p className="text-text-secondary font-body mt-1">
                    {category.description}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden sm:flex flex-col items-end gap-1"
            >
              <span
                className="text-3xl font-display font-extrabold"
                style={{ color: category.color }}
              >
                {pagination.total}
              </span>
              <span className="text-xs text-text-muted font-body">
                e-books disponíveis
              </span>
            </motion.div>
          </div>

          {/* Filters bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mt-6"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border rounded-xl text-xs text-text-secondary">
              <Filter size={12} />
              <span className="font-mono">
                Página {currentPage} de {pagination.totalPages}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border rounded-xl text-xs text-text-secondary">
              <BookOpen size={12} />
              <span className="font-mono">
                Exibindo {pagination.items.length} de {pagination.total}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {pagination.items.map((ebook, i) => (
            <EbookCard key={ebook.id} ebook={ebook} index={i} />
          ))}
        </motion.div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </main>
  );
}
