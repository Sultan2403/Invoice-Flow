import ReceiptTemplate from "./receiptTemplate";
import exportPdf from "../../../../../Utils/exportpdf";

export default function PreviewReceipt() {
  const receipt = useReceiptId(getReceipts());
  const [isPrinting, setIsPrinting] = useState(false);
  const [template, setTemplate] = useState(getSavedReceiptTemplate());

  if (!receipt) {
    return (
      <div className="p-8 text-center text-gray-600">Receipt not found</div>
    );
  }

  document.title = `Receipt ${receipt.no}`;
  const element = document.getElementById("receipt-preview");

  const handleExport = () => {
    setIsPrinting(true);
    exportPdf({
      receipt,
      element,
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
      </p>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <Button variant="contained" onClick={handleExport}>
          Download PDF
        </Button>
      </div>

      {/* Preview */}
      <div className="bg-white shadow-2xl rounded-lg overflow-auto">
        <ReceiptTemplate receipt={receipt} template={template} />
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
