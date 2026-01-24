import { useMemo, useState } from "react";
import { getCustomers } from "../../Customers/Helpers/Storage/customers";
import { getInventoryItems } from "../../Inventory/Helpers/Storage/inventory";
import { sortInventoryByName } from "../../Inventory/Helpers/Sorting/sortInventory";
import Inventory_Card from "./inventoryCartCard";
import searchInventory from "../../Inventory/Helpers/Search/searchInventory";
import { Button, TextField } from "@mui/material";
import BasicModal from "../../../UI/Modal/modal";
import ItemSaleModal from "./itemSaleModal";
import Cart_Items from "./cartItems";
import Customer_Card from "../../Customers/UI/customerSelector";
import CustomerSelector from "../../Customers/UI/customerSelector";
import Customer_Form from "../../Customers/UI/customerForm";

export default function QuickSale() {



  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddingNewCust, setIsAddingNewCust] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [currItem, setCurrItem] = useState(null);
  const [isEditingCartItem, setIsEditingCartItem] = useState(false);

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

  return (
    <div>
      <BasicModal open={isAddingNewCust} >
        <Customer_Form onClose={()=>setIsAddingNewCust(false)} onSubmit={()=>setIsAddingNewCust(false)}/>
      </BasicModal>
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        label="Search"
        helperText={"Search inventory by name"}
        className="ml-2"
        size="small"
        fullWidth
      />
      <BasicModal open={Boolean(currItem)}>
        <ItemSaleModal
          item={currItem}
          isEdit={isEditingCartItem}
          onEdit={(item) => editCartItem(item)}
          onClose={() => setCurrItem(null)}
          onAdd={(item) => setCartItems((prev) => [...prev, item])}
        />
      </BasicModal>
      <h2 className="text-lg font-bold">Your Inventory</h2>
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

      <div>
        <h2>Cart</h2>
        <Cart_Items
          cartItems={cartItems}
          onEdit={(item) => onEditItem(item)}
          onRemove={(item) => removeCartItem(item)}
        />
      </div>

      <div>
        <h2>Customers</h2>
        <div>
                        <Button onClick={()=>setIsAddingNewCust(true)}>Add new customer</Button>
          {customers.length > 0 ? (
            <>
              {" "}
              <CustomerSelector
                customers={customers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
              />
              <p>
                Selected Customer:
                {selectedCustomer
                  ? ` Name: ${selectedCustomer.name} | Email: ${selectedCustomer.email}`
                  : " No customer selected"}
              </p>
            </>
          ) : (
            <div>
              No customers found.

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
