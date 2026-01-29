import { NavLink } from "react-router-dom";
import { useState } from "react";
import { currencyFormatter } from "../../../../../Utils/helpers";
import { Send, AlertCircle, Check } from "lucide-react";
import BasicModal from "../../../../UI/Modal/modal";

import getInvoiceById from "../../../Invoice/Helpers/Storage/getInvoiceById";

export default function ReceiptCard({ receipt }) {
  const invoice = getInvoiceById(receipt.invoiceId);
  const [sendModal, setSendModal] = useState(false);
  const [sendFeedback, setSendFeedback] = useState(false);
  const hasEmail = receipt.customer?.email;

  const handleSendReceipt = () => {
    if (!hasEmail) {
      setSendModal(true);
      return;
    }

    // TODO: Queue backend to send receipt email
    console.log(`Sending receipt ${receipt.no} to ${receipt.customer.email}`);
    setSendFeedback(true);
    setTimeout(() => setSendFeedback(false), 3000);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <span className="text-sm font-bold text-gray-900">{receipt.no}</span>
        <span className="text-xs text-gray-500 font-medium">
          {receipt.createdAt
            ? new Date(receipt.createdAt).toLocaleDateString()
            : "—"}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Amount - Highlighted */}
        <div className="text-2xl font-bold text-blue-700">
          {currencyFormatter.format(receipt.amountPaid || receipt.total)}
        </div>

        {/* Meta Information */}
        <div className="text-sm text-gray-700 space-y-1.5 border-t border-gray-100 pt-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Source:</span>
            <span className="text-gray-900 font-medium">{receipt.source}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Payment Method:</span>
            <span className="text-gray-900">{receipt.paymentMethod}</span>
          </div>
        </div>

        {/* Paid by */}

        <div className="text-sm text-gray-700 space-y-0.5 border-t border-gray-100 pt-3">
          <p className="font-medium text-gray-600">Paid by</p>
          <p className="text-gray-900 font-semibold">
            {receipt.customer?.name || "No customer"}
          </p>
          {receipt.customer?.email && (
            <p className="text-xs text-gray-500">{receipt.customer.email}</p>
          )}
        </div>

        {/* Parent Invoice Link */}
        {receipt.invoiceId && invoice && (
          <div className="text-xs border-t border-gray-100 pt-3">
            <p className="text-gray-500">From Invoice</p>
            <NavLink
              to={`/invoices/view/${receipt.invoiceId}`}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {invoice.name}
            </NavLink>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between px-5 py-3 bg-gray-50 border-t border-gray-100 gap-2">
        <button
          onClick={handleSendReceipt}
          disabled={sendFeedback}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
            hasEmail
              ? sendFeedback
                ? "bg-green-600 text-white"
                : "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title={
            !hasEmail
              ? "Customer email not available"
              : "Send receipt via email"
          }
        >
          <Send size={16} />
          {sendFeedback ? "Sent!" : "Send"}
        </button>

        <NavLink
          to={`/receipts/view/${receipt.id}`}
          className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          View Receipt
        </NavLink>
      </div>

      {/* Modal: No Email Available */}
      <BasicModal open={sendModal} onClose={() => setSendModal(false)}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={24}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Cannot Send Receipt
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {receipt.customer?.name ? (
                  <>
                    Customer <strong>{receipt.customer.name}</strong> does not
                    have an email address on file. Please update the customer's
                    email before sending the receipt.
                  </>
                ) : (
                  <>
                    This receipt is not associated with a customer or the
                    customer email is missing. Please ensure the customer
                    details are complete.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <button
              onClick={() => setSendModal(false)}
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </BasicModal>

      {/* Modal: Send Success Feedback */}
      <BasicModal open={sendFeedback} onClose={() => setSendFeedback(false)}>
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <Check size={48} className="text-green-600" />
          <div>
            <p className="text-lg font-semibold text-gray-800">Receipt Sent!</p>
            <p className="text-sm text-gray-600 mt-1">
              Receipt #{receipt.no} has been queued to send to{" "}
              {receipt.customer?.email}
            </p>
          </div>
          <button
            onClick={() => setSendFeedback(false)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
          >
            Done
          </button>
        </div>
      </BasicModal>
    </div>
  );
}
