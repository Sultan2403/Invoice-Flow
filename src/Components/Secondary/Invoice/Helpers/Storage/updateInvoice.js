import { getInvoices } from "./getInvoices";

export default function updateInvoice(invoice) {
  const INVOICE_KEY = "invoices";
  const invoices = getInvoices();
  invoices.map((inv) => (inv.id === invoice.id ? invoice : inv));

  localStorage.setItem(INVOICE_KEY, JSON.parse(invoices));
}
