// next.config.js
// ✅ REVISADO — Configuração correta para Vercel + 300 PDFs em public/downloads/

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Headers de segurança ─────────────────────────────────────────────────
  async headers() {
    return [
      {
        // ✅ PROTEÇÃO: PDFs em /downloads/ NÃO devem ser servidos diretamente
        // sem autenticação. Use este header para prevenir acesso direto via URL.
        // ALTERNATIVA MAIS SEGURA: mova os PDFs para fora de /public e sirva via
        // uma API Route protegida (veja nota de segurança abaixo).
        source: "/downloads/:path*",
        headers: [
          {
            key: "Content-Disposition",
            value: "attachment",  // força download ao invés de exibir no browser
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // ─── Configuração de imagens ──────────────────────────────────────────────
  images: {
    remotePatterns: [],
    // Se tiver capas externas, adicione aqui
  },

  // ─── Webpack: evita erros com módulos Node.js no Edge ────────────────────
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;

/*
 * ⚠️ NOTA DE SEGURANÇA IMPORTANTE ⚠️
 * ─────────────────────────────────────────────────────────────────────────────
 * Colocar os PDFs em /public/downloads/ os torna ACESSÍVEIS PUBLICAMENTE via:
 *   https://seusite.com/downloads/ebook-042.pdf
 *
 * Qualquer pessoa que adivinhe a URL pode baixar sem pagar.
 *
 * SOLUÇÃO RECOMENDADA para produção:
 * 1. Mova os PDFs para /private/downloads/ (FORA de /public)
 * 2. Crie uma API Route: GET /api/download?id=ebook-042
 * 3. A route verifica se o pagamento foi aprovado (ex: via DB ou token JWT)
 * 4. Se autorizado, usa fs.readFile + NextResponse com Content-Type: application/pdf
 *
 * Exemplo mínimo:
 *   import fs from "fs/promises";
 *   import path from "path";
 *   export async function GET(req) {
 *     const id = req.nextUrl.searchParams.get("id");
 *     // ... verificar autorização ...
 *     const filePath = path.join(process.cwd(), "private", "downloads", `${id}.pdf`);
 *     const buffer = await fs.readFile(filePath);
 *     return new Response(buffer, {
 *       headers: {
 *         "Content-Type": "application/pdf",
 *         "Content-Disposition": `attachment; filename="${id}.pdf"`,
 *       },
 *     });
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */
