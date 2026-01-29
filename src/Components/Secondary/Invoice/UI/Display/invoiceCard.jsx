import { NavLink, useNavigate } from "react-router-dom";
import { getInvoices } from "../../Helpers/Storage/getInvoices";
import { Eye, PlusCircle, Pencil, Info } from "lucide-react";
import { currencyFormatter } from "../../../../../Utils/helpers";

export default function InvoiceTable() {
  const invoices = getInvoices();
  document.title = "Invoices";

  // Show newest first
  const sortedInvoices = [...invoices].reverse();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
      {invoices && invoices.length > 0 ? (
        <>
          {/* Header with Title and Add Button */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
            <NavLink to="/invoices/create">
              <button className="px-5 py-2 flex items-center gap-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
                <PlusCircle size={18} /> Add Invoice
              </button>
            </NavLink>
          </div>

          <div className="rounded-lg shadow-lg bg-white overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse table-fixed">
              {/* Header */}
              <thead className="bg-blue-600 text-white text-sm font-semibold shadow-sm">
                <tr className="border-b border-blue-700">
                  <th className="py-4 px-4 w-12 text-left">S.N</th>
                  <th className="py-4 px-4 w-32 text-left">Invoice No.</th>
                  <th className="py-4 px-4 min-w-[180px] text-left">
                    Invoice Name
                  </th>
                  <th className="py-4 px-4 min-w-[180px] text-left">
                    Customer
                  </th>
                  <th className="py-4 px-4 w-16 text-right">Items</th>
                  <th className="py-4 px-4 w-24 text-center">Status</th>
                  <th className="py-4 px-4 w-32 text-right">Subtotal</th>
                  <th className="py-4 px-4 w-24 text-right">
                    <div className="flex items-center justify-end gap-1">
                      Tax
                      <Info size={14} title="Tax applied to items in invoice" className="cursor-help" />
                    </div>
                  </th>
                  <th className="py-4 px-4 w-32 text-right">Total</th>
                  <th className="py-4 px-4 min-w-[160px] text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="text-sm text-gray-800">
                {sortedInvoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition border-t border-gray-200`}
                  >
                    <td className="py-4 px-4 font-medium text-gray-700">{index + 1}</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">{invoice.no}</td>
                    <td className="py-4 px-4 border-l border-gray-100 whitespace-normal">
                      {invoice.name}
                    </td>
                    <td className="py-4 px-4 border-l border-gray-100 whitespace-normal">
                      {invoice.customer?.name || "—"}
                    </td>
                    <td className="py-4 px-4 text-right border-l border-gray-100 font-medium">
                      {invoice.items?.length || 0}
                    </td>
                    <td className="py-4 px-4 text-center border-l border-gray-100">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : invoice.status === "Sent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium border-l border-gray-100">
                      {currencyFormatter.format(invoice.itemsSubtotal || 0)}
                    </td>
                    <td className="py-4 px-4 text-right border-l border-gray-100">
                      {invoice.tax || 0}%
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-blue-700 border-l border-gray-100">
                      {currencyFormatter.format(invoice.total || 0)}
                    </td>
                    <td className="py-4 px-4 border-l border-gray-100">
                      <div className="flex justify-center gap-2">
                        <NavLink
                          to={`/invoices/view/${invoice.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-100 rounded transition text-xs font-medium"
                        >
                          <Eye size={14} /> View
                        </NavLink>
                        <NavLink to={`/invoices/edit/${invoice.id}`}>
                          <button className="inline-flex items-center gap-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded transition text-xs font-medium">
                            <Pencil size={14} /> Edit
                          </button>
                        </NavLink>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Invoice */}
          <div className="flex justify-center mt-8">
            <NavLink to="/invoices/create">
              <button className="px-5 py-2 flex items-center gap-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md text-sm">
                <PlusCircle size={18} /> Add Invoice
              </button>
            </NavLink>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">No invoices yet</h2>
          <p className="text-gray-600 max-w-md">
            Get started by{" "}
            <NavLink
              to="/invoices/create"
              className="text-blue-600 font-semibold hover:underline"
            >
              creating your first invoice
            </NavLink>
            .
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
