// TODO: Fix tax logic, it's shit right now. :)

import { useState, useEffect, useMemo } from "react";
import { calcGlobalFinancials } from "../../Helpers/Calculations/calcFinancials";
import { validateInvoice } from "../../Helpers/Validation//validateInvoice";
import { submitInvoice } from "../../Helpers/Submissions/submitInvoice";
import { finalizeItemStructure } from "../../Helpers/Submissions/finalizeItemStructure";
import { ValidateDraft } from "../../Helpers/Validation/validateDraft";
import {
  Check,
  CircleAlert,
  FilePlus,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import SimpleModal from "../../../../UI/Modal/modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function CreateInvoice({ onInvoiceCreation }) {
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

  const globalFinancialsValues = useMemo(
    () => calcGlobalFinancials({ items, globalTax }),
    [globalTax, items]
  );

  //  Tax functions

  // I believe the func names are self explanatory :)

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

  // -
  // -
  // -

  // Draft/draftItem functions.....

  function AddDraft() {
    setDraftItems({
      id: crypto.randomUUID(),
      name: "",
      tax: 0,
      description: "",
      quantity: 1,
      price: 0,
    });

    // Creates a new draft item and appends it to the UI
  }

  // Function for draft item removal....

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  // Saves draft and registers it as an official items

  function SaveDraft() {
    const validationErrs = ValidateDraft({ draftItem, hasLocalTax });
    setDraftErrors(validationErrs);
    if (Object.keys(validationErrs).length > 0) return;

    const finalDraftItem = finalizeItemStructure({ draftItem });

    setItems((prevItems) => [...prevItems, finalDraftItem]);

    setDraftItems(null);
    setHasLocalTax(false);
    setDraftErrors({});
  }

  // Deletes draft and discard previous user data

  function DeleteDraft() {
    setDraftItems(null);
    setHasLocalTax(false);
    setDraftErrors({});
  }

  // Initializes edit state

  function StartItemEdit(id) {
    const itemToEdit = items.find((item) => item.id === id);
    // Take a snapshot
    setDraftItems({ ...itemToEdit });
    setEditingItemId(id); // mark this item as editing
  }

  // Confirms edits and makes sure they get saved......

  function saveEdits() {
    const validationErrs = ValidateDraft({ draftItem, hasLocalTax });
    setDraftErrors(validationErrs);
    if (Object.keys(validationErrs).length > 0) return;

    const finalItem = finalizeItemStructure({ draftItem });

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === editingItemId ? finalItem : item))
    );

    // Clear edit state
    setDraftItems(null);
    setEditingItemId(null);

    setDraftErrors({});
  }

  // Discards edit state along with any changes made during edit

  function CancelEdits() {
    setDraftItems(null);
    setEditingItemId(null);

    setDraftErrors({});
  }

  // Submit handler

  // Calls other smaller funcs to make the submit possible

  function handleSubmit(e) {
    e.preventDefault();

    // Here the customer obj is structured

    const customer = {
      id: crypto.randomUUID(),
      ...customerData,
    };

    // Here the invoice is structured

    const invoice = {
      // INV METADATA
      id: crypto.randomUUID(),
      issueDate,
      dueDate,
      createdAt: new Date().toISOString(),
      name: invoice_name,
      items,
      status: "Draft",

      customer, // Customer Details

      ...globalFinancialsValues,
    };

    // Validation runs here....

    const validationErrors = validateInvoice(invoice);
    setErrors(validationErrors);
    console.log(validationErrors, draftErrs);

    // If there are no errors proceed with the submit....

    if (Object.keys(validationErrors).length === 0) {
      submitInvoice(invoice);
      setSuccess(true);
      setFeedback(true);
      onInvoiceCreation();
      return;
    }

    // Runs if there were actually errors
    // And provides feedback to the user

    setSuccess(false);
    setFeedback(true);
  }

  // This useEffect is to make sure the user always gets feedback

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

  // JSX/HTML section

  // Yup that's the actual UI :)

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 p-4 sm:p-6">
      <FormControl className="w-full max-w-5xl">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white p-6 rounded-lg shadow-md space-y-6"
        >
          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-center">Create Invoice</h2>

          {/* INVOICE METADATA */}
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
              value={customerData.name || ""}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  name: e.target.value,
                })
              }
              fullWidth
              error={Boolean(errors.customer_name)}
              helperText={errors.customer_name}
            />
            <TextField
              label="Customer Email"
              value={customerData.email || ""}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  email: e.target.value,
                })
              }
              fullWidth
              error={Boolean(errors.customer_email)}
              helperText={errors.customer_email}
            />
            <TextField
              label="Customer Address"
              value={customerData.address || ""}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  address: e.target.value,
                })
              }
              fullWidth
              error={Boolean(errors.customer_address)}
              helperText={errors.customer_address}
            />
            <TextField
              label="Issue Date *"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              fullWidth
              error={Boolean(errors.issueDate)}
              helperText={errors.issueDate}
              slotProps={{
                htmlInput: { min: today },
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Due Date *"
              type="date"
              value={dueDate || ""}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate}
              slotProps={{
                htmlInput: { min: issueDate },
                inputLabel: { shrink: true },
              }}
            />
          </section>

          {/* DRAFT ITEM EDITOR */}
          {draftItem && (
            <fieldset className="border rounded-md p-4 bg-gray-50 space-y-4">
              <legend className="text-sm font-medium">Add / Edit Item</legend>
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
                  multiline
                  minRows={3}
                  maxRows={7}
                  error={Boolean(draftErrs.description)}
                  helperText={draftErrs.description}
                  required
                  slotProps={{
                    inputLabel: { shrink: true },
                    textarea: {
                      className: "resize-none p-2 border rounded-md ",
                    },
                  }}
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
                  required
                  slotProps={{
                    htmlInput: { min: 1 },
                    inputLabel: { shrink: true },
                  }}
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
                  required
                  slotProps={{
                    htmlInput: { min: 0.01 },
                  }}
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
                        htmlInput: { min: 0.01, max: 100 },
                        inputLabel: { shrink: true },
                      }}
                    />
                    <Button
                      type="button"
                      onClick={RemoveLocalTax}
                      variant="outlined"
                      color="error"
                      className="h-fit mt-1"
                    >
                      Remove Tax
                    </Button>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 sm:col-span-6 justify-end">
                  {editingItemId ? (
                    <Button
                      type="button"
                      onClick={saveEdits}
                      startIcon={<FilePlus />}
                      variant="contained"
                    >
                      Save Edits
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={SaveDraft}
                      startIcon={<PlusIcon />}
                      variant="contained"
                    >
                      Save
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={AddLocalTax}
                    startIcon={<PlusIcon />}
                    variant="outlined"
                    disabled={hasLocalTax}
                  >
                    Add Tax
                  </Button>
                  <Button
                    type="button"
                    onClick={editingItemId ? CancelEdits : DeleteDraft}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </fieldset>
          )}

          {/* ITEMS SECTION - CARD LAYOUT */}
          {items.length > 0 && (
            <section className="space-y-3">
              {items.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                  >
                    {/* Left: Info + stats */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-700 text-sm sm:text-base">
                        {item.description}
                      </p>

                      {/* Stats: flex row on desktop, stacked on mobile */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-md text-gray-700">
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Qty:</span>
                          <span>{item.quantity}</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Price:</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Local Tax:</span>
                          <span>{item.tax}%</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Global Tax:</span>
                          <span>{globalTax}%</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2 font-bold">
                          <span className="font-medium mr-1">Total:</span>
                          <span>${item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions, same width */}
                    <div className="flex gap-2 sm:flex-col sm:items-end mt-2 sm:mt-0">
                      <Button
                        type="button"
                        onClick={() => StartItemEdit(item.id)}
                        variant="outlined"
                        size="small"
                        className="w-24"
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        variant="contained"
                        color="error"
                        size="small"
                        className="w-24"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}

              {!hasGlobalTax && (
                <Button
                  type="button"
                  onClick={AddGlobalTax}
                  variant="outlined"
                  className="mt-2"
                >
                  Add Global Tax?
                </Button>
              )}
            </section>
          )}

          {/* GLOBAL TAX */}
          {hasGlobalTax && (
            <div className="flex flex-wrap gap-2 items-center">
              <TextField
                label="Global Tax (%)"
                type="number"
                value={globalTax || ""}
                onChange={(e) => setGlobalTax(+e.target.value)}
                error={Boolean(errors.tax)}
                helperText={errors.tax}
                slotProps={{
                  htmlInput: { min: 0.01, max: 100 },
                  inputLabel: { shrink: true },
                }}
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

          {/* TOTALS */}
          {items.length > 0 && (
            <div className="bg-gray-50 p-3 rounded text-right font-bold space-y-1">
              <div>
                Subtotal: ${globalFinancialsValues.itemsSubtotal.toFixed(2)}
              </div>
              <div>Total: ${globalFinancialsValues.total.toFixed(2)}</div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
            <Button
              type="button"
              startIcon={<PlusIcon />}
              onClick={AddDraft}
              variant="contained"
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

        {/* FEEDBACK MODAL */}
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
              <div
                role="status"
                className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded"
              >
                <CircleAlert aria-hidden="true" />{" "}
                {errors.items || "Please fix the errors and try again"}
              </div>
            )}
          </div>
        </SimpleModal>
      </FormControl>
    </div>
  );
}

// Trust me I tried to make this component smaller -_-

//  Well it is what it is ¯\_(ツ)_/¯
