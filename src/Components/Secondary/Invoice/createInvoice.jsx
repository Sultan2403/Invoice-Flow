import { useState, useEffect } from "react";
import { submitInvoice, validateInvoice } from "../../../Utils/helpers";
import { Check, CircleAlert } from "lucide-react";

export default function CreateInvoice() {
  const [invoice_name, setInvoiceName] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    const invoice = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      invoice_name,
      customer_name,
      quantity,
      price,
    };

    const validationErrors = validateInvoice(invoice);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      submitInvoice(invoice);
      setSuccess(true);
    }
  }

  // clear success banner after 3 seconds
  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(timeout);
  }, [success]);

  return (
    <div className="h-full w-full flex flex-col gap-3 items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full mx-auto p-6 bg-white rounded-md shadow-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Create Invoice</h2>

        <div>
          <label className="block text-sm">Invoice Name</label>
          <input
            type="text"
            value={invoice_name}
            onChange={(e) => setInvoiceName(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
          {errors.invoice_name && (
            <p className="text-xs text-red-600 mt-1">{errors.invoice_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm">Customer Name (Full Name)</label>
          <input
            type="text"
            value={customer_name}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
          {errors.customer_name && (
            <p className="text-xs text-red-600 mt-1">{errors.customer_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm">Quantity (units)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
          {errors.quantity && (
            <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm">Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
          {errors.price && (
            <p className="text-xs text-red-600 mt-1">{errors.price}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Create Invoice
        </button>
      </form>

      {/* Message container: shows success and/or errors in one place */}
      <div
        className="mt-2 flex flex-col items-center gap-2"
        role="status"
        aria-live="polite"
      >
        {success && (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded transition-all duration-3000">
            <Check className="text-green-700" />
            <span className="font-semibold">Invoice created successfully</span>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="text-sm text-red-700 bg-red-50 font-medium p-2 rounded inline-flex items-center gap-2">
            <CircleAlert className="text-red-700" />
            <span>Please fix the errors above</span>
          </div>
        )}
      </div>
    </div>
  );
}
