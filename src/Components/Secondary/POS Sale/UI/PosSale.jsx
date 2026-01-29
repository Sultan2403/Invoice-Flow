import { useMemo, useState } from "react";
import { getCustomers } from "../../Customers/Helpers/Storage/customers";
import { getInventoryItems, updateInventoryItem } from "../../Inventory/Helpers/Storage/inventory";
import { sortInventoryByName } from "../../Inventory/Helpers/Sorting/sortInventory";
import Inventory_Card from "./inventoryCartCard";
import Customer_Form from "../../Customers/UI/customerForm";
import searchInventory from "../../Inventory/Helpers/Search/searchInventory";
import { Button, TextField } from "@mui/material";
import BasicModal from "../../../UI/Modal/modal";
import ItemSaleModal from "./itemSaleModal";
import Cart_Items from "./cartItems";
import CustomerSelector from "../../Customers/UI/customerSelector";
import saveReceipt from "../../Reciepts/Helpers/Storage/saveReceipt";

export default function QuickSale() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddingNewCust, setIsAddingNewCust] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [currItem, setCurrItem] = useState(null);
  const [isEditingCartItem, setIsEditingCartItem] = useState(false);
  const [customerWarning, setCustomerWarning] = useState(false)
  const [error, setError] = useState("")

  const customers = useMemo(() => getCustomers(), [isAddingNewCust]);
  const inventory = useMemo(() => getInventoryItems(), []);

  const searchResults = useMemo(
    () => searchInventory({ inventory, searchTerm }),
    [searchTerm, inventory],
  );

  const sortedInventory = useMemo(
    () => sortInventoryByName(searchResults, "asc"),
    [searchResults],
  );

  const onAddItem = (item) => {
    setCurrItem(item);
    setIsEditingCartItem(false);
  };

  const editCartItem = (editedItem) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === editedItem.id ? editedItem : i)),
    );
  };

  const removeCartItem = (itemToRemove) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemToRemove.id));
  };

  const isInCart = (id) => cartItems.some((i) => i.id === id);
  const itemInCart = (id) => cartItems.find((i) => i.id === id) || {};

  const onEditItem = (item) => {
    setIsEditingCartItem(true);
    setCurrItem(item);
  };

  const handleSubmit = () => {
    if(cartItems.length === 0){
      setError("At least one cart item is required to make a sale.")
    } if(!selectedCustomer){
      setCustomerWarning(true)
    } else{

    }
  }

  const finalizeSale = ()=>{
    // validate stock before committing
    const inventory = getInventoryItems();
    for (const ci of cartItems) {
      const inv = inventory.find((i) => i.id === ci.id);
      if (!inv || Number(inv.currentStock || 0) < Number(ci.quantity || 0)) {
        setError(`Insufficient stock for ${ci.name}`);
        return;
      }
    }

    // decrement stock
    for (const ci of cartItems) {
      const inv = getInventoryItems().find((i) => i.id === ci.id);
      const updated = { ...inv, currentStock: Number(inv.currentStock || 0) - Number(ci.quantity || 0) };
      // reduce reserved if present
      if (updated.reserved) {
        updated.reserved = Math.max(0, Number(updated.reserved) - Number(ci.quantity || 0));
      }
      updateInventoryItem(updated);
    }

    // create receipt
    const total = cartItems.reduce((s, it) => s + Number(it.total || 0), 0);
    const receipt = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      items: cartItems,
      customer: selectedCustomer,
      total,
      source: "POS",
    };

    saveReceipt(receipt);

    // clear cart and show confirmation
    setCartItems([]);
    setCurrItem(null);
    setError("");
  }

  return (
    <div>
      <BasicModal open={customerWarning} onClose={()=>setCustomerWarning(false)}>
        <div className="p-4">
          <h1 className="text-lg font-semibold">No Customer</h1>
          <p className="text-sm text-gray-600">Proceed without a customer?</p>
          <div className="flex gap-2 justify-end mt-3">
            <Button
              variant="outlined"
              onClick={() => {
                setCustomerWarning(false);
                finalizeSale();
              }}
            >
              Proceed
            </Button>
            <Button variant="contained" onClick={()=>setCustomerWarning(false)}>Cancel</Button>
          </div>
        </div>
      </BasicModal>
      <BasicModal open={isAddingNewCust}>
        <Customer_Form
          onClose={() => setIsAddingNewCust(false)}
          onSubmit={() => setIsAddingNewCust(false)}
        />
      </BasicModal>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search Inventory"
          helperText={"Search inventory by name"}
          className="ml-2"
          size="small"
          fullWidth
        />
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex gap-2">
            <Button variant="outlined" onClick={() => setIsAddingNewCust(true)}>Add Customer</Button>
            <Button variant="contained" onClick={() => { if(cartItems.length===0) setError('Cart empty'); else if(!selectedCustomer) setCustomerWarning(true); else finalizeSale(); }}>Checkout</Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 md:mt-0">
            <strong>Note:</strong> Checkout will decrement stock immediately. Ensure payment is confirmed; this action cannot be reversed.
          </div>
        </div>
      </div>
      <BasicModal open={Boolean(currItem)}>
        <ItemSaleModal
          item={currItem}
          isEdit={isEditingCartItem}
          onEdit={(item) => editCartItem(item)}
          onClose={() => setCurrItem(null)}
          onAdd={(item) => setCartItems((prev) => [...prev, item])}
        />
      </BasicModal>
      <h2 className="text-lg font-bold text-blue-800 mb-2">Inventory</h2>
      {sortedInventory.length > 0 ? (
        sortedInventory.map((item) => (
          <Inventory_Card
            key={item.id}
            onAdd={(item) => onAddItem(item)}
            // onEdit={(item)=> onEditItem(item)} Belongs on the cart level and this shd prompt you to update the item on the inventory level
            item={item}
            isInCart={isInCart}
            itemInCart={itemInCart}
          />
        ))
      ) : (
        <div>
          <div>No items found.</div>
          <Button></Button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-bold text-blue-800">Cart</h2>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Cart_Items
          cartItems={cartItems}
          onEdit={(item) => onEditItem(item)}
          onRemove={(item) => removeCartItem(item)}
        />
      </div>

      <div>
        <h2>Customers</h2>
        <div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAddingNewCust(true)} variant="outlined">Add new customer</Button>
            {customers.length > 0 && (
              <CustomerSelector
                customers={customers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
              />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Selected Customer: {selectedCustomer ? `${selectedCustomer.name} | ${selectedCustomer.email}` : "No customer selected"}
          </p>
        </div>
      </div>
    </div>
  );
}
