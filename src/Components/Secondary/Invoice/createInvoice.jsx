// TODO: Fix tax logic, it's shit right now. :)

import { useState, useEffect } from "react";
import {
  submitInvoice,
  validateInvoice,
  calcLocalTax,
  calcGlobalTax,
} from "../../../Utils/helpers";
import {
  Check,
  CircleAlert,
  EditIcon,
  FilePlus,
  PlusIcon,
  Star,
  Trash2,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import SimpleModal from "../../UI/Modal/modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function CreateInvoice() {
  // Invoice metadata

  const [invoice_name, setInvoiceName] = useState("");
  const [customerData, setCustomerData] = useState({});

  // Items and item edit state

  const [items, setItems] = useState([]);
  const [draftItem, setDraftItems] = useState(null);
  const [draftErrs, setDraftErrors] = useState({});

  // Tax states

  const [globalTax, setGlobalTax] = useState(0);
  const [hasLocalTax, setHasLocalTax] = useState(false);
  const [hasGlobalTax, setHasGlobalTax] = useState(false);

  // Dates state

  const today = new Date().toISOString().split("T")[0];
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(null);

  // Feedback states

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [feedback, setFeedback] = useState(false);

  // Helpers :)

  const [editingItemId, setEditingItemId] = useState(null);
  // Total and tax calculations

  const itemsSubtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const itemsTotal = items.reduce((acc, item) => acc + item.total, 0);
  const globalTaxValues = calcGlobalTax({ items, globalTax });

  // ----------------------------------- Tax functions.....--------------------------------------------

  function AddLocalTax() {
    setHasLocalTax(true);
  }

  function RemoveLocalTax() {
    setHasLocalTax(false);
    setDraftItems({ ...draftItem, tax: 0 });
  }

  function AddGlobalTax() {
    setHasGlobalTax(true);
  }

  function RemoveGlobalTax() {
    setHasGlobalTax(false);
    setGlobalTax(0);
  }

  // ------------------------------ ITEMS LOGIC.......... ----------------------------------

  function AddRow() {
    setDraftItems({
      id: crypto.randomUUID(),
      name: "",
      tax: 0,
      description: "",
      quantity: 1,
      price: 0,
    });
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  //-------------------------------- ITEM EDIT LOGIC.......... ----------------------------------
  function StartItemEdit(id) {
    const itemToEdit = items.find((item) => item.id === id);
    // Take a snapshot
    setDraftItems({ ...itemToEdit });
    setEditingItemId(id); // mark this item as editing
  }

  function finalizeItemStructure() {
    const data = calcLocalTax({ draftItem });

    const finalDraftItem = {
      ...draftItem,
      ...data,
    };
    return finalDraftItem;
  }

  function saveEdits() {
    if (Object.keys(ValidateDraft()).length > 0) return;

    const finalItem = finalizeItemStructure();

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === editingItemId ? finalItem : item))
    );

    // Clear edit state
    setDraftItems(null);
    setEditingItemId(null);

    setDraftErrors({});
  }

  function CancelEdits() {
    setDraftItems(null);
    setEditingItemId(null);

    setDraftErrors({});
  }

  // ------------------------------ DRAFT ITEM LOGIC.......... ----------------------------------

  // -------------------- VALIDATION LOGIC.......... --------------------------

  function ValidateDraft() {
    const errs = {};
    if (!draftItem.name.trim()) {
      errs.name = "Item name is required";
    }
    if (!draftItem.description.trim()) {
      errs.description = "Item description is required";
    }
    if (typeof draftItem.quantity !== "number" || isNaN(draftItem.quantity)) {
      errs.quantity = "Quantity must be a valid number";
    } else if (draftItem.quantity <= 0) {
      errs.quantity = "Quantity must be greater than zero";
    }

    if (typeof draftItem.price !== "number" || isNaN(draftItem.price)) {
      errs.price = "Price must be a valid number";
    } else if (draftItem.price <= 0) {
      errs.price = "Price must be greater than zero";
    }

    if (hasLocalTax) {
      if (typeof draftItem.tax !== "number" || isNaN(draftItem.tax)) {
        errs.tax = "Tax must be a valid number";
      } else if (draftItem.tax <= 0) {
        errs.tax = "Tax must be greater than zero";
      }
    }

    setDraftErrors(errs);
    return errs;
  }

  // -------------------- SAVE, DELETE, EDIT LOGIC.......... --------------------------

  function SaveDraft() {
    if (Object.keys(ValidateDraft()).length > 0) return;

    const finalDraftItem = finalizeItemStructure();

    setItems((prevItems) => [...prevItems, finalDraftItem]);

    setDraftItems(null);
    setHasLocalTax(false);
    setDraftErrors({});
  }

  function DeleteDraft() {
    setDraftItems(null);
    setHasLocalTax(false);
    setDraftErrors({});
  }

  function handleSubmit(e) {
    e.preventDefault();

    const customer = {
      id: crypto.randomUUID(),
      ...customerData,
    };

    const invoice = {
      // INV METADATA
      id: crypto.randomUUID(),
      issueDate,
      dueDate,
      createdAt: new Date().toISOString(),
      invoice_name,
      items,
      // status,

      customer, // Customer Details

      ...globalTaxValues,
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
      setCustomerData({});
      setItems([]);
      setDraftItems(null);

      setErrors({});
      setSuccess(null);

      // later: redirect here
      // navigate("/dashboard");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [success]);

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 p-4 sm:p-6">
      <FormControl className="w-full max-w-4xl">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white p-6 rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">Create Invoice</h2>

          {/* Invoice Meta */}
          <section className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Invoice Name *"
              value={invoice_name}
              onChange={(e) => setInvoiceName(e.target.value)}
              fullWidth
              error={Boolean(errors.invoice_name)}
              helperText={errors.invoice_name}
            />
            <TextField
              label="Customer Name *"
              value={customerData.customer_name || ""}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  customer_name: e.target.value,
                })
              }
              fullWidth
              error={Boolean(errors.customer_name)}
              helperText={errors.customer_name}
            />
            <TextField
              label="Customer Email"
              value={customerData.customer_email || ""}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  customer_email: e.target.value,
                })
              }
              fullWidth
              error={Boolean(errors.customer_email)}
              helperText={errors.customer_email}
            />
            <TextField
              label="Customer Address"
              value={customerData.customer_address || ""}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  customer_address: e.target.value,
                })
              }
              fullWidth
              error={Boolean(errors.customer_address)}
              helperText={errors.customer_address}
            />
            <TextField
              label="Issue Date"
              type="date"
              value={issueDate}
              error={errors.issueDate}
              helperText={errors.issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: today,
                },
              }}
            />
            <TextField
              label="Due Date"
              type="date"
              value={dueDate || ""}
              error={errors.dueDate}
              helperText={errors.dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: issueDate },
              }}
            />
          </section>

          {/* Draft Item Editor */}
          {draftItem && (
            <fieldset className="border rounded-md p-4 bg-gray-50 space-y-4">
              <legend className="sr-only">Add or edit item</legend>
              <div className="grid gap-4 sm:grid-cols-6">
                <TextField
                  label="Item Name"
                  value={draftItem.name}
                  onChange={(e) =>
                    setDraftItems({ ...draftItem, name: e.target.value })
                  }
                  fullWidth
                  error={Boolean(draftErrs.name)}
                  helperText={draftErrs.name}
                  required
                />
                <TextField
                  label="Description"
                  value={draftItem.description}
                  onChange={(e) =>
                    setDraftItems({ ...draftItem, description: e.target.value })
                  }
                  fullWidth
                  sm={{ gridColumn: "span 3" }}
                  error={Boolean(draftErrs.description)}
                  helperText={draftErrs.description}
                  required
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={draftItem.quantity || ""}
                  onChange={(e) =>
                    setDraftItems({ ...draftItem, quantity: +e.target.value })
                  }
                  error={Boolean(draftErrs.quantity)}
                  helperText={draftErrs.quantity}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: 1 },
                  }}
                  required
                />
                <TextField
                  label="Price ($)"
                  type="number"
                  value={draftItem.price || ""}
                  onChange={(e) =>
                    setDraftItems({ ...draftItem, price: +e.target.value })
                  }
                  error={Boolean(draftErrs.price)}
                  helperText={draftErrs.price}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: 0o1 },
                  }}
                  required
                />
                {hasLocalTax && (
                  <>
                    <TextField
                      label="Tax (%)"
                      type="number"
                      value={draftItem.tax || ""}
                      onChange={(e) =>
                        setDraftItems({ ...draftItem, tax: +e.target.value })
                      }
                      error={Boolean(draftErrs.tax)}
                      helperText={draftErrs.tax}
                      slotProps={{
                        inputLabel: { shrink: true },
                        htmlInput: { min: 0 },
                      }}
                    />
                    <Button
                      type="button"
                      onClick={RemoveLocalTax}
                      variant="outlined"
                      aria-label="Remove local tax"
                    >
                      <XIcon />
                    </Button>
                  </>
                )}
                <div className="flex justify-end gap-2 sm:col-span-6">
                  {editingItemId ? (
                    <Button
                      type="button"
                      onClick={saveEdits}
                      startIcon={<FilePlus />}
                      variant="outlined"
                    >
                      Save Edits
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={SaveDraft}
                      startIcon={<PlusIcon />}
                      variant="outlined"
                    >
                      Save
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={AddLocalTax}
                    startIcon={<PlusIcon />}
                    variant="contained"
                    color="info"
                  >
                    Add Tax
                  </Button>
                  <Button
                    type="button"
                    onClick={editingItemId ? CancelEdits : DeleteDraft}
                    color="error"
                    variant="text"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </fieldset>
          )}

          {/* Items List */}
          {items.length > 0 && (
            <section className="overflow-x-auto space-y-2">
              <div className="hidden sm:grid grid-cols-8 font-semibold border-b pb-2">
                <div>Description</div>
                <div>Qty</div>
                <div>Price</div>
                <div>Total</div>
                <div className="col-span-2"></div>
              </div>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`grid sm:grid-cols-8 gap-2 items-center text-sm ${
                    idx % 2 === 0 ? "bg-gray-50" : ""
                  } ${editingItemId === item.id ? "opacity-50" : ""}`}
                >
                  <div>{item.name}</div>
                  <div className="sm:col-span-4">{item.description}</div>
                  <div>{item.quantity}</div>
                  <div>${item.price.toFixed(2)}</div>
                  <div className="col-span-3 flex gap-2 sm:justify-end">
                    <Button
                      type="button"
                      onClick={() => StartItemEdit(item.id)}
                      startIcon={<PlusIcon />}
                      variant="outlined"
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      startIcon={<Trash2Icon />}
                      variant="contained"
                      size="small"
                      color="error"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                disabled={hasGlobalTax}
                onClick={AddGlobalTax}
              >
                Add a global tax?
              </Button>
            </section>
          )}

          {hasGlobalTax && (
            <div className="flex items-center gap-2">
              <TextField
                label="Global Tax (%)"
                type="number"
                value={globalTax || ""}
                onChange={(e) => setGlobalTax(+e.target.value)}
              />
              <Button
                type="button"
                onClick={RemoveGlobalTax}
                startIcon={<XIcon />}
                variant="outlined"
              >
                Clear
              </Button>
            </div>
          )}

          {hasGlobalTax && globalTax > 0 && (
            <div>Tax applying to all items: {globalTax}%</div>
          )}

          {/* Totals */}
          {items.length > 0 && (
            <div className="bg-gray-50 p-3 rounded text-right font-bold">
              <div>
                Subtotal: $
                {hasGlobalTax
                  ? calcGlobalTax({ items, globalTax }).itemsSubtotal.toFixed(2)
                  : itemsSubtotal.toFixed(2)}
              </div>
              <div>
                Total: $
                {hasGlobalTax
                  ? calcGlobalTax({ items, globalTax }).total
                  : itemsTotal.toFixed(2)}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              startIcon={<PlusIcon />}
              onClick={AddRow}
              variant="outlined"
              disabled={Boolean(draftItem)}
            >
              Add Item
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<FilePlus />}
            >
              Create Invoice
            </Button>
          </div>
        </form>

        {/* Feedback Modal */}
        <SimpleModal open={feedback} onClose={() => setFeedback(false)}>
          <div role="alert" className="flex flex-col items-center gap-3">
            {success && (
              <div
                role="status"
                className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded"
              >
                <Check aria-hidden="true" /> Invoice created successfully
              </div>
            )}
            {Object.keys(errors).length > 0 && (
              <>
                {errors.items ? (
                  <div
                    role="status"
                    className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded"
                  >
                    <CircleAlert aria-hidden="true" /> {errors.items}
                  </div>
                ) : (
                  <div
                    role="status"
                    className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded"
                  >
                    <CircleAlert aria-hidden="true" /> Please fix the errors and
                    try again
                  </div>
                )}
              </>
            )}
          </div>
        </SimpleModal>
      </FormControl>
    </div>
  );
}
