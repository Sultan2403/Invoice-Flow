import getReceipts from "../Storage/getReceipts";

export default function generateReceipt({ invoice, paymentMethod }) {
  const receiptNo = `RCP-${new Date().getFullYear()}-${String(
    getReceipts().length + 1
  ).padStart(3, "0")}`;
  const receipt = {
    id: crypto.randomUUID(),
    no: receiptNo,
    invoiceId: invoice.id || null,
    source: invoice.id ? "INVOICE" : "POS",
    paymentMethod,
    amountPaid: invoice.total,
    customer: {
      id: invoice.customer.id || null,
      email: invoice.customer.email || null,
      name: invoice.customer.name,
    },
    createdAt: new Date().toISOString(),
    items: invoice.items,
  };

  return receipt;
}
