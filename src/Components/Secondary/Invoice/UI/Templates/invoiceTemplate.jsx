export default function InvoiceTemplate({ invoice, template }) {
  if (!invoice) {
    return (
      <div className="p-8 text-center text-gray-600">Invoice not found</div>
    );
  }

  const TEMPLATE_STYLES = {
    classic: {
      container: "p-10 text-base leading-relaxed",
      headerAlign: "text-center",
      title: "text-3xl font-bold tracking-tight mb-2",
      tableHead:
        "bg-gray-100 text-left font-semibold text-sm uppercase tracking-wide",
      rowAlt: "bg-gray-50",
      totalsBox:
        "shadow p-4 rounded font-semibold text-sm space-y-1 text-gray-800",
    },

    modern: {
      container: "p-12 text-base leading-relaxed",
      headerAlign: "text-left flex justify-between items-start",
      title: "text-4xl font-semibold mb-2",
      tableHead:
        "bg-black text-white text-sm font-semibold uppercase tracking-wide",
      rowAlt: "bg-gray-100",
      totalsBox:
        "border border-gray-300 p-4 font-semibold text-sm space-y-1 text-gray-800",
    },

    compact: {
      container: "p-6 text-sm leading-relaxed",
      headerAlign: "text-left",
      title: "text-2xl font-bold tracking-tight mb-2",
      tableHead:
        "bg-gray-200 text-left font-semibold text-sm uppercase tracking-wide",
      rowAlt: "bg-gray-50",
      totalsBox: "border-t pt-4 font-semibold text-sm space-y-1 text-gray-800",
    },
  };

  const styles = TEMPLATE_STYLES[template] || TEMPLATE_STYLES.classic;

  const hasItemTaxes = invoice.items.some((item) => item.tax > 0);
  const customer = invoice.customer || {};
  const customerName = customer.name || "";
  const customerEmail = customer.email || "";
  const customerAddress = customer.address || "";

  return (
    <div
      id="invoice-preview"
      className={`relative mx-auto w-[794px] bg-white font-sans text-gray-800 ${styles.container}`}
    >
      {/* Header */}
      <div className={`mb-8 ${styles.headerAlign}`}>
        <div>
          <h1 className={styles.title}>{invoice.name}</h1>
          <p className="mt-1 text-gray-500">Invoice #{invoice.no}</p>
        </div>

        {invoice.status === "Draft" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="select-none text-[120px] font-bold uppercase tracking-widest text-gray-300 opacity-10 rotate-[-25deg]">
              Draft
            </span>
          </div>
        )}
      </div>

      {/* Invoice & Customer Info */}
      <div className="mb-6 grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <p>
            <strong>Issue Date:</strong> {invoice.issueDate}
          </p>
          <p>
            <strong>Due Date:</strong> {invoice.dueDate}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="font-semibold">Bill To:</p>
          {customerName && <p>{customerName}</p>}
          {customerEmail && <p>{customerEmail}</p>}
          {customerAddress && <p>{customerAddress}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-6 bg-white rounded overflow-hidden shadow-sm text-sm">
        <thead className={styles.tableHead}>
          <tr>
            <th className="py-2 px-3 text-left">#</th>
            <th className="py-2 px-3 text-left">Item</th>
            <th className="py-2 px-3 text-left">Description</th>
            <th className="py-2 px-3 text-right">Qty</th>
            <th className="py-2 px-3 text-right">Price</th>
            {hasItemTaxes && <th className="py-2 px-3 text-right">Tax</th>}
            <th className="py-2 px-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 0 ? styles.rowAlt : ""}>
              <td className="py-2 px-3">{idx + 1}</td>
              <td className="py-2 px-3">{item.name}</td>
              <td className="py-2 px-3">{item.description}</td>
              <td className="py-2 px-3 text-right">{item.quantity}</td>
              <td className="py-2 px-3 text-right">${item.price.toFixed(2)}</td>
              {hasItemTaxes && (
                <td className="py-2 px-3 text-right">
                  {item.tax > 0 ? `${item.tax}%` : "-"}
                </td>
              )}
              <td className="py-2 px-3 text-right">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className={`w-64 bg-white ${styles.totalsBox} rounded`}>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${invoice.itemsSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Global Tax:</span>
            <span>${invoice.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
