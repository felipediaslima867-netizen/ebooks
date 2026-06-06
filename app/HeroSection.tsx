"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]">
          <div className="absolute inset-0 bg-radial-gradient from-accent/8 via-transparent to-transparent rounded-full" />
        </div>
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(79,142,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8"
        >
          <Sparkles size={13} className="text-accent" />
          <span className="text-xs font-mono text-accent tracking-wide">
            300+ e-books por apenas R$ 4,90
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-text-primary leading-[1.1] mb-6"
        >
          Sua Biblioteca{" "}
          <span className="text-gradient-blue block sm:inline">Digital Premium</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed"
        >
          Musculação, Finanças, Tecnologia, Marketing e muito mais.
          Acesse conteúdo especializado com download instantâneo após o pagamento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#categorias"
            className="group flex items-center gap-2.5 px-8 py-4 bg-accent hover:bg-blue-400 text-white font-display font-semibold rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 text-sm"
          >
            <BookOpen size={17} />
            Explorar Catálogo
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <div className="flex items-center gap-2 text-sm text-text-secondary font-body">
            <div className="flex -space-x-2">
              {["💪", "💰", "⚡", "🚀"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-bg-elevated border-2 border-bg flex items-center justify-center text-xs"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <span>10 categorias disponíveis</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
