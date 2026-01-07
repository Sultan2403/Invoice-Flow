import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { NavLink } from "react-router-dom";

export default function InvoiceTable({ invoices }) {
  return (
    <div className="overflow-auto w-full h-full">
      <TableContainer component={Paper}>
        <Table aria-label="Invoice Table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>S.N</TableCell>
              <TableCell>Invoice Name</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell align="right">Items Count</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Subtotal ($)</TableCell>
              <TableCell align="right">Tax on all items ($)</TableCell>
              <TableCell align="right">Total ($)</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices && invoices.length > 0 ? (
              <>
                {invoices.map((invoice, index) => (
                  <TableRow
                    key={invoice.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{invoice.invoice_name}</TableCell>
                    <TableCell>{invoice.customer.name}</TableCell>
                    <TableCell align="right">
                      {invoice.items.length}{" "}
                      {invoice.items.length > 1 ? "Items" : "Item"}
                    </TableCell>
                    <TableCell align="right">{invoice.status}</TableCell>
                    <TableCell align="right">
                      ${invoice.itemsSubtotal.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{invoice.tax}%</TableCell>
                    <TableCell align="right">
                      ${invoice.total.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <NavLink
                        to={`/invoices/view/${invoice.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </NavLink>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Add More Invoices Button */}
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <NavLink to="/invoices/create">
                      <button className="px-6 py-3 text-white bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition">
                        Add More Invoices
                      </button>
                    </NavLink>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <div className="flex flex-col gap-3 items-center">
                    <span className="font-semibold text-xl">
                      No invoices yet...
                    </span>
                    <NavLink to="/create-invoice">
                      <button className="px-6 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Create an Invoice
                      </button>
                    </NavLink>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
