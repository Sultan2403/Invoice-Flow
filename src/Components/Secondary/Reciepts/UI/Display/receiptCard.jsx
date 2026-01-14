export default function ReceiptCard({ receipt }) {
  return (
    <div className="receipt-card">
      <div className="receipt-card__header">
        <span className="receipt-id">#{receipt.no}</span>
        <span className="receipt-date">
          {new Date(receipt.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="receipt-card__body">
        <div className="amount">${receipt.amountPaid}</div>

        <div className="meta">
          <span>Source: {receipt.source}</span>
          <span>Payment: {receipt.paymentMethod}</span>
        </div>
      </div>

      <div className="receipt-card__actions">
        <button>View</button>
        <button>Print</button>
      </div>
    </div>
  );
}
