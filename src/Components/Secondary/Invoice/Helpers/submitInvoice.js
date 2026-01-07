export function submitInvoice(invoice) {
  const INVOICE_KEY = "invoices";

  const existing = JSON.parse(localStorage.getItem(INVOICE_KEY)) || [];
  const updated = [...existing, invoice];

  localStorage.setItem(INVOICE_KEY, JSON.stringify(updated));
}
