"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "300+", label: "E-books disponíveis" },
  { value: "10", label: "Categorias" },
  { value: "R$ 4,90", label: "Preço único" },
  { value: "100%", label: "Download seguro" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-border/40 bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-gradient-blue mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-text-muted font-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
