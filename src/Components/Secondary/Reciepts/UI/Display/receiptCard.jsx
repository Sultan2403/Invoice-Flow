import { NavLink } from "react-router-dom";
import { currencyFormatter } from "../../../../../Utils/helpers";

import getInvoiceById from "../../../Invoice/Helpers/Storage/getInvoiceById";

export default function ReceiptCard({ receipt }) {
  const invoice = getInvoiceById(receipt.invoiceId);
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-900">{receipt.no}</span>

        <span className="text-xs text-gray-500">
          {receipt.createdAt
            ? new Date(receipt.createdAt).toLocaleDateString()
            : "—"}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-3">
        {/* Amount */}
        <div className="text-xl font-semibold text-blue-600">
          {currencyFormatter.format(receipt.amountPaid)}
        </div>

        {/* Meta */}
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <span className="font-medium text-gray-700">Source:</span>{" "}
            {receipt.source}
          </div>
          <div>
            <span className="font-medium text-gray-700">Payment:</span>{" "}
            {receipt.paymentMethod}
          </div>
        </div>

        {/* Paid by */}
        {receipt.customer && (
          <div className="pt-2 text-sm text-gray-600 space-y-0.5">
            <div>
              <span className="font-medium text-gray-700">Paid by:</span>{" "}
              {receipt.customer.name || "—"}
            </div>

            {receipt.customer.email && (
              <div className="text-xs text-gray-500">
                {receipt.customer.email}
              </div>
            )}
          </div>
        )}

        {/* Parent Invoice */}
        {receipt.invoiceId && invoice && (
          <div className="pt-2 text-xs text-gray-500">
            From invoice{" "}
            <NavLink
              to={`/invoices/view/${receipt.invoiceId}`}
              className="font-medium text-blue-600 hover:underline"
            >
              #{invoice.name}
            </NavLink>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end px-4 py-3 border-t border-gray-100">
        <NavLink
          to={`receipts/view/${receipt.id}`}
          className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          View
        </NavLink>
      </div>
    </div>
  );
}
