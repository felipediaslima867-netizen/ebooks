// lib/goatpay.ts
// ✅ REVISADO — Integração completa com GoatPay

export interface GoatPayCheckoutPayload {
  amount: number;       // valor em centavos
  currency: "BRL";
  productId: string;   // ex: "ebook-001"
  productName: string;
  successUrl: string;  // URL de retorno após pagamento aprovado
  cancelUrl: string;
  webhookUrl: string;  // endpoint que recebe confirmação
  metadata?: Record<string, string>;
}

export interface GoatPayCheckoutResponse {
  checkoutId: string;
  checkoutUrl: string; // URL para redirecionar o usuário
  expiresAt: string;
}

export interface GoatPayWebhookEvent {
  event: "payment.approved" | "payment.failed" | "payment.pending" | "payment.refunded";
  checkoutId: string;
  paymentId: string;
  productId: string;   // ID do produto comprado — ESSENCIAL para download
  amount: number;
  currency: string;
  email?: string;
  timestamp: string;
  signature: string;   // HMAC-SHA256 para validação
}

const GOATPAY_BASE_URL = process.env.GOATPAY_API_URL ?? "https://api.goatpay.com/v1";
const GOATPAY_API_KEY = process.env.GOATPAY_API_KEY ?? "";
const GOATPAY_WEBHOOK_SECRET = process.env.GOATPAY_WEBHOOK_SECRET ?? "";

// ─── Criar Checkout ────────────────────────────────────────────────────────────
export async function createCheckout(
  payload: GoatPayCheckoutPayload
): Promise<GoatPayCheckoutResponse> {
  if (!GOATPAY_API_KEY) {
    throw new Error("GOATPAY_API_KEY não configurada nas variáveis de ambiente.");
  }

  const res = await fetch(`${GOATPAY_BASE_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GOATPAY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GoatPay checkout error ${res.status}: ${error}`);
  }

  return res.json() as Promise<GoatPayCheckoutResponse>;
}

// ─── Validar Assinatura do Webhook ────────────────────────────────────────────
/**
 * Valida o HMAC-SHA256 enviado pela GoatPay no header X-GoatPay-Signature.
 * OBRIGATÓRIO — nunca entregue download sem validar.
 */
export async function validateWebhookSignature(
  rawBody: string,
  signature: string
): Promise<boolean> {
  if (!GOATPAY_WEBHOOK_SECRET) {
    console.error("GOATPAY_WEBHOOK_SECRET não configurado.");
    return false;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(GOATPAY_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(rawBody)
  );

  const expected = Buffer.from(signed).toString("hex");

  // Comparação segura (timing-safe)
  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ─── Consultar Status de Pagamento ────────────────────────────────────────────
export async function getPaymentStatus(checkoutId: string): Promise<{
  status: "pending" | "approved" | "failed" | "refunded";
  productId?: string;
}> {
  const res = await fetch(`${GOATPAY_BASE_URL}/checkout/${checkoutId}`, {
    headers: { Authorization: `Bearer ${GOATPAY_API_KEY}` },
    // Sem cache — sempre busca o status mais recente
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GoatPay status error ${res.status}`);
  }

  return res.json();
}
