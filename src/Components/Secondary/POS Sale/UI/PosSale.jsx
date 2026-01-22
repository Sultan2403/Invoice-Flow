import { useMemo, useState } from "react";
import { getCustomers } from "../../Customers/Helpers/Storage/customers";
import { getInventoryItems } from "../../Inventory/Helpers/Storage/inventory";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { sortInventoryByName } from "../../Inventory/Helpers/Sorting/sortInventory";
import searchInventory from "../../Inventory/Helpers/Search/searchInventory";
import InventoryForm from "../../Inventory/UI/inventoryForm";
import { UserPlus2, Edit2 } from "lucide-react";
import ProductImage from "../../../UI/Inventory/productImage";
import BasicModal from "../../../UI/Modal/modal";
import Customer_Form from "../../Customers/UI/customerForm";
import ItemSaleModal from "./itemSaleModal";
import ConfirmationModal from "./saleConfirmation";
import { saveSaleData } from "../Helpers/Storage/storage";

export default function QuickSale() {
  const customers = getCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [itemsToSell, setItemsToSell] = useState([]);
  const [addNewItem, setAddNewItem] = useState(false);
  const [selectedItemForSale, setSelectedItemForSale] = useState(null);
  const [confirmSale, setConfirmSale] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [errors, setErrors] = useState({});

  // Customers filtered by search term
  const filteredCustomers = useMemo(() => {
    const term = customerSearchTerm.toLowerCase();
    return customers.filter(
      (cust) =>
        cust.name.toLowerCase().includes(term) ||
        cust.email.toLowerCase().includes(term) ||
        (cust.phone && cust.phone.toLowerCase().includes(term)) ||
        (cust.address && cust.address.toLowerCase().includes(term)),
    );
  }, [customerSearchTerm, customers]);

  // Inventory search
  const inventoryItems = useMemo(
    () => getInventoryItems(),
    [addNewItem, itemsToSell],
  );
  const searchResults = useMemo(
    () => searchInventory({ inventory: inventoryItems, searchTerm }),
    [searchTerm, inventoryItems],
  );
  const sortedResults = sortInventoryByName(searchResults, "asc");

  const finalInventoryToDisplay = useMemo(() => {
    const cartIds = new Set(itemsToSell.map((i) => i.id));
    return sortedResults.map((item) => ({
      ...item,
      inCart: cartIds.has(item.id),
    }));
  }, [sortedResults, itemsToSell]);

  // Totals
  const saleSubtotal = useMemo(
    () => itemsToSell.reduce((sum, i) => sum + i.subtotal, 0),
    [itemsToSell],
  );
  const saleTotal = useMemo(
    () => itemsToSell.reduce((sum, i) => sum + i.total, 0),
    [itemsToSell],
  );

  const handleAddOrEditItem = (item) => {
    setSelectedItemForSale(item);
  };

  const handleRemoveItem = (id) => {
    setItemsToSell((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    setErrors({});

    const validationErrors = validateSale(sale);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setConfirmSale(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Modals */}

      <ConfirmationModal
        open={confirmSale}
        onClose={() => setConfirmSale(false)}
        items={itemsToSell}
        customer={selectedCustomer}
        totalAmount={saleTotal}
        onConfirm={() => {
          const sale = {
            ...itemsToSell,
            customerId: selectedCustomer?.id || null,
            soldAt: new Date().toISOString(),
          };
          saveSaleData(sale);
          setConfirmSale(false);
          setItemsToSell([]);
          setFeedback(true);
        }}
      />

      <BasicModal open={feedback} onClose={() => setFeedback(false)}>
        <div className="p-6 bg-white rounded-lg shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4">Sale Completed</h2>
          <p className="mb-2">The sale has been successfully completed.</p>
        </div>
      </BasicModal>

      <BasicModal
        open={customerFormOpen}
        onClose={() => setCustomerFormOpen(false)}
      >
        <Customer_Form
          editCustomer={customerToEdit}
          onClose={() => {
            setCustomerFormOpen(false);
            setCustomerToEdit(null);
          }}
          onSubmit={(cust) => {
            setSelectedCustomer(cust);
            setCustomerFormOpen(false);
            setCustomerToEdit(null);
          }}
        />
      </BasicModal>

      <BasicModal
        open={Boolean(selectedItemForSale)}
        onClose={() => setSelectedItemForSale(null)}
      >
        <ItemSaleModal
          item={selectedItemForSale}
          onAdd={(item) => {
            setSelectedItemForSale(null);
            setItemsToSell((prev) => [...prev, item]);
          }}
          onClose={() => setSelectedItemForSale(null)}
        />
      </BasicModal>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-blue-900">Quick Sale</h1>
          {selectedCustomer && (
            <span className="text-sm text-blue-700">
              Customer: <strong>{selectedCustomer.name}</strong>
            </span>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-semibold text-blue-900 mb-1">Your Inventory</h2>
            <p className="text-xs text-gray-500 mb-3">
              Select an item to add it to the cart. <br /> Click edit to edit it
              on the inventory level.
            </p>

            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Search Inventory"
              size="small"
              fullWidth
              className="mb-3"
            />

            <InventoryForm
              open={addNewItem}
              itemToEdit={itemToEdit}
              onClose={() => setAddNewItem(false)}
              onSubmit={(newItem) => {
                setSelectedItemForSale(newItem);
                setAddNewItem(false);
              }}
            />

            {finalInventoryToDisplay.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No items found.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {finalInventoryToDisplay.map((item) => (
                  <li
                    key={item.id}
                    className={`border rounded-lg p-4 flex gap-3 transition
    ${item.inCart ? "opacity-65 border-gray-300" : "bg-white hover:border-blue-400"}
  `}
                  >
                    <ProductImage imageUrl={item.imageUrl} name={item.name} />

                    <div className="flex-1 text-sm">
                      <p className="font-medium text-blue-900">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        ${item.price} • Stock: {item.currentStock}
                      </p>
                      <p className="text-gray-400 text-xs">{item.category}</p>

                      {/* BUTTON ROW */}
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<UserPlus2 size={14} />}
                          className="text-xs px-2 py-1"
                          onClick={() => setSelectedItemForSale(item)}
                          disabled={item.inCart} // disable if already in cart
                        >
                          {item.inCart ? "Added" : "Add to Cart"}
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit2 size={14} />}
                          className="text-xs px-2 py-1"
                          onClick={() => {
                            setItemToEdit(item);
                            setAddNewItem(true);
                          }}
                        >
                          Edit Item
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Customers + Cart */}
          <aside className="space-y-6">
            {/* Customers */}
            <section className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-medium text-blue-900 mb-1">Your Customers</h3>
              <p className="text-xs text-gray-500 mb-3">
                Select a customer to attach them to this sale.
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Note a customer is not required for a quick sale. <br /> You can
                also edit a customer's details directly here.
              </p>

              <TextField
                size="small"
                fullWidth
                label="Search customers"
                helperText="Search by name, email, phone, or address"
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
              />

              <div className="flex justify-end mt-2">
                <Button
                  startIcon={<UserPlus2 />}
                  size="small"
                  onClick={() => setCustomerFormOpen(true)}
                >
                  Add New Customer
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredCustomers.length === 0 ? (
                  <p className="text-sm text-gray-500">No customers found.</p>
                ) : (
                  filteredCustomers.map((cust) => {
                    const selected = selectedCustomer?.id === cust.id;
                    return (
                      <div
                        key={cust.id}
                        className={`border rounded-lg p-3 transition ${
                          selected
                            ? "bg-blue-50 border-blue-400 opacity-50 text-gray-500"
                            : "bg-white hover:bg-blue-50"
                        }`}
                      >
                        <p className="font-medium text-blue-900">{cust.name}</p>
                        <p className="text-xs text-gray-500">{cust.email}</p>
                        {cust.phone && (
                          <p className="text-xs text-gray-400">
                            Phone: {cust.phone}
                          </p>
                        )}

                        <div className="flex gap-2 mt-2">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              setCustomerFormOpen(true);
                              setCustomerToEdit(cust);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={selected}
                            onClick={() => setSelectedCustomer(cust)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {selectedCustomer && (
                <div className="mt-3 p-3 border rounded bg-blue-50 text-sm">
                  <h4 className="font-semibold text-blue-900 mb-1">Bill To</h4>
                  <p>
                    <strong>Name:</strong> {selectedCustomer.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedCustomer.email}
                  </p>
                  {selectedCustomer.phone && (
                    <p>
                      <strong>Phone:</strong> {selectedCustomer.phone}
                    </p>
                  )}
                  {selectedCustomer.address && (
                    <p>
                      <strong>Address:</strong> {selectedCustomer.address}
                    </p>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    className="mt-2 text-xs"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    Remove Customer
                  </Button>
                </div>
              )}
            </section>

            {/* Cart */}
            <section className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-semibold text-blue-900 mb-3">Cart</h2>
              <p>This is the list of items to sell.</p>
              <p>
                Click edit to edit the item to sell's quantity and to select if
                a tax should be applied.
              </p>
              <p>Click remove to remove an item from the cart.</p>
              {itemsToSell.length === 0 ? (
                <p className="text-sm text-gray-500">No items added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {itemsToSell.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center border rounded-lg p-2"
                    >
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-blue-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} | Subtotal: ${item.subtotal} |
                          Tax: ${(item.total - item.subtotal).toFixed(2)} |
                          Total: ${item.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleAddOrEditItem(item)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {itemsToSell.length > 0 && (
                <div className="mt-3 text-sm">
                  <p>
                    <strong>Subtotal:</strong> ${saleSubtotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>Total:</strong> ${saleTotal.toFixed(2)}
                  </p>
                </div>
              )}
            </section>
            {itemsToSell.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4"
                onClick={handleSubmit}
              >
                Complete Sale
              </Button>
            )}
            {Object.keys(errors).length > 0 && (
              <div className="mt-2 p-3 border rounded bg-red-50 text-sm text-red-700">
                <h4 className="font-semibold mb-1">Errors:</h4>
                <ul className="list-disc list-inside">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
