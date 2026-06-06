import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  categories,
  getEbooksByCategory,
  getCategoryBySlug,
  paginateEbooks,
} from "@/data/ebooks";
import Navbar from "@/components/navbar/Navbar";
import CategoryPageClient from "./CategoryPageClient";

type Props = {
  params: { slug: string };
  searchParams: { page?: string };
};

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} — E-books`,
    description: `${category.description}. Mais de 30 e-books premium por apenas R$ 4,90.`,
  };
}

export default function CategoryPage({ params, searchParams }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const allEbooks = getEbooksByCategory(params.slug);
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10));
  const pagination = paginateEbooks(allEbooks, currentPage, 30);

  return (
    <>
      <Navbar />
      <CategoryPageClient
        category={category}
        pagination={pagination}
        currentPage={currentPage}
        slug={params.slug}
      />
    </>
  );
}
