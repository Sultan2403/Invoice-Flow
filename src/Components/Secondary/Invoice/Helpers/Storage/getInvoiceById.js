import { getInvoices } from "./getInvoices";

export default function getInvoiceById(id) {
  const invoices = getInvoices();
  return invoices.find((inv) => String(inv.id) === String(id));
}
