import { useState, useEffect, useMemo } from "react";
import { Check, CircleAlert, FilePlus, PlusIcon, Trash2Icon, Plus } from "lucide-react";
import SimpleModal from "../../../../UI/Modal/modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Autocomplete } from "@mui/material";
import { getCustomers } from "../../../Customers/Helpers/Storage/customers";
import { getInventoryItems } from "../../../Inventory/Helpers/Storage/inventory";
import CustomerSelector from "../../../Customers/UI/customerSelector";
import Customer_Form from "../../../Customers/UI/customerForm";
import ItemSaleModal from "../../../POS Sale/UI/itemSaleModal";
import { submitInvoice } from "../../Helpers/Storage/submitInvoice";

export default function CreateInvoice() {
  // Invoice metadata
  const [invoice_name, setInvoiceName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // Items state
  const [items, setItems] = useState([]);
  const [inventorySnapshot, setInventorySnapshot] = useState([]);

  // Modal states
  const [itemSaleModalOpen, setItemSaleModalOpen] = useState(false);
  const [selectedItemForSale, setSelectedItemForSale] = useState(null);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);

  // Dates state
  const today = new Date().toISOString().split("T")[0];
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(null);

  // Feedback states
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [feedback, setFeedback] = useState(false);

  // Load customers and inventory on mount
  useEffect(() => {
    setCustomers(getCustomers());
    const invItems = getInventoryItems();
    setInventoryItems(invItems);
    setInventorySnapshot(invItems);
  }, []);

  // Calculate totals
  const globalFinancialsValues = useMemo(() => {
    const itemsSubtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const total = items.reduce((acc, item) => acc + item.total, 0);
    return {
      itemsSubtotal,
      total,
    };
  }, [items]);

  // Remove item from invoice
  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.invoiceItemId !== id));
  }

  // Handle inventory item selection
  function handleSelectInventoryItem(item) {
    setSelectedItemForSale(item);
    setItemSaleModalOpen(true);
  }

  // Handle adding item to invoice (from itemSaleModal)
  function handleAddItemToInvoice(finalItem) {
    setItems((prevItems) => [...prevItems, { ...finalItem, invoiceItemId: crypto.randomUUID() }]);
    setItemSaleModalOpen(false);
    setSelectedItemForSale(null);
  }
  function validateInvoice(invoice) {
    const validationErrors = {};

    if (!invoice.name?.trim()) {
      validationErrors.name = "Invoice name is required";
    }

    if (!invoice.customer) {
      validationErrors.customer = "Customer is required";
    }

    if (!invoice.items || invoice.items.length === 0) {
      validationErrors.items = "At least one item is required";
    }

    if (!invoice.dueDate) {
      validationErrors.dueDate = "Due date is required";
    }

    return validationErrors;
  }

  // Submit handler
  function handleSubmit(e) {
    e.preventDefault();

    const invoice = {
      id: crypto.randomUUID(),
      issueDate,
      dueDate,
      createdAt: new Date().toISOString(),
      name: invoice_name,
      items,
      status: "Draft",
      customer: selectedCustomer,
      ...globalFinancialsValues,
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

  // Auto-reset form on success
  useEffect(() => {
    if (!success) return;

    const timeout = setTimeout(() => {
      setFeedback(false);
      setInvoiceName("");
      setSelectedCustomer(null);
      setItems([]);
      setErrors({});
      setSuccess(null);
      setDueDate(null);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [success]);

  // JSX/HTML section
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
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            {/* CUSTOMER SELECTION */}
            <Box className="flex gap-2 items-start">
              <Box className="flex-1">
                <CustomerSelector
                  customers={customers}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                />
                {errors.customer && (
                  <p className="text-red-600 text-sm mt-1">{errors.customer}</p>
                )}
              </Box>
              <Button
                type="button"
                onClick={() => setCustomerFormOpen(true)}
                variant="outlined"
                size="small"
                startIcon={<Plus size={18} />}
                title="Add New Customer"
              >
                New
              </Button>
            </Box>

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

          {/* ITEMS SECTION - CARD LAYOUT */}
          {items.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">Items</h3>
              {items.map((item) => {
                return (
                  <div
                    key={item.invoiceItemId}
                    className="bg-white border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                  >
                    {/* Left: Info + stats */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>

                      {/* Stats: flex row on desktop, stacked on mobile */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-md text-gray-700">
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Qty:</span>
                          <span>{item.quantity}</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Unit Price:</span>
                          <span>${item.unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Tax Rate:</span>
                          <span>{item.taxRate ? (item.taxRate * 100).toFixed(2) : 0}%</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Tax Applied:</span>
                          <span>{item.applyTax ? "Yes" : "No"}</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                          <span className="font-medium mr-1">Subtotal:</span>
                          <span>${item.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="sm:flex sm:items-center border-l border-gray-300 pl-2 font-bold">
                          <span className="font-medium mr-1">Total:</span>
                          <span>${item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Remove button */}
                    <div className="flex gap-2 sm:flex-col sm:items-end mt-2 sm:mt-0">
                      <Button
                        type="button"
                        onClick={() => removeItem(item.invoiceItemId)}
                        variant="contained"
                        color="error"
                        size="small"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {errors.items && (
            <div className="p-3 bg-red-50 rounded text-red-700 text-sm">
              {errors.items}
            </div>
          )}

          {/* TOTALS */}
          {items.length > 0 && (
            <div className="bg-gray-50 p-4 rounded text-right font-bold space-y-2">
              <div>
                Subtotal: ${globalFinancialsValues.itemsSubtotal.toFixed(2)}
              </div>
              <div className="text-xl">
                Total: ${globalFinancialsValues.total.toFixed(2)}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <Box className="space-y-3">
            <Box className="flex gap-2 items-start">
              <Autocomplete
                options={inventoryItems}
                getOptionLabel={(item) => `${item.name} (${item.category}) - Stock: ${item.currentStock}`}
                value={selectedItemForSale}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedItemForSale(newValue);
                    setItemSaleModalOpen(true);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Item to Add" size="small" fullWidth />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                className="flex-1"
              />
            </Box>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<FilePlus />}
              >
                Create Invoice
              </Button>
            </div>
          </Box>
        </form>

        {/* CUSTOMER FORM MODAL */}
        <SimpleModal
          open={customerFormOpen}
          onClose={() => setCustomerFormOpen(false)}
        >
          <Customer_Form
            onSubmit={(newCustomer) => {
              setCustomers((prev) => [...prev, newCustomer]);
              setSelectedCustomer(newCustomer);
              setCustomerFormOpen(false);
            }}
            onClose={() => setCustomerFormOpen(false)}
          />
        </SimpleModal>

        {/* ITEM SALE MODAL */}
        <SimpleModal
          open={itemSaleModalOpen}
          onClose={() => {
            setItemSaleModalOpen(false);
            setSelectedItemForSale(null);
          }}
        >
          <ItemSaleModal
            item={selectedItemForSale}
            onClose={() => {
              setItemSaleModalOpen(false);
              setSelectedItemForSale(null);
            }}
            onAdd={handleAddItemToInvoice}
          />
        </SimpleModal>

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
                {errors.items || errors.customer || "Please fix the errors and try again"}
              </div>
            )}
          </div>
        </SimpleModal>
      </FormControl>
    </div>
  );
}
