import { NextRequest, NextResponse } from "next/server";
import { getEbookById } from "@/data/ebooks";

// In a real app, persist payment status in a DB (e.g., Redis, Postgres)
// This in-memory map resets on each serverless function cold start
const confirmedPayments = new Map<
  string,
  { ebookId: string; downloadUrl: string; paidAt: string }
>();

export async function POST(request: NextRequest) {
  try {
    // Verify GoatPay webhook signature
    const signature = request.headers.get("x-goatpay-signature");
    const webhookSecret = process.env.GOATPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      // TODO: implement HMAC-SHA256 verification
      // const body = await request.text();
      // const expectedSig = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
      // if (signature !== expectedSig) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = await request.json();
    console.log("[WEBHOOK]", JSON.stringify(payload, null, 2));

    const { event, data } = payload;

    if (event === "charge.paid" || event === "payment.confirmed") {
      const orderId = data?.id || data?.charge_id;
      const ebookId = data?.external_id || data?.metadata?.ebookId;

      if (!orderId) {
        return NextResponse.json({ error: "orderId ausente" }, { status: 400 });
      }

      const ebook = ebookId ? getEbookById(ebookId) : undefined;

      confirmedPayments.set(orderId, {
        ebookId: ebookId || "",
        downloadUrl: ebook?.downloadUrl || `/downloads/${ebookId}.pdf`,
        paidAt: new Date().toISOString(),
      });

      console.log(`[WEBHOOK] Payment confirmed: orderId=${orderId}, ebook=${ebookId}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("[WEBHOOK ERROR]", error?.message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Expose confirmed payments map for status route (same process only)
export { confirmedPayments };
