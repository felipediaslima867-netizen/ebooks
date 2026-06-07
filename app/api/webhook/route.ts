import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  confirmPayment,
  removePayment,
} from "@/lib/payment-store";

// Tipagem do payload de webhook da GoatPay
interface GoatPayWebhookPayload {
  event: string;
  paymentId: string;
  orderId?: string;
  status: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

/**
 * POST /api/webhook
 *
 * Endpoint que recebe notificações de pagamento da GoatPay.
 * Apenas métodos HTTP (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
 * podem ser exportados de Route Handlers no Next.js App Router.
 */
export async function POST(request: NextRequest) {
  try {
    // Verificação da assinatura do webhook
    const headersList = headers();
    const webhookSecret = process.env.GOATPAY_WEBHOOK_SECRET;
    const signature = headersList.get("x-goatpay-signature");

    if (webhookSecret && signature) {
      const isValid = validateSignature(signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json(
          { error: "Assinatura inválida" },
          { status: 401 }
        );
      }
    }

    const body: GoatPayWebhookPayload = await request.json();
    const { event, paymentId, status } = body;

    console.log(
      `[Webhook GoatPay] Evento: ${event} | PaymentId: ${paymentId} | Status: ${status}`
    );

    switch (event) {
      case "payment.confirmed":
      case "payment.completed": {
        confirmPayment(paymentId);
        console.log(`[Webhook GoatPay] Pagamento ${paymentId} confirmado.`);
        // TODO: persistir no banco de dados, enviar e-mail, etc.
        break;
      }

      case "payment.failed": {
        removePayment(paymentId);
        console.log(`[Webhook GoatPay] Pagamento ${paymentId} falhou.`);
        break;
      }

      case "payment.refunded": {
        removePayment(paymentId);
        console.log(`[Webhook GoatPay] Pagamento ${paymentId} estornado.`);
        break;
      }

      default: {
        console.log(`[Webhook GoatPay] Evento não tratado: ${event}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[Webhook GoatPay] Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar webhook" },
      { status: 500 }
    );
  }
}

// Função auxiliar de validação de assinatura
function validateSignature(signature: string, secret: string): boolean {
  // Substitua pela validação HMAC real da GoatPay quando disponível
  return Boolean(signature && secret);
}
