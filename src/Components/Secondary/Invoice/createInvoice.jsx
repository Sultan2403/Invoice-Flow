// TODO: Fix tax logic, it's shit right now. :)

import { useState, useEffect } from "react";
import { submitInvoice, validateInvoice } from "../../../Utils/helpers";
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
  const [itemName, setItemName] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [customer_email, setCustomerEmail] = useState("");
  const [customer_address, setCustomerAddress] = useState("");

  // Items and item edit state

  const [items, setItems] = useState([]);
  const [draftItem, setDraftItems] = useState(null);
  const [draftErrs, setDraftErrors] = useState({});

  // Tax Data

  const [localTax, setLocalTax] = useState(0);
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

  const [isEditing, setIsEditing] = useState(false);

  // Total and tax calculations

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  ); // This is the combined total of all individual items.

  // ------------------------------ TAX LOGIC.......... ----------------------------------

  const localTaxTotal = items.reduce((sum, item) => sum + item.tax, 0); // Total local tax calc

  const totalTax = localTaxTotal + globalTax; // Total tax calc for global and local tax

  const total = subtotal + (subtotal * totalTax) / 100; // Final total calc

  // ----------------------------------- Tax functions.....--------------------------------------------

  function AddLocalTax() {
    setHasLocalTax(true);
  }

  function RemoveLocalTax() {
    setHasLocalTax(false);
    setLocalTax(0);
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
      itemName,
      tax: localTax,
      description: "",
      quantity: 1,
      price: 0,
    });
  }

  function removeItem() {
    setItems((prevItems) => prevItems.filter((_, i) => i !== i.id));
  }

  //-------------------------------- ITEM EDIT LOGIC.......... ----------------------------------

  function StartItemEdit(id) {
    const itemToEdit = items.find((item) => item.id === id);
    setDraftItems(itemToEdit);

    setIsEditing(true);
  }

  function actuallyEditItem() {
    if (Object.keys(ValidateDraft()).length > 0) return;

    setItems((prevItems) => [...prevItems, draftItem]);

    setDraftItems(null);
    setIsEditing(false);
    setDraftErrors({});
  }

  function CancelEdits() {
    setDraftItems(null);
    setIsEditing(false);
    setDraftErrors({});
  }

  // ------------------------------ DRAFT ITEM LOGIC.......... ----------------------------------

  // -------------------- VALIDATION LOGIC.......... --------------------------

  function ValidateDraft() {
    const errs = {};
    if (!draftItem.itemName.trim()) {
      errs.itemName = "Item name is required";
    }
    if (!draftItem.description.trim()) {
      errs.description = "Item description is required";
    }
    if (draftItem.quantity <= 0) {
      errs.quantity = "Quantity must be greater than zero";
    }
    if (draftItem.price <= 0) {
      errs.price = "Price must be greater than zero";
    }
    if (hasLocalTax && draftItem.tax < 0) {
      errs.tax = "Tax cannot be negative";
    }

    setDraftErrors(errs);
    return errs;
  }

  // -------------------- SAVE, DELETE, EDIT LOGIC.......... --------------------------

  function SaveDraft() {
    if (Object.keys(ValidateDraft()).length > 0) return;
    const important_Extra_Item_Props = {};

    important_Extra_Item_Props.subtotal = draftItem.price * draftItem.quantity;
    important_Extra_Item_Props.total =
      draftItem.subtotal + (draftItem.subtotal * draftItem.tax) / 100;

    setDraftItems((prev) => ({ ...prev, ...important_Extra_Item_Props }));

    setItems((prevItems) => [...prevItems, draftItem]);

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
      customer_name,
      customer_email,
      customer_address,
    };

    const invoice = {
      // INV METADATA
      id: crypto.randomUUID(),
      issueDate,
      dueDate,
      createdAt: new Date().toISOString(),
      invoice_name,
      items,
      status,

      customer, // Customer Details

      // FINANCIALS
      tax: globalTax,
      subtotal,
      total: subtotal + (subtotal * tax) / 100,
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

            <TextField
              label="Customer Email "
              id="customer-email"
              value={customer_email}
              error={Boolean(errors.customer_email)}
              helperText={errors.customer_email}
              onChange={(e) => setCustomerEmail(e.target.value)}
              fullWidth
            />

            <TextField
              label="Customer Address"
              id="customer-address"
              value={customer_address}
              onChange={(e) => setCustomerAddress(e.target.value)}
              fullWidth
              slotProps={{ htmlInput: { min: today } }}
              error={Boolean(errors.customer_address)}
              helperText={errors.customer_address}
            />

            <TextField
              label={"Due Date"}
              type="date"
              fullWidth
              slotProps={{
                htmlInput: { min: issueDate },
                inputLabel: { shrink: true },
              }}
              value={dueDate || ""}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <TextField
              label={"Issue Date"}
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              fullWidth
              value={issueDate || ""}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </section>

          {/* ===== Draft Item Editor ===== */}
          {draftItem && (
            <section className="border rounded-md p-4 bg-gray-50 space-y-4">
              <h3 className="font-semibold">Add / Edit Item</h3>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <TextField
                  label="Item Name"
                  id="item-name"
                  error={Boolean(errors.itemName)}
                  helperText={errors.itemName || ""}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  fullWidth
                />
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
                  label="Quantity (units)"
                  type="number"
                  value={draftItem.quantity || ""}
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
                  value={draftItem.price || ""}
                  error={Boolean(draftErrs.price)}
                  helperText={draftErrs.price}
                  onChange={(e) =>
                    setDraftItems({
                      ...draftItem,
                      price: +e.target.value,
                    })
                  }
                />
                {hasLocalTax && (
                  /*<SimpleModal open={hasTax} onClose={null} children={ >*/ <>
                    {" "}
                    <TextField
                      label="Tax Rate (%)"
                      type="number"
                      error={Boolean(errors.tax)}
                      helperText={errors.tax || ""}
                      value={localTax || ""}
                      onChange={(e) => setLocalTax(Number(e.target.value))}
                    />
                    <Button aria-label="Cancel" onClick={RemoveLocalTax}>
                      <XIcon />
                    </Button>
                  </>

                  // </SimpleModal>
                )}
                {localTax > 0 && (
                  <div>
                    Tax: {localTax}% / {localTax / 100}
                  </div>
                )}
                <div className="flex items-end gap-2 md:col-span-2">
                  {isEditing ? (
                    <Button
                      startIcon={<FilePlus />}
                      variant="outlined"
                      onClick={() => actuallyEditItem(draftItem.id)}
                    >
                      Save Edits
                    </Button>
                  ) : (
                    <Button
                      onClick={SaveDraft}
                      startIcon={<PlusIcon />}
                      variant="outlined"
                    >
                      Save
                    </Button>
                  )}
                  <Button
                    onClick={AddLocalTax}
                    startIcon={<PlusIcon />}
                    variant="contained"
                    size="medium"
                    color="info"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Add a tax
                  </Button>
                  {isEditing ? (
                    <Button
                      onClick={CancelEdits}
                      startIcon={<XIcon color="white" />}
                      variant="text"
                      className="bg-white text-red-600"
                    >
                      Cancel Edits
                    </Button>
                  ) : (
                    <Button
                      onClick={DeleteDraft}
                      startIcon={<Trash2Icon />}
                      className="text-white bg-red-600"
                      variant="text"
                      color="error"
                    >
                      Cancel
                    </Button>
                  )}
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
                      onClick={() => StartItemEdit(item.id)}
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
              <Button onClick={AddGlobalTax}>
                Add a global tax to all items?
              </Button>
            </section>
          )}

          {hasGlobalTax && (
            <>
              <TextField
                label="Global Tax Rate (%)"
                type="number"
                value={globalTax || ""}
                error={Boolean(errors.globalTax)}
                helperText={errors.globalTax || ""}
                onChange={(e) => setGlobalTax(parseFloat(e.target.value) || 0)}
              />
              <div>
                Global Tax: {globalTax}% / {globalTax / 100}
              </div>
              <Button
                aria-label="Cancel"
                startIcon={<XIcon />}
                onClick={RemoveGlobalTax}
              >
                Clear global tax
              </Button>
            </>
          )}

          {/* ===== Total ===== */}
          {items.length > 0 && (
            <div className="text-right font-bold text-lg">
              Subtotal: ${subtotal.toFixed(2)}
              <br />
              Total: ${total.toFixed(2)}
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
