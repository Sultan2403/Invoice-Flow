import { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import { CheckCircle2Icon, CircleAlert } from "lucide-react";

import calcDueDate from "../../Helpers/Calculations/calcDueDate";
import { getInvoices } from "../../Helpers/Storage/getInvoices";
import useInvoiceId from "../../Hooks/useInvoice";

import { useState } from "react";
import FormModal from "../../../Reciepts/UI/Helpers/formModal";
import BasicModal from "../../../../UI/Modal/modal";
import getReceipts from "../../../Reciepts/Helpers/Storage/getReceipts";
import updateInvoice from "../../Helpers/Storage/updateInvoice";

export default function DisplayInvoice() {
  const [formMode, setFormMode] = useState(false);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const invoice = useInvoiceId(getInvoices());

  const receipts = getReceipts();
  const existingReceipt = receipts.find((r) => r.invoiceId === invoice.id);
  const paidAt = existingReceipt?.createdAt; // ISO string

  const customer = invoice.customer || {};
  const hasItemTaxes = invoice.items.some((item) => item.tax > 0);
  const dateData = calcDueDate(invoice);

  useEffect(() => {
    document.title = `Invoice-${invoice.no || invoice.name}`;
  }, [invoice]);

  const sendInvToCustomer = () => {
    const updatedInv = { ...invoice, status: "Sent" };
    updateInvoice(updatedInv);
    setFeedback(true);
  };

  return (
    <div className="max-w-[800px] mx-auto p-6 bg-gray-50 rounded shadow-md space-y-6">
      {/* Modals */}
      {/*  */}

      <BasicModal open={feedback} onClose={() => setFeedback(false)}>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Invoice Sent</h2>
          <p>
            The invoice, {invoice.name} has been sent to the customer
            successfully.
          </p>
        </div>
      </BasicModal>

      <BasicModal
        open={receiptGenerated}
        onClose={() => setReceiptGenerated(false)}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Receipt Generated!
          </h2>
          <p className="text-gray-600">
            The invoice <strong>{invoice.name}</strong> has been marked as paid.
            You can now view the receipt.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outlined"
              onClick={() => setReceiptGenerated(false)}
              sx={{ px: 3, py: 1, fontSize: 14 }}
            >
              Close
            </Button>
            <NavLink to={`/receipts/view/${existingReceipt?.id || "new"}`}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  px: 3,
                  py: 1,
                  fontSize: 14,
                }}
              >
                View Receipt
              </Button>
            </NavLink>
          </div>
        </div>
      </BasicModal>

      <FormModal
        open={formMode}
        invoice={invoice}
        onSubmit={() => {
          setFormMode(false);
          setReceiptGenerated(true);
        }}
      />
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">{invoice.name}</h1>
        <p className="text-gray-600">
          Invoice No: <span className="font-semibold">{invoice.no}</span>
        </p>
        <div className="flex justify-center items-center gap-2">
          <Chip
            sx={{ fontSize: "14px", fontWeight: 500 }}
            label={
              existingReceipt
                ? `Paid at ${new Date(paidAt).toLocaleDateString()}`
                : invoice.status
            }
            color={
              existingReceipt ||
              invoice.status === "Sent" ||
              invoice.status === "Paid"
                ? "success"
                : invoice.status === "Draft"
                ? "warning"
                : "default"
            }
            variant="filled"
          />
          {invoice.status !== "Paid" && (
            <Chip
              icon={
                dateData.daysUntilDue > 3 ? (
                  <CheckCircle2Icon />
                ) : (
                  <CircleAlert />
                )
              }
              label={dateData.dueBadge.text}
              color={dateData.dueBadge.color}
              variant="outlined"
            />
          )}
        </div>
      </div>

      {/* Invoice & Customer Info */}
      <div className="grid grid-cols-2 gap-6">
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
          {customer.name && <p>{customer.name}</p>}
          {customer.email && <p>{customer.email}</p>}
          {customer.address && <p>{customer.address}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse bg-white rounded shadow-sm overflow-hidden">
        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="py-2 px-2">#</th>
            <th className="py-2 px-2">Item</th>
            <th className="py-2 px-2">Description</th>
            <th className="py-2 px-2 text-right">Qty</th>
            <th className="py-2 px-2 text-right">Price</th>
            {hasItemTaxes && <th className="py-2 px-2 text-right">Tax</th>}
            <th className="py-2 px-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="py-2 px-2">{idx + 1}</td>
              <td className="py-2 px-2">{item.name}</td>
              <td className="py-2 px-2">{item.description}</td>
              <td className="py-2 px-2 text-right">{item.quantity}</td>
              <td className="py-2 px-2 text-right">${item.price.toFixed(2)}</td>
              {hasItemTaxes && (
                <td className="py-2 px-2 text-right">
                  {item.tax > 0 ? `${item.tax}%` : "-"}
                </td>
              )}
              <td className="py-2 px-2 text-right">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-1 bg-white shadow p-4 rounded text-right">
          <p>
            <strong>Subtotal:</strong> ${invoice.itemsSubtotal.toFixed(2)}
          </p>
          <p>
            <strong>Tax:</strong> ${invoice.taxAmount.toFixed(2)}
          </p>
          <p className="text-xl font-bold">
            Total: ${invoice.total.toFixed(2)}
          </p>
          {existingReceipt && (
            <p className="text-sm text-gray-500">
              Paid At: {new Date(paidAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 w-full flex justify-between">
        {/* Left side */}
        <div className="flex gap-2">
          {/* <Button variant="contained">Edit</Button> */}

          {invoice.status === "Draft" && (
            <div className="flex gap-2">
              <NavLink to="/invoices/create" state={{ invoiceId: invoice.id }}>
                <Button variant="contained">Edit Invoice</Button>
              </NavLink>
              <Button variant="contained" onClick={() => sendInvToCustomer()}>
                Send to Customer
              </Button>
            </div>
          )}

          {invoice.status === "Sent" && (
            <Button variant="contained" onClick={() => setFormMode(true)}>
              Mark as Paid
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {/* View as PDF - secondary */}
          <NavLink to={`/invoices/view/${invoice.id}/pdf-preview`}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#3b82f6",
                color: "#3b82f6",
                px: 3,
                py: 1,
                fontSize: 14,
                // textTransform: "none",
              }}
            >
              PDF Preview
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
