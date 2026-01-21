import { useMemo, useState } from "react";
import { getCustomers } from "../Customers/Helpers/Storage/customers";
import { getInventoryItems } from "../Inventory/Helpers/Storage/inventory";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { sortInventoryByName } from "../Inventory/Helpers/Sorting/sortInventory";
import searchInventory from "../Inventory/Helpers/Search/searchInventory";
import InventoryForm from "../Inventory/UI/inventoryForm";
import { UserPlus2 } from "lucide-react";
import ProductImage from "../../UI/Inventory/productImage";
import BasicModal from "../../UI/Modal/modal";
import Customer_Form from "../Customers/UI/customerForm";

export default function QuickSale() {
  const customers = getCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [itemsToSell, setItemsToSell] = useState([]);
  const [addNewItem, setAddNewItem] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const inventoryItems = useMemo(
    () => getInventoryItems(),
    [addNewItem, itemsToSell],
  );
  const searchResults = useMemo(
    () => searchInventory({ inventory: inventoryItems, searchTerm }),
    [searchTerm, inventoryItems],
  );

  const sortedResults = sortInventoryByName(searchResults, "desc");

  const handleAddItem = (item) => {
    setItemsToSell((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const handleRemoveItem = (id) => {
    setItemsToSell((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <BasicModal
        open={customerFormOpen}
        onClose={() => setCustomerFormOpen(false)}
        children={
          <Customer_Form
            onSubmit={(cust) => {
              setSelectedCustomer(cust);
              setCustomerFormOpen(false);
            }}
          />
        }
      />
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
            <div className="flex justify-between items-center mb-3">
              <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                label="Search Inventory"
                size="small"
                fullWidth
              />
              <Button
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setAddNewItem(true)}
              >
                Add New Item
              </Button>
            </div>
            <InventoryForm
              open={addNewItem}
              itemToEdit={itemToEdit}
              onClose={() => setAddNewItem(false)}
              onSubmit={(newItem) => {
                setItemsToSell((prev) => [...prev, newItem]);
                setAddNewItem(false);
              }}
            />

            {sortedResults.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No items found.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sortedResults.map((item) => (
                  <li
                    key={item.id}
                    className="group border rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition flex gap-3"
                  >
                    <ProductImage imageUrl={item.imageUrl} name={item.name} />
                    <div className="text-sm flex-1">
                      <p className="font-medium text-blue-900">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        ${item.price} • Stock: {item.currentStock}
                      </p>
                      <p className="text-gray-400 text-xs">{item.category}</p>
                    </div>
                    <span
                      onClick={() => {
                        setItemToEdit(item);
                        setAddNewItem(true); // Lol don't get confused. This is just a pointer to make the modal render.
                      }}
                      className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 self-center"
                    >
                      Edit
                    </span>
                    <span
                      onClick={() => handleAddItem(item)}
                      className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 self-center"
                    >
                      Add
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Cart + Customer */}
          <aside className="space-y-6">
            {/* Customer */}
            <section className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-medium text-blue-900 mb-3">
                Customer (Optional)
              </h3>
              <Button
                startIcon={<UserPlus2 />}
                onClick={() => setCustomerFormOpen(true)}
              >
                Add new Customer
              </Button>

              <ul className="flex flex-wrap gap-2">
                {customers.map((cust) => (
                  <li
                    key={cust.id}
                    onClick={() =>
                      setSelectedCustomer(
                        selectedCustomer?.id === cust.id ? null : cust,
                      )
                    }
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer border transition
        ${
          selectedCustomer?.id === cust.id
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-blue-700 hover:bg-blue-50"
        }`}
                  >
                    {cust.name}
                  </li>
                ))}
              </ul>
            </section>

            {/* Cart */}
            <section className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-medium text-blue-900 mb-3">Cart</h3>

              {itemsToSell.length === 0 ? (
                <p className="text-sm text-gray-500">No items added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {itemsToSell.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center border rounded-lg p-2"
                    >
                      <span className="text-sm text-blue-900">{item.name}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
