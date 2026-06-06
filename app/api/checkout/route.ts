// app/api/checkout/route.ts
// ✅ REVISADO — Cria sessão de checkout na GoatPay

import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/goatpay";
import { getEbookById } from "@/data/ebooks";

export async function POST(req: NextRequest) {
  try {
    const { ebookId } = await req.json();

    // ── Valida o ID recebido ──
    if (!ebookId || typeof ebookId !== "string") {
      return NextResponse.json(
        { error: "ebookId é obrigatório." },
        { status: 400 }
      );
    }

    // ── Busca o e-book no catálogo ──
    const ebook = getEbookById(ebookId);
    if (!ebook) {
      return NextResponse.json(
        { error: "E-book não encontrado." },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://seusite.com.br";

    // ── Cria o checkout na GoatPay ──
    const checkout = await createCheckout({
      amount: ebook.price,
      currency: "BRL",
      productId: ebook.id,          // ← enviado para rastrear qual PDF liberar
      productName: ebook.title,
      successUrl: `${baseUrl}/sucesso?checkout_id={CHECKOUT_ID}`,
      cancelUrl: `${baseUrl}/?cancelado=1`,
      webhookUrl: `${baseUrl}/api/webhook`,
      metadata: {
        ebookId: ebook.id,
        downloadUrl: ebook.downloadUrl,
      },
    });

    return NextResponse.json({
      checkoutId: checkout.checkoutId,
      checkoutUrl: checkout.checkoutUrl,
    });
  } catch (error) {
    console.error("[checkout] Erro:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar checkout." },
      { status: 500 }
    );
  }
}
