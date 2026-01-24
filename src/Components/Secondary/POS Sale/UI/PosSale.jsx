import { useMemo, useState } from "react";
import { getCustomers } from "../../Customers/Helpers/Storage/customers";
import { getInventoryItems } from "../../Inventory/Helpers/Storage/inventory";
import { sortInventoryByName } from "../../Inventory/Helpers/Sorting/sortInventory";
import Cart_Card from "./inventoryCartCard";
import searchInventory from "../../Inventory/Helpers/Search/searchInventory";
import { TextField } from "@mui/material";
import BasicModal from "../../../UI/Modal/modal";
import ItemSaleModal from "./itemSaleModal";

export default function QuickSale() {
  const customers = useMemo(() => getCustomers(), []);
  const inventory = useMemo(() => getInventoryItems(), []);

  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [currItem, setCurrItem] = useState(null);
  const [isEditingCartItem, setIsEditingCartItem] = useState(false);

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

  const isInCart = (id) => cartItems.some((i) => i.id === id);

  const onEditItem = (item) => {
    setIsEditingCartItem(true);
    setCurrItem(item);
  };

  return (
    <div>
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
          <Cart_Card
            key={item.id}
            onAdd={(item) => onAddItem(item)}
            // onEdit={(item)=> onEditItem(item)} Belongs on the cart level and this shd prompt you to update the item on the inventory level
            item={item}
            isInCart={isInCart}
          />
        ))
      ) : (
        <div>No items found.</div>
      )}
    </div>
  );
}
