import { useRef, useState } from "react";
import { Button } from "@mui/material";

import InvoiceTemplate from "./invoiceTemplate";
import exportPdf from "../../../../../Utils/exportpdf";
import { getInvoices } from "../../Helpers/Storage/getInvoices";
import {
  getSavedTemplate,
  saveTemplate,
} from "../../Helpers/Storage/templates";
import useInvoiceId from "../../Hooks/useInvoice";

export default function PreviewInvoice() {
  const invoice = useInvoiceId(getInvoices());
  const [isPrinting, setIsPrinting] = useState(false);
  const previewRef = useRef(null);

  const TEMPLATES = [
    { id: "classic", label: "Classic" },
    { id: "modern", label: "Modern" },
    { id: "compact", label: "Compact" },
  ];

  const [template, setTemplate] = useState(getSavedTemplate() || "classic");

  if (!invoice) {
    return (
      <div className="p-8 text-center text-gray-600">Invoice not found</div>
    );
  }

  document.title = `Invoice ${invoice.name}`;

  const handleTemplateChange = (id) => {
    setTemplate(id);
    saveTemplate(id);
  };

  const handleExport = () => {
    if (!previewRef.current) return;
    setIsPrinting(true);
    exportPdf({
      data: invoice,
      element: previewRef.current,
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
        Review your invoice before exporting. Select a template or export PDF.
      </p>

      {/* Template selector + Export button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex flex-wrap gap-2 items-center">
          <p className="text-sm text-gray-500 w-full md:w-auto">
            Select an invoice layout:
          </p>
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

        <Button
          onClick={handleExport}
          variant="contained"
          disabled={isPrinting}
        >
          {isPrinting ? "Downloading..." : "Download PDF"}
        </Button>
      </div>

      {/* Invoice preview + status badge */}
      <div className="relative flex justify-center mt-6">
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
          <InvoiceTemplate
            ref={previewRef}
            invoice={invoice}
            template={template}
          />
        </div>
      </div>
    </div>
  );
}
