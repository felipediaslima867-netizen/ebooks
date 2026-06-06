"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, Users, ShoppingCart } from "lucide-react";
import { Ebook } from "@/data/ebooks";
import { formatCurrency, formatRating, truncate } from "@/lib/utils";
import CheckoutModal from "@/components/modal/CheckoutModal";

interface EbookCardProps {
  ebook: Ebook;
  index?: number;
}

const categoryColors: Record<string, string> = {
  musculacao: "#EF4444",
  financas: "#F5C842",
  tecnologia: "#4F8EF7",
  marketing: "#8B5CF6",
  nutricao: "#10B981",
  negocios: "#F97316",
  mentalidade: "#EC4899",
  relacionamentos: "#F43F5E",
  espiritualidade: "#A78BFA",
  idiomas: "#06B6D4",
};

export default function EbookCard({ ebook, index = 0 }: EbookCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const accentColor = categoryColors[ebook.categorySlug] || "#4F8EF7";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: (index % 10) * 0.05,
          ease: "easeOut",
        }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group relative bg-bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-[var(--accent)] transition-all duration-300 cursor-pointer"
        style={{ "--accent": `${accentColor}4D` } as React.CSSProperties}
        onClick={() => setModalOpen(true)}
      >
        {/* Cover Area */}
        <div className={`relative h-44 bg-gradient-to-br ${ebook.coverGradient} overflow-hidden`}>
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-card-shine opacity-60" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Book icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
              <BookOpen size={28} className="text-white/80" />
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-mono font-medium px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: `${accentColor}25`,
                borderColor: `${accentColor}50`,
                color: accentColor,
              }}
            >
              {ebook.category}
            </span>
          </div>

          {/* Pages badge */}
          <div className="absolute top-3 right-3">
            <span className="text-xs text-white/60 bg-black/30 px-2 py-0.5 rounded-md font-mono">
              {ebook.pages}p
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-text-primary text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-white transition-colors">
            {ebook.title}
          </h3>

          <p className="text-xs text-text-muted mb-3 font-body">
            por {ebook.author}
          </p>

          <p className="text-xs text-text-secondary line-clamp-2 mb-4 font-body leading-relaxed">
            {truncate(ebook.description, 90)}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            <Star size={12} fill="#F5C842" className="text-gold" />
            <span className="text-xs font-mono font-medium text-gold">
              {formatRating(ebook.rating)}
            </span>
            <span className="text-xs text-text-muted">
              ({ebook.reviews})
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-display font-bold text-gradient-blue">
                {formatCurrency(ebook.price)}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-display font-semibold text-white transition-all duration-200"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 15px ${accentColor}40`,
              }}
            >
              <ShoppingCart size={13} />
              Comprar
            </motion.button>
          </div>
        </div>

        {/* Hover border glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1px ${accentColor}40`,
          }}
        />
      </motion.div>

      <CheckoutModal
        ebook={ebook}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
