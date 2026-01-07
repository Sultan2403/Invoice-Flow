export function submitInvoice(invoice) {
  const INVOICE_KEY = "invoices";

  const existing = JSON.parse(localStorage.getItem(INVOICE_KEY)) || [];
  invoice.no = `INV-${String(existing.length).padStart(3, "0")}`;
  const updated = [...existing, invoice];

  localStorage.setItem(INVOICE_KEY, JSON.stringify(updated));
}
