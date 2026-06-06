// components/modal/CheckoutModal.tsx
// ✅ REVISADO — Estado "Download Liberado" após confirmação do pagamento

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Ebook } from "@/data/ebooks";

interface CheckoutModalProps {
  ebook: Ebook;
  onClose: () => void;
}

// ─── Estados possíveis do modal ───────────────────────────────────────────────
type ModalState =
  | "idle"          // aguardando o usuário confirmar compra
  | "creating"      // criando checkout na GoatPay
  | "redirecting"   // redirecionando para a página de pagamento
  | "polling"       // verificando status do pagamento
  | "approved"      // ✅ PAGAMENTO CONFIRMADO — download liberado
  | "failed"        // ❌ Pagamento falhou
  | "error";        // Erro técnico

export default function CheckoutModal({ ebook, onClose }: CheckoutModalProps) {
  const [state, setState] = useState<ModalState>("idle");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ─── Inicia o checkout ────────────────────────────────────────────────────
  const handleBuy = async () => {
    setState("creating");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ebookId: ebook.id }),
      });

      if (!res.ok) throw new Error("Erro ao criar checkout.");

      const { checkoutId: cid, checkoutUrl } = await res.json();
      setCheckoutId(cid);

      // Redireciona para o gateway de pagamento em nova aba
      setState("redirecting");
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");

      // Começa a verificar o status automaticamente
      setState("polling");
    } catch (err) {
      setErrorMessage("Não foi possível iniciar o pagamento. Tente novamente.");
      setState("error");
    }
  };

  // ─── Polling de status (a cada 3s) ───────────────────────────────────────
  const checkStatus = useCallback(async () => {
    if (!checkoutId || state !== "polling") return;

    try {
      const res = await fetch(
        `/api/checkout/status?checkout_id=${checkoutId}&ebook_id=${ebook.id}`
      );
      const data = await res.json();

      if (data.status === "approved") {
        // ✅ PAGAMENTO CONFIRMADO
        setDownloadUrl(data.downloadUrl);
        setState("approved");
      } else if (data.status === "failed") {
        setState("failed");
      }
      // se "pending", continua fazendo polling
    } catch {
      // Silencia erros de rede temporários — tenta de novo no próximo tick
    }
  }, [checkoutId, ebook.id, state]);

  useEffect(() => {
    if (state !== "polling") return;

    const interval = setInterval(checkStatus, 3000);
    // Para após 15 minutos (300 iterações × 3s)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (state === "polling") {
        setErrorMessage("Tempo limite excedido. Verifique seu e-mail.");
        setState("error");
      }
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state, checkStatus]);

  // ─── Inicia download ──────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!downloadUrl) return;

    const link = document.createElement("a");
    link.href = downloadUrl;                       // ex: /downloads/ebook-042.pdf
    link.download = `${ebook.id}.pdf`;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Fechar"
        >
          ×
        </button>

        {/* ── ESTADO: idle ─────────────────────────────────── */}
        {state === "idle" && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{ebook.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{ebook.description}</p>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-blue-600">
                R$ {(ebook.price / 100).toFixed(2).replace(".", ",")}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {ebook.category}
              </span>
            </div>
            <button
              onClick={handleBuy}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Comprar Agora
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Pagamento seguro via GoatPay • Entrega imediata
            </p>
          </>
        )}

        {/* ── ESTADO: creating ─────────────────────────────── */}
        {state === "creating" && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Preparando seu checkout…</p>
          </div>
        )}

        {/* ── ESTADO: redirecting ──────────────────────────── */}
        {state === "redirecting" && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔗</div>
            <p className="font-semibold text-gray-800 mb-2">
              Abrindo página de pagamento…
            </p>
            <p className="text-sm text-gray-500">
              Uma nova aba foi aberta com o checkout seguro.
              <br />
              Após o pagamento, o download será liberado automaticamente.
            </p>
          </div>
        )}

        {/* ── ESTADO: polling ──────────────────────────────── */}
        {state === "polling" && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-semibold text-gray-800 mb-2">
              Aguardando confirmação do pagamento…
            </p>
            <p className="text-sm text-gray-500">
              Isso pode levar alguns instantes. Não feche esta janela.
            </p>
            <button
              onClick={() => setState("idle")}
              className="mt-6 text-xs text-gray-400 underline"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* ── ESTADO: approved ✅ DOWNLOAD LIBERADO ─────────── */}
        {state === "approved" && downloadUrl && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Pagamento Confirmado!
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Seu e-book <strong>{ebook.title}</strong> está pronto para download.
            </p>
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Baixar {ebook.title}
            </button>
            <p className="text-xs text-gray-400 mt-3">
              O arquivo PDF ({ebook.id}.pdf) será salvo no seu dispositivo.
            </p>
          </div>
        )}

        {/* ── ESTADO: failed ───────────────────────────────── */}
        {state === "failed" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Pagamento não aprovado
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Verifique os dados do cartão ou tente outro método de pagamento.
            </p>
            <button
              onClick={() => setState("idle")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* ── ESTADO: error ─────────────────────────────────── */}
        {state === "error" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ops, algo deu errado
            </h3>
            <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
            <button
              onClick={() => setState("idle")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
            >
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
