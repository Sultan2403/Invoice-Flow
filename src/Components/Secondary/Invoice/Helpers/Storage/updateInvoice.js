import { getInvoices } from "./getInvoices";

export default function updateInvoice(updatedInvoice) {
  const INVOICE_KEY = "invoices";

  const invoices = getInvoices();

  const updatedInvoices = invoices.map((inv) =>
    inv.id === updatedInvoice.id ? updatedInvoice : inv
  );

  localStorage.setItem(INVOICE_KEY, JSON.stringify(updatedInvoices));
}
