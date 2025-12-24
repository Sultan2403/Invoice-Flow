import { useState } from "react";
export default function CreateInvoice() {
  const [invoice_name, set_invoice_Name] = useState("");
  const [customer_name, set_customer_Name] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [price, setPrice] = useState(null);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form className="max-w-3xl w-full mx-auto p-6 bg-white rounded-md shadow-sm space-y-4">
        <h2 className="text-2xl font-semibold text-center">Create Invoice</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customer" className="block text-sm">
              Customer Name
            </label>
            <input
              id="customer"
              name="customer"
              type="text"
              placeholder="John Doe"
              onChange={(e) => set_customer_Name(e.target.value)}
              className="mt-1 block w-full px-2 py-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="invoice" className="block text-sm">
              Invoice Name
            </label>
            <input
              id="invoice"
              name="invoice"
              type="text"
              placeholder="Website Design"
              className="mt-1 block w-full px-2 py-2 border rounded"
              onChange={(e) => set_invoice_Name(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              defaultValue={1}
              className="mt-1 block w-full px-2 py-2 border rounded"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              className="mt-1 block w-full px-2 py-2 border rounded"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
