import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function InvoiceTable({ invoice }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>S.N</TableCell>
            <TableCell>Invoice Name</TableCell>
            <TableCell align="right">Customer Name</TableCell>
            <TableCell align="right">Price ($)</TableCell>
            <TableCell align="right">Quantity (units)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice && invoice.length > 0 ? (
            invoice.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.invoice_name}</TableCell>
                <TableCell align="right">{row.customer_name}</TableCell>
                <TableCell align="right">${row.price}</TableCell>
                <TableCell align="right">{row.quantity} units</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                <span className="font-semibold text-xl">
                  No invoices yet...
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
