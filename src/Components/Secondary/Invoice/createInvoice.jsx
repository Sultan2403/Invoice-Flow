import { useState, useEffect } from "react";
import { submitInvoice, validateInvoice } from "../../../Utils/helpers";
import {
  Check,
  CircleAlert,
  EditIcon,
  FilePlus,
  PlusIcon,
  Trash2,
  Trash2Icon,
} from "lucide-react";
import SimpleModal from "../../UI/Modal/modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function CreateInvoice() {
  const [invoice_name, setInvoiceName] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const [items, setItems] = useState([]);
  const [draftItem, setDraftItems] = useState(null);
  const [draftErrs, setDraftErrors] = useState({});

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  function AddRow() {
    setDraftItems({ description: "", quantity: 0, price: 0 });
  }

  function ValidateDraft() {
    const errs = {};
    if (!draftItem.description.trim()) {
      errs.description = "Item description is required";
    }
    if (draftItem.quantity <= 0) {
      errs.quantity = "Quantity must be greater than zero";
    }
    if (draftItem.price <= 0) {
      errs.price = "Price must be greater than zero";
    }

    setDraftErrors(errs);
    return errs;
  }

  function SaveDraft() {
    if (Object.keys(ValidateDraft()).length > 0) return;
    setItems((prevItems) => [...prevItems, draftItem]);
    console.log(items);

    setDraftItems(null);
    setDraftErrors({});
  }

  function DeleteDraft() {
    setDraftItems(null);
    setDraftErrors({});
  }

  function EditItem(id) {
    const itemToEdit = items.find((item) => item.id === id);
    setDraftItems(itemToEdit);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  function removeItem(id) {
    setItems((prevItems) => prevItems.filter((_, i) => i !== i.id));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const invoice = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      invoice_name,
      customer_name,
      total,
      items,
    };

    const validationErrors = validateInvoice(invoice);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      submitInvoice(invoice);
      setSuccess(true);
      setFeedback(true);
      return;
    }

    setSuccess(false);
    setFeedback(true);
  }

  useEffect(() => {
    if (!success) return;

    const timeout = setTimeout(() => {
      // close modal
      setFeedback(false);

      // reset form
      setInvoiceName("");
      setCustomerName("");

      setErrors({});
      setSuccess(null);

      // later: redirect here
      // navigate("/dashboard");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [success]);

  return (
    <div className="h-full w-full flex justify-center bg-gray-50 p-6">
      <FormControl className="w-full">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl w-full mx-auto p-6 bg-white rounded-md shadow-sm space-y-6"
        >
          {/* ===== Header ===== */}
          <h2 className="text-2xl font-semibold text-center">Create Invoice</h2>

          {/* ===== Invoice Meta ===== */}
          <section className="space-y-4">
            <TextField
              label="Invoice Name"
              id="invoice-name"
              error={Boolean(errors.invoice_name)}
              helperText={errors.invoice_name || ""}
              value={invoice_name}
              onChange={(e) => setInvoiceName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Customer Name"
              id="customer-name"
              error={Boolean(errors.customer_name)}
              helperText={errors.customer_name}
              value={customer_name}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
            />
          </section>

          {/* ===== Draft Item Editor ===== */}
          {draftItem && (
            <section className="border rounded-md p-4 bg-gray-50 space-y-4">
              <h3 className="font-semibold">Add / Edit Item</h3>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <TextField
                  className="md:col-span-2"
                  label="Item Description"
                  value={draftItem.description}
                  error={Boolean(draftErrs.description)}
                  helperText={draftErrs.description}
                  onChange={(e) =>
                    setDraftItems({
                      ...draftItem,
                      description: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Quantity"
                  type="number"
                  value={draftItem.quantity}
                  defaultValue={1}
                  error={Boolean(draftErrs.quantity)}
                  helperText={draftErrs.quantity}
                  onChange={(e) =>
                    setDraftItems({
                      ...draftItem,
                      quantity: +e.target.value,
                    })
                  }
                />

                <TextField
                  label="Price ($)"
                  type="number"
                  value={draftItem.price}
                  defaultValue={null}
                  error={Boolean(draftErrs.price)}
                  helperText={draftErrs.price}
                  onChange={(e) =>
                    setDraftItems({
                      ...draftItem,
                      price: +e.target.value,
                    })
                  }
                />

                <div className="flex items-end gap-2 md:col-span-2">
                  <Button
                    onClick={SaveDraft}
                    startIcon={<PlusIcon />}
                    variant="outlined"
                  >
                    Save
                  </Button>

                  <Button
                    onClick={DeleteDraft}
                    startIcon={<Trash2Icon />}
                    className="text-white bg-red-600"
                    variant="text"
                    color="error"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* ===== Items List ===== */}
          {items.length > 0 && (
            <section className="space-y-3">
              <div className="grid grid-cols-8 gap-4 font-semibold text-sm border-b pb-2">
                <div>Description</div>
                <div>Qty</div>
                <div>Price</div>
                <div>Total</div>
                <div className="col-span-2"></div>
              </div>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-8 gap-4 items-center text-sm"
                >
                  <div>{item.description}</div>
                  <div>{item.quantity}</div>
                  <div>${item.price.toFixed(2)}</div>
                  <div>${(item.price * item.quantity).toFixed(2)}</div>

                  <div className="col-span-3 flex gap-3">
                    <Button
                      onClick={() => EditItem(item.id)}
                      startIcon={<PlusIcon />}
                      variant="outlined"
                      size="medium"
                      className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => removeItem(item.id)}
                      startIcon={<Trash2Icon />}
                      variant="contained"
                      size="medium"
                      color="error"
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* ===== Total ===== */}
          {items.length > 0 && (
            <div className="text-right font-bold text-lg">
              Total Amount: ${total.toFixed(2)}
            </div>
          )}

          {/* ===== Actions ===== */}
          <section className="flex justify-between items-center">
            <Button
              startIcon={<PlusIcon />}
              onClick={AddRow}
              variant="outlined"
              disabled={Boolean(draftItem)}
            >
              Add Item
            </Button>

            <Button
              variant="contained"
              size="large"
              type="submit"
              startIcon={<FilePlus className="w-4 h-4" />}
            >
              Create Invoice
            </Button>
          </section>
        </form>

        {/* ===== Feedback Modal ===== */}
        <SimpleModal open={feedback} onClose={() => setFeedback(false)}>
          <div className="flex flex-col items-center gap-3">
            {success && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded">
                <Check />
                <span className="font-semibold">
                  Invoice created successfully
                </span>
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded">
                <CircleAlert />
                <span>Please fix the errors and try again</span>
              </div>
            )}
          </div>
        </SimpleModal>
      </FormControl>
    </div>
  );
}
