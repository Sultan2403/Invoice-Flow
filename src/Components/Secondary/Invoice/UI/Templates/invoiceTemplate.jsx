import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";

export default function InvoiceTemplate({ invoices }) {
  const { invoiceId } = useParams();

  const invoice = useMemo(
    () => invoices.find((inv) => String(inv.id) === invoiceId),
    [invoices, invoiceId]
  );

  useEffect(() => {
    if (invoice) {
      document.title = `Invoice-${invoice.invoice_name}`;
    }
  }, [invoice]);

  if (!invoice) {
    return <div className="p-8 text-center">Invoice not found</div>;
  }

  // Check if any item has tax
  const hasItemTaxes = invoice.items.some((item) => item.tax > 0);

  return (
    <div
      id="invoice-template"
      className="mx-auto max-w-[700px] bg-white p-8 font-sans text-sm text-gray-800"
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Invoice</h1>
        {invoice.status === "Draft" && (
          <span className="mt-2 inline-block rounded bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            DRAFT
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Invoice Name:</strong> {invoice.invoice_name}
          </p>
          <p>
            <strong>Issue Date:</strong> {invoice.issueDate}
          </p>
          <p>
            <strong>Due Date:</strong> {invoice.dueDate}
          </p>
        </div>
        <div className="text-right">
          <p>
            <strong>Customer:</strong> {invoice.customer.customer_name}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 text-left">#</th>
            <th className="py-2 text-left">Item</th>
            <th className="py-2 text-left">Description</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Price</th>
            {hasItemTaxes && <th className="py-2 text-right">Tax</th>}
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2">{idx + 1}</td>
              <td className="py-2">{item.name}</td>
              <td className="py-2">{item.description}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">${item.price.toFixed(2)}</td>
              {hasItemTaxes && (
                <td className="py-2 text-right">
                  {item.tax > 0 ? `${item.tax}%` : "-"}
                </td>
              )}
              <td className="py-2 text-right">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <div className="w-64 space-y-2 text-right">
          <p>
            <span className="font-semibold">Subtotal:</span> $
            {invoice.itemsSubtotal.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Global Tax:</span> $
            {invoice.taxAmount.toFixed(2)}
          </p>
          <p className="text-lg font-bold">
            Total: ${invoice.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}
