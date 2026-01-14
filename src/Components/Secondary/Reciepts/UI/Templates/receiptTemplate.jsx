import getReceipts from "../../Helpers/Storage/getReceipts";
import useReceiptId from "../../Hooks/useReceipt";

export default function ReceiptTemplate({ template }) {
  const receipt = useReceiptId(getReceipts());

  if (!receipt) {
    return (
      <div className="p-8 text-center text-gray-600">Receipt not found</div>
    );
  }

  const TEMPLATE_STYLES = {
    classic: {
      container: "p-10 text-base leading-relaxed",
      title: "text-3xl font-bold mb-1",
      subtitle: "text-gray-500",
      tableHead:
        "bg-gray-100 text-left font-semibold text-sm uppercase tracking-wide",
      rowAlt: "bg-gray-50",
      box: "shadow p-4 rounded text-sm space-y-1",
    },

    compact: {
      container: "p-6 text-sm leading-relaxed",
      title: "text-2xl font-bold mb-1",
      subtitle: "text-gray-500",
      tableHead:
        "bg-gray-200 text-left font-semibold text-xs uppercase tracking-wide",
      rowAlt: "bg-gray-50",
      box: "border-t pt-4 space-y-1",
    },
  };

  const styles = TEMPLATE_STYLES[template] || TEMPLATE_STYLES.classic;
  const customer = receipt.customer || {};

  return (
    <div
      id="receipt-preview"
      className={`mx-auto w-[794px] bg-white text-gray-800 ${styles.container} printable`}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className={styles.title}>Payment Receipt</h1>
        <p className={styles.subtitle}>Receipt #{receipt.id}</p>
        <p className="mt-1 text-sm">
          {new Date(receipt.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Meta */}
      <div className="mb-6 grid grid-cols-2 gap-6 text-sm">
        <div className="space-y-1">
          <p>
            <strong>Payment Method:</strong> {receipt.paymentMethod}
          </p>
          <p>
            <strong>Source:</strong> {receipt.source}
          </p>
        </div>

        <div className="text-right space-y-1">
          <p className="font-semibold">Received From:</p>
          <p>{customer.name}</p>
          {customer.email && <p>{customer.email}</p>}
        </div>
      </div>

      {/* Items (always rendered) */}
      <table className="w-full border-collapse mb-6 text-sm">
        <thead className={styles.tableHead}>
          <tr>
            <th className="py-2 px-3">#</th>
            <th className="py-2 px-3">Item</th>
            <th className="py-2 px-3 text-right">Qty</th>
            <th className="py-2 px-3 text-right">Price</th>
            <th className="py-2 px-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 0 ? styles.rowAlt : ""}>
              <td className="py-2 px-3">{idx + 1}</td>
              <td className="py-2 px-3">{item.name}</td>
              <td className="py-2 px-3 text-right">{item.quantity}</td>
              <td className="py-2 px-3 text-right">${item.price.toFixed(2)}</td>
              <td className="py-2 px-3 text-right">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-end">
        <div className={`w-64 ${styles.box}`}>
          <div className="flex justify-between text-lg font-bold">
            <span>Total Paid:</span>
            <span>${receipt.amountPaid.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-xs text-gray-500">
        This receipt confirms full payment. No outstanding balance remains.
      </div>
    </div>
  );
}
