import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

import InvoiceTemplate from "./invoiceTemplate";
import exportPdf from "./exportpdf";
import { getInvoices } from "../../Helpers/Local Storage/getInvoices";
import {
  getSavedTemplate,
  saveTemplate,
} from "../../Helpers/Local Storage/templates";
import useInvoiceId from "../../Hooks/useInvoice";

export default function PreviewInvoice() {
  const invoice = useInvoiceId(getInvoices());
  const [isPrinting, setIsPrinting] = useState(false);

  const TEMPLATES = [
    { id: "classic", label: "Classic" },
    { id: "modern", label: "Modern" },
    { id: "compact", label: "Compact" },
  ];

  const [template, setTemplate] = useState(getSavedTemplate());

  if (!invoice) {
    return (
      <div className="p-8 text-center text-gray-600">Invoice not found</div>
    );
  }

  document.title = invoice.name;

  const handleTemplateChange = (id) => {
    setTemplate(id);
    saveTemplate(id);
  };

  const handleExport = () => {
    setIsPrinting(true);
    exportPdf({
      invoice,
      onComplete: () => setIsPrinting(false),
    });
  };

  return (
    <div className="max-w-[900px] mx-auto p-6 flex flex-col gap-6 bg-gray-50 rounded-lg">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Invoice Preview
      </h1>
      <p className="text-center text-gray-600">
        Review your invoice before exporting it. Select a template or export
        PDF.
      </p>

      {/* Top controls */}
      <div className="flex items-center justify-between gap-4 mt-4">
        {/* Template buttons left */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTemplateChange(t.id)}
              className={`px-3 py-1.5 rounded text-sm border transition ${
                template === t.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Export PDF button right */}
        <Button
          onClick={handleExport}
          disabled={isPrinting}
          variant="contained"
        >
          {isPrinting ? "Printing…" : "Export PDF"}
        </Button>
      </div>

      {/* Invoice preview with badge */}
      <div className="flex justify-center relative mt-4">
        {/* Status badge */}
        {invoice.status && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg border-2 border-white
                ${
                  invoice.status === "Draft"
                    ? "bg-yellow-400 text-yellow-900"
                    : invoice.status === "Paid"
                    ? "bg-green-400 text-green-900"
                    : "bg-gray-400 text-white"
                }`}
            >
              {invoice.status}
            </span>
          </div>
        )}

        <div className="bg-white shadow-2xl rounded-lg w-full overflow-auto">
          <InvoiceTemplate invoice={invoice} template={template} />
        </div>
      </div>
    </div>
  );
}
