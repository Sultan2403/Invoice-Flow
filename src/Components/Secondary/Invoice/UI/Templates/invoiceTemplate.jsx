import { useParams } from "react-router-dom";

export default function InvoiceTemplate({ invoices }) {
  const { invoiceId } = useParams();

  const invoice = invoices.find((inv) => inv.id === invoiceId) || null;

  if (invoice) {
    document.title = `Invoice-${invoice.invoice_name}`;
    return (
      <div style={{ width: "600px", padding: "20px", fontFamily: "Arial" }}>
        <h1 style={{ textAlign: "center" }}>Invoice</h1>
        <p>
          <strong>Invoice Name:</strong> {invoice.invoice_name}
        </p>
        <p>
          <strong>Customer:</strong> {invoice.customer.customer_name}
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #000" }}>#</th>
              <th style={{ borderBottom: "1px solid #000" }}>Item</th>
              <th style={{ borderBottom: "1px solid #000" }}>Qty</th>
              <th style={{ borderBottom: "1px solid #000" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                {item.status === "draft" && <td>{item.status}</td>}
                <td>${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p
          style={{ textAlign: "right", marginTop: "20px", fontWeight: "bold" }}
        >
          Total: ${invoice.total.toFixed(2)}
        </p>
        <button
          onClick={() => window.print()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          className="print:disabled:"
        >
          Export as PDF
        </button>
      </div>
    );
  } else {
    return (
      <>
        <div>Invoice not found</div>
      </>
    );
  }
}
