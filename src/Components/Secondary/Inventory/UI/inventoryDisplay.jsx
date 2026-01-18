import { useEffect, useState, useMemo } from "react";
import InventoryForm from "./inventoryForm";
import InventoryCard from "./inventoryCard";
import BasicModal from "../../../UI/Modal/modal";
import { Check } from "lucide-react";
import {
  deleteInventoryItem,
  getInventoryItems,
} from "../Helpers/Storage/inventory";
import {
  sortInventoryByName,
  sortInventoryByPrice,
  sortInventoryByQuantity,
} from "../Helpers/Sorting/sortInventory";
import { MenuItem, TextField } from "@mui/material";

export default function InventoryDisplay() {
  const [formOpen, setFormOpen] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const inventory = useMemo(
    () => getInventoryItems(),
    [formOpen, itemToDelete, feedback, editItem],
  );

  const handleCloseFeedback = () => setFeedback(false);
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [filteredInventory, setFilteredInventory] = useState(
    sortInventoryByName(inventory, sortOrder),
  );

  const sortedInventory = (() => {
    switch (sortOrder) {
      case "name-asc":
        return sortInventoryByName(inventory, "asc");
      case "name-desc":
        return sortInventoryByName(inventory, "desc");
      case "price-asc":
        return sortInventoryByPrice(inventory, "asc");
      case "price-desc":
        return sortInventoryByPrice(inventory, "desc");
      case "qty-asc":
        return sortInventoryByQuantity(inventory, "asc");
      case "qty-desc":
        return sortInventoryByQuantity(inventory, "desc");
      default:
        return inventory;
    }
  })();

  useEffect(() => {
    setTimeout(() => {
      handleCloseFeedback();
    }, 3000);
  }, [feedback]);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Add Item Button */}

      <h1 className="font-bold text-xl">Your Inventory</h1>

      {/* Inventory List */}
      <TextField
        select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="ml-2"
        size="small"
        label="Sort By"
      >
        <MenuItem value="name-asc">A-Z</MenuItem>
        <MenuItem value="name-desc">Z-A</MenuItem>
        <MenuItem value="price-asc">Price: Low → High</MenuItem>
        <MenuItem value="price-desc">Price: High → Low</MenuItem>
        <MenuItem value="qty-asc">Quantity: Low → High</MenuItem>
        <MenuItem value="qty-desc">Quantity: High → Low</MenuItem>
      </TextField>

      {inventory && inventory.length > 0 ? (
        sortedInventory.map((item, idx) => (
          <InventoryCard
            key={idx}
            onEdit={(item) => {
              setEditItem(item);
              setFormOpen(true);
            }}
            onDelete={(item) => {
              setItemToDelete(item);
            }}
            item={item}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center py-10">
          No items in inventory.
        </p>
      )}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setFormOpen(true)}
        >
          Add New Item
        </button>
      </div>

      {/* Inventory Form Modal */}
      <InventoryForm
        open={formOpen}
        itemToEdit={editItem}
        onSubmit={() => {
          setFeedback(true);
          setEditItem(null);
          setFormOpen(false);
        }}
        onClose={() => setFormOpen(false)}
      />

      {/* Delete Confirmation */}
      <BasicModal open={itemToDelete}>
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">Delete Item</h3>
          <p>
            Are you sure you want to delete{" "}
            <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 border rounded"
              onClick={() => setItemToDelete(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => {
                deleteInventoryItem(itemToDelete);
                setItemToDelete(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </BasicModal>

      {/* Success Feedback Modal */}
      <BasicModal open={feedback} onClose={handleCloseFeedback}>
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <Check size={48} className="text-green-600" />

          <p className="text-lg font-semibold">Item saved successfully</p>

          <button
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleCloseFeedback}
          >
            OK
          </button>
        </div>
      </BasicModal>
    </div>
  );
}
