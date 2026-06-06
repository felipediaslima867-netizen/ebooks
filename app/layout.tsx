import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "E-book Hub — Biblioteca Digital Premium",
    template: "%s | E-book Hub",
  },
  description:
    "Mais de 300 e-books premium nas melhores categorias. Musculação, Finanças, Tecnologia e muito mais. A partir de R$ 4,90.",
  keywords: ["ebooks", "livros digitais", "musculação", "finanças", "tecnologia", "marketing"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ebookhub.vercel.app",
    siteName: "E-book Hub",
    title: "E-book Hub — Biblioteca Digital Premium",
    description: "Mais de 300 e-books premium. A partir de R$ 4,90.",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-book Hub",
    description: "Mais de 300 e-books premium. A partir de R$ 4,90.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <body
        className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} font-body bg-bg text-text-primary antialiased min-h-screen`}
      >
        <div className="relative min-h-screen">
          {/* Ambient background effects */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold/4 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-500/4 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
