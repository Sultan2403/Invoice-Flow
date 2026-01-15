import ReceiptTemplate from "./receiptTemplate";
import exportPdf from "../../../../../Utils/exportpdf";
import getReceipts from "../../Helpers/Storage/getReceipts";
import useReceiptId from "../../Hooks/useReceipt";
import {
  getSavedReceiptTemplate,
  saveReceiptTemplate,
} from "../../Helpers/Storage/templates.helpers";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useRef } from "react";

export default function PreviewReceipt() {
  const receipt = useReceiptId(getReceipts());
  const [isPrinting, setIsPrinting] = useState(false);
  const [template, setTemplate] = useState(
    getSavedReceiptTemplate() || "classic"
  );

  if (!receipt) {
    return (
      <div className="p-8 text-center text-gray-600">Receipt not found</div>
    );
  }

  document.title = `Receipt ${receipt.no}`;
  const previewRef = useRef(null);

  const TEMPLATES = [
    { id: "classic", label: "Classic" },
    { id: "modern", label: "Modern" },
    { id: "compact", label: "Compact" },
  ];

  const handleExport = () => {
    setIsPrinting(true);
    exportPdf({
      data: receipt,
      element: previewRef.current,
      onComplete: () => setIsPrinting(false),
    });
  };

  return (
    <div className="max-w-[900px] mx-auto p-6 flex flex-col gap-6 bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Receipt Preview
      </h1>
      <p className="text-center text-gray-600">
        Receipt #{receipt.no} · Paid via {receipt.paymentMethod}
      </p>{" "}
      {/* Template switcher */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          Select a receipt layout before exporting or sending.
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTemplate(t.id);
                  saveReceiptTemplate(t.id);
                }}
                className={`px-3 py-1.5 rounded text-sm border transition
            ${
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
            variant="contained"
            loading={isPrinting}
            onClick={handleExport}
          >
            Download PDF
          </Button>
        </div>
      </div>
      {/* Preview */}
      <div className="bg-white shadow-2xl rounded-lg overflow-auto">
        <ReceiptTemplate
          ref={previewRef}
          receipt={receipt}
          template={template}
        />
      </div>
      {/* Footer actions */}
      <div className="flex justify-between">
        <Button variant="outlined">Back to Invoice</Button>

        {receipt.customer?.email && (
          <Button variant="contained">Send to Customer</Button>
        )}
      </div>
    </div>
  );
}
