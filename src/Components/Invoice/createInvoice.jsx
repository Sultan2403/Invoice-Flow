import { useState } from "react";
import { submitInvoice, validateInvoice } from "./helpers";

export default function CreateInvoice() {
  const [invoice_name, setInvoiceName] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

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
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full mx-auto p-6 bg-white rounded-md shadow-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Create Invoice</h2>

        {Object.keys(errors).length > 0 && (
          <div className="text-sm text-red-700 bg-red-50 p-2 rounded">
            Please fix the errors below
          </div>
        )}

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
          <label className="block text-sm">Customer Name</label>
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
          <label className="block text-sm">Quantity</label>
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
          <label className="block text-sm">Price</label>
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
    </div>
  );
}
