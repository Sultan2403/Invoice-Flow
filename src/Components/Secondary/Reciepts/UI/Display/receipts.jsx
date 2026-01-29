import { NavLink } from "react-router-dom";
import getReceipts from "../../Helpers/Storage/getReceipts";
import ReceiptCard from "./receiptCard";

export default function Receipts() {
  const receipts = getReceipts();

  if (!receipts.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center gap-4 p-6">
        <h2 className="text-2xl font-bold text-gray-800">No receipts yet</h2>
        <p className="text-gray-600 max-w-md">
          Receipts are generated when invoices are marked as paid.
        </p>

        <NavLink
          to="/invoices/view"
          className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md"
        >
          View Invoices
        </NavLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800">Receipts</h1>

        {/* Grid of Receipts */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {receipts.map((receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      </div>
    </div>
  );
}
