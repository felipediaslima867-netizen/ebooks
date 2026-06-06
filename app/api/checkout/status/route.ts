import { NextRequest, NextResponse } from "next/server";
import { getGoatPayOrderStatus } from "@/lib/goatpay";
import { getEbookById } from "@/data/ebooks";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const ebookId = searchParams.get("ebookId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId obrigatório" }, { status: 400 });
  }

  try {
    // Mock mode for development
    if (orderId.startsWith("mock-") || !process.env.GOATPAY_API_KEY) {
      // Simulate payment after 10 seconds in mock mode
      const createdAt = parseInt(orderId.replace("mock-", ""), 10);
      const elapsed = Date.now() - createdAt;
      const paid = elapsed > 10000;

      if (paid && ebookId) {
        const ebook = getEbookById(ebookId);
        return NextResponse.json({
          paid: true,
          status: "paid",
          downloadUrl: ebook?.downloadUrl || "/downloads/ebook.pdf",
        });
      }

      return NextResponse.json({ paid: false, status: "pending" });
    }

    const statusData = await getGoatPayOrderStatus(orderId);

    let downloadUrl: string | undefined;
    if (statusData.paid && ebookId) {
      const ebook = getEbookById(ebookId);
      downloadUrl = ebook?.downloadUrl;
    }

    return NextResponse.json({
      paid: statusData.paid,
      status: statusData.status,
      downloadUrl,
    });
  } catch (error: any) {
    console.error("[STATUS ERROR]", error?.message);
    return NextResponse.json({ paid: false, status: "error" }, { status: 500 });
  }
}
