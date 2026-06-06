import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-6">📚</div>
        <h1 className="font-display font-extrabold text-5xl text-text-primary mb-3">
          404
        </h1>
        <p className="text-text-secondary mb-8 font-body">
          Esta página não foi encontrada.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-blue-400 text-white font-display font-semibold rounded-xl transition-all duration-200 shadow-glow-sm hover:shadow-glow"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
