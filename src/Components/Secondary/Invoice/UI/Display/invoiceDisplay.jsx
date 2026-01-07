import { useMemo, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import { CircleAlert } from "lucide-react";
import calcDueDate from "../../Helpers/calcDueDate";

export default function DisplayInvoice({ invoices }) {
  const { invoiceId } = useParams();
  const invoice = useMemo(
    () => invoices.find((inv) => String(inv.id) === invoiceId),
    [invoices, invoiceId]
  );

  const hasItemTaxes = invoice.items.some((item) => item.tax > 0);
  const customer = invoice.customer || {};

  const dateData = calcDueDate(invoice);

  useEffect(() => {
    document.title = `Invoice-${invoice.invoice_no || invoice.invoice_name}`;
  }, [invoice]);

  return (
    <div className="max-w-[800px] mx-auto p-6 bg-gray-50 rounded shadow-md">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-1 text-gray-800">
          {invoice.invoice_name}
        </h1>
        <p className="text-gray-600">
          Invoice No:{" "}
          <span className="font-semibold">{invoice.invoice_no}</span>
        </p>

        <div className="mt-2 flex justify-center items-center gap-2">
          <Chip
            label={invoice.status}
            color={
              invoice.status === "Draft"
                ? "warning"
                : invoice.status === "Paid"
                ? "success"
                : "default"
            }
            variant="filled"
          />
          <Chip
            icon={<CircleAlert />}
            label={dateData.dueBadge.text}
            color={dateData.dueBadge.color}
            variant="outlined"
          />
        </div>
      </div>

      {/* Invoice & Customer Info */}
      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <p>
            <strong>Issue Date:</strong> {invoice.issueDate}
          </p>
          <p>
            <strong>Due Date:</strong> {invoice.dueDate}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Bill To:</p>
          {customer.name && <p>{customer.name}</p>}
          {customer.email && <p>{customer.email}</p>}
          {customer.address && <p>{customer.address}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-6 bg-white rounded overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-2 text-left">#</th>
            <th className="py-2 px-2 text-left">Item</th>
            <th className="py-2 px-2 text-left">Description</th>
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
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-2 text-right bg-white shadow p-4 rounded">
          <p>
            <strong>Subtotal:</strong> ${invoice.itemsSubtotal.toFixed(2)}
          </p>
          <p>
            <strong>Tax:</strong> ${invoice.taxAmount.toFixed(2)}
          </p>
          <p className="text-xl font-bold">
            Total: ${invoice.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mb-4">
        <NavLink to={`/invoices/view/${invoice.id}/pdf-preview`}>
          <Button variant="contained" color="success">
            View as PDF template
          </Button>
        </NavLink>

        {/* <Button variant="outlined" color="primary">Edit</Button>
        <Button variant="outlined" color="error">Delete</Button> */}
      </div>
    </div>
  );
}
