import { useState } from "react";
import InvoiceTemplate from "./invoiceTemplate";
import exportPdf from "./exportpdf";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

export default function PreviewInvoice({ invoices }) {
  const [isPrinting, setIsPrinting] = useState(false);
  const { invoiceId } = useParams();

  const invoice = invoices.find((inv) => inv.id === invoiceId);
  document.title = invoice.name;

  if (!invoice) {
    return (
      <div className="p-8 text-center text-gray-600">Invoice not found</div>
    );
  }

  const handleExport = () => {
    setIsPrinting(true);
    exportPdf({
      invoice,
      onComplete: () => setIsPrinting(false),
    });
  };

  return (
    <div className="max-w-[800px] mx-auto p-4 ">
      <InvoiceTemplate invoice={invoice} />{" "}
      <div className="flex justify-end mb-4 mt-4">
        <Button
          onClick={handleExport}
          loading={isPrinting}
          disabled={isPrinting}
          loadingIndicator="Printing..."
          variant="contained"
          color="primary"
        >
          Print as PDF
        </Button>
      </div>
    </div>
  );
}
