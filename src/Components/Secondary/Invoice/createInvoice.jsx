import { useState, useEffect } from "react";
import { submitInvoice, validateInvoice } from "../../../Utils/helpers";
import { Check, CircleAlert, FilePlus } from "lucide-react";
import SimpleModal from "../../UI/Modal/modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function CreateInvoice() {
  const [invoice_name, setInvoiceName] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const [touched, setTouched] = useState({});

  // Validate a single field as the user types and update that field's error
  function handleFieldChange(field, value) {
    // update local state
    if (field === "invoice_name") setInvoiceName(value);
    if (field === "customer_name") setCustomerName(value);
    if (field === "quantity") setQuantity(value);
    if (field === "price") setPrice(value);

    setTouched((s) => ({ ...s, [field]: true }));

    // Run the per-field validator exposed on validateInvoice
    const fieldError = validateInvoice.field(field, value);

    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) next[field] = fieldError;
      else delete next[field];
      return next;
    });
  }

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
      setQuantity("");
      setPrice("");
      setErrors({});
      setSuccess(null);

      // later: redirect here
      // navigate("/dashboard");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [success]);

  return (
    <div className="h-full w-full flex flex-col gap-3 items-center justify-center bg-gray-50 p-6">
      <FormControl className="w-full">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl w-full mx-auto  p-6 bg-white rounded-md shadow-sm space-y-4 relative"
        >
          <h2 className="text-2xl font-semibold text-center">Create Invoice</h2>

          <div>
            <TextField
              label="Invoice Name"
              id="invoice-name"
              error={Boolean(errors.invoice_name)}
              helperText={errors.invoice_name || ""}
              value={invoice_name}
              onChange={(e) =>
                handleFieldChange("invoice_name", e.target.value)
              }
              fullWidth
            ></TextField>
          </div>

          <div>
            <TextField
              label="Customer Name"
              id="customer-name"
              error={errors.customer_name}
              helperText={errors.customer_name}
              value={customer_name}
              onChange={(e) =>
                handleFieldChange("customer_name", e.target.value)
              }
              fullWidth
            ></TextField>
          </div>

          <div>
            <TextField
              label="Quantity (units)"
              id="quantity"
              type="number"
              error={errors.quantity}
              helperText={errors.quantity}
              value={quantity}
              onChange={(e) => handleFieldChange("quantity", e.target.value)}
              fullWidth
            ></TextField>
          </div>

          <div>
            <TextField
              label="Price ($)"
              id="price"
              type="number"
              error={errors.price}
              helperText={errors.price}
              value={price}
              onChange={(e) => handleFieldChange("price", e.target.value)}
              fullWidth
            ></TextField>
          </div>

          <div className="flex justify-center">
            <Button
              variant="contained"
              size="large"
              type="submit"
              startIcon={<FilePlus className="w-4 h-4" />}
            >
              Create Invoice
            </Button>
          </div>
        </form>

        {/* Message container: shows success and/or errors in one place */}

        <SimpleModal open={feedback} onClose={() => setFeedback(false)}>
          <div
            className="mt-2 flex flex-col items-center gap-2 absolute top-[50%] left-[50%]"
            role="status"
            aria-live="polite"
          >
            {success && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded transition-all duration-3000">
                <Check className="text-green-700" />
                <span className="font-semibold">
                  Invoice created successfully
                </span>
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <div className="text-sm text-red-700 bg-red-50 font-medium p-2 rounded inline-flex items-center gap-2">
                <CircleAlert className="text-red-700" />
                <span>Please fix the errors and try again</span>
              </div>
            )}
          </div>
        </SimpleModal>
      </FormControl>
    </div>
  );
}
