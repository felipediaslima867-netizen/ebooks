"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category } from "@/data/ebooks";

interface CategoryCardProps {
  category: Category;
  count: number;
  index?: number;
}

export default function CategoryCard({ category, count, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <Link href={`/categoria/${category.slug}`} className="group block">
        <div
          className="relative overflow-hidden rounded-2xl border bg-bg-card transition-all duration-300 p-5"
          style={{
            borderColor: `${category.color}25`,
            boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
          }}
        >
          {/* BG glow */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-300"
            style={{ backgroundColor: category.color }}
          />

          <div className="relative z-10">
            <div className="text-3xl mb-3">{category.icon}</div>

            <h3 className="font-display font-bold text-text-primary text-base mb-1 group-hover:text-white transition-colors">
              {category.name}
            </h3>

            <p className="text-xs text-text-secondary mb-4 font-body leading-relaxed">
              {category.description}
            </p>

            <div className="flex items-center justify-between">
              <span
                className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                {count} e-books
              </span>

              <motion.div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: `${category.color}20` }}
                whileHover={{ x: 3 }}
              >
                <ArrowRight size={13} style={{ color: category.color }} />
              </motion.div>
            </div>
          </div>

          {/* Hover border */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 1px ${category.color}40` }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
