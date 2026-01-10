import { useParams } from "react-router-dom";
import { useMemo } from "react";

export default function useInvoiceId(invoices) {
  const { invoiceId } = useParams();

  const invoice = useMemo(
    () => invoices.find((inv) => String(inv.id) === invoiceId),
    [invoices, invoiceId]
  );

  return invoice;
}
