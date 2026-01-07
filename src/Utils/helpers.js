export function getInvoices() {
  const INVOICE_KEY = "invoices";
  const invoice = JSON.parse(localStorage.getItem(INVOICE_KEY)) || [];
  return invoice;
}
