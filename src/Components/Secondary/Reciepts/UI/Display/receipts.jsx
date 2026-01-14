import { NavLink } from "react-router-dom";
import getReceipts from "../../Helpers/Storage/getReceipts";
import ReceiptCard from "./receiptCard";

export default function Receipts() {
  const receipts = getReceipts();

  if (!receipts.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-3">
        <h3 className="text-lg font-semibold">No receipts yet</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Receipts are generated when invoices are marked as paid.
        </p>

        <NavLink
          to="/invoices"
          className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to Invoices
        </NavLink>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="mb-6 text-xl font-semibold">Receipts</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {receipts.map((receipt) => (
          <ReceiptCard key={receipt.id} receipt={receipt} />
        ))}
      </div>
    </div>
  );
}
