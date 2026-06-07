/**
 * lib/payment-store.ts
 *
 * Módulo utilitário para rastrear pagamentos confirmados.
 * Ao invés de exportar `confirmedPayments` diretamente de um Route Handler
 * (o que causaria erro de build no Next.js), centralizamos o estado aqui.
 *
 * IMPORTANTE: Este Set vive na memória do servidor e é resetado a cada
 * reinicialização / deploy. Em produção, substitua por um banco de dados
 * (ex: Redis, Prisma, Supabase) para persistência real.
 */

// Set interno — não exportado diretamente para evitar mutações acidentais
const _confirmedPayments = new Set<string>();

/**
 * Verifica se um pagamento está confirmado.
 */
export function isPaymentConfirmed(paymentId: string): boolean {
  return _confirmedPayments.has(paymentId);
}

/**
 * Marca um pagamento como confirmado.
 */
export function confirmPayment(paymentId: string): void {
  _confirmedPayments.add(paymentId);
}

/**
 * Remove um pagamento do registro de confirmados (ex: reembolso).
 */
export function removePayment(paymentId: string): void {
  _confirmedPayments.delete(paymentId);
}

/**
 * Retorna uma cópia do Set de pagamentos confirmados (somente leitura).
 */
export function getConfirmedPayments(): ReadonlySet<string> {
  return new Set(_confirmedPayments);
}
