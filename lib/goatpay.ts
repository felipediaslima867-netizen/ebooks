// ─── lib/goatpay.ts ───

export interface GoatPayCheckoutPayload {
  amount: number;
  currency: "BRL";
  productId: string;
  productName: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
  metadata?: Record<string, string>;
}

export interface GoatPayCheckoutResponse {
  checkoutId: string;
  checkoutUrl: string;
  expiresAt: string;
}

export interface GoatPayWebhookEvent {
  event: "payment.approved" | "payment.failed" | "payment.pending" | "payment.refunded";
  checkoutId: string;
  paymentId: string;
  productId: string;
  amount: number;
  currency: string;
  email?: string;
  timestamp: string;
  signature: string;
}

const GOATPAY_BASE_URL = process.env.GOATPAY_API_URL ?? "https://api.goatpay.com/v1";
const GOATPAY_API_KEY = process.env.GOATPAY_API_KEY ?? "";
const GOATPAY_WEBHOOK_SECRET = process.env.GOATPAY_WEBHOOK_SECRET ?? "";

// ─── Criar Checkout ────────────────────────────────────────────────────────────
export async function createCheckout(
  payload: GoatPayCheckoutPayload
): Promise<GoatPayCheckoutResponse> {
  if (!GOATPAY_API_KEY) {
    throw new Error("GOATPAY_API_KEY não configurada.");
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

// ─── Consultar Status (Renomeada para bater com a importação no seu app) ─────
export async function getGoatPayOrderStatus(checkoutId: string): Promise<{
  status: "pending" | "approved" | "failed" | "refunded";
  productId?: string;
}> {
  const res = await fetch(`${GOATPAY_BASE_URL}/checkout/${checkoutId}`, {
    headers: { Authorization: `Bearer ${GOATPAY_API_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GoatPay status error ${res.status}`);
  }

  return res.json();
}

// ─── Validar Assinatura do Webhook ────────────────────────────────────────────
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