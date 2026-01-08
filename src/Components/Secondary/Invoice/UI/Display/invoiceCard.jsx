import { NavLink } from "react-router-dom";
import { getInvoices } from "../../Helpers/Local Storage/getInvoices";
import { Eye, PlusCircle, Pencil, Info } from "lucide-react";

export default function InvoiceTable() {
  const invoices = getInvoices();
  document.title = "Invoices";

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Show newest first
  const sortedInvoices = [...invoices].reverse();

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-6 bg-gray-50">
      {invoices && invoices.length > 0 ? (
        <>
          <div className="w-full rounded-lg shadow-lg bg-white overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse table-fixed">
              {/* Header */}
              <thead className="bg-blue-600 text-blue-50 text-[13px] font-semibold shadow-sm">
                <tr className="border-b border-blue-700/60">
                  <th className="py-4 px-4 w-12 text-left">S.N</th>
                  <th className="py-4 px-4 w-32 text-left">Invoice No.</th>
                  <th className="py-4 px-4 min-w-[220px] text-left">
                    Inv Name
                  </th>
                  <th className="py-4 px-4 min-w-[220px] text-left">
                    Customer Name
                  </th>
                  <th className="py-4 px-4 w-16 text-right">Items</th>
                  <th className="py-4 px-4 w-24 text-center">Status</th>
                  <th className="py-4 px-4 w-32 text-right">Subtotal</th>
                  <th className="py-4 px-4 w-24 text-right">
                    <div className="flex items-center justify-end gap-1">
                      Tax
                      <span
                        title="This tax is applied globally to all items in the invoice"
                        className="cursor-pointer text-white"
                      >
                        <Info size={14} />
                      </span>
                    </div>
                  </th>
                  <th className="py-4 px-4 w-32 text-right">Total</th>
                  <th className="py-4 px-4 min-w-[180px] text-center">
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
                    <td className="py-4 px-4 font-medium">{index + 1}</td>
                    <td className="py-4 px-4 font-medium">{invoice.no}</td>
                    <td className="py-4 px-4 font-medium border-l border-gray-200 whitespace-normal">
                      {invoice.name}
                    </td>
                    <td className="py-4 px-4 border-l border-gray-200 whitespace-normal">
                      {invoice.customer.name}
                    </td>
                    <td className="py-4 px-4 text-right border-l border-gray-200">
                      {invoice.items.length}
                    </td>
                    <td className="py-4 px-4 text-center border-l border-gray-200">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium border-l border-gray-200">
                      {currencyFormatter.format(invoice.itemsSubtotal)}
                    </td>
                    <td className="py-4 px-4 text-right border-l border-gray-200">
                      {invoice.tax}%
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-blue-800 border-l border-gray-200">
                      {currencyFormatter.format(invoice.total)}
                    </td>
                    <td className="py-4 px-4 border-l border-gray-200">
                      <div className="flex justify-center gap-2">
                        <NavLink
                          to={`/invoices/view/${invoice.id}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          <Eye size={14} /> View
                        </NavLink>
                        <button
                          disabled
                          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs font-medium"
                        >
                          <Pencil size={14} /> Edit
                        </button>
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
        <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-2">
          <p className="text-gray-700 text-lg font-medium">
            You don’t have any invoices yet.
          </p>
          <p className="text-gray-500">
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
  );
}
