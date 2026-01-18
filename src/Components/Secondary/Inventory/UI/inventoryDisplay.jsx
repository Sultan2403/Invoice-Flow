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
import searchInventory from "../Helpers/Search/searchInventory";
import getInventoryItemById from "../Helpers/Search/findItemById";

export default function InventoryDisplay() {
  const [formOpen, setFormOpen] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchBy, setSearchBy] = useState("name");

  const inventory = useMemo(
    () => getInventoryItems(),
    [formOpen, itemToDelete, feedback, editItem],
  );

  const handleCloseFeedback = () => setFeedback(false);
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useMemo(() => {
    return searchInventory({
      inventory,
      searchTerm,
      searchBy,
    });
  }, [searchTerm, inventory, searchBy]);

  const sortedInventory = useMemo(() => {
    switch (sortOrder) {
      case "name-asc":
        return sortInventoryByName(searchResults, "asc");
      case "name-desc":
        return sortInventoryByName(searchResults, "desc");
      case "price-asc":
        return sortInventoryByPrice(searchResults, "asc");
      case "price-desc":
        return sortInventoryByPrice(searchResults, "desc");
      case "qty-asc":
        return sortInventoryByQuantity(searchResults, "asc");
      case "qty-desc":
        return sortInventoryByQuantity(searchResults, "desc");
      default:
        return searchResults;
    }
  }, [searchResults, sortOrder]);

  const finalInventory = sortedInventory;

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

      <div className="flex gap-4">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search Inventory"
          className="ml-2"
          size="small"
          fullWidth
        />
        <TextField
          select
          fullWidth
          label="Search By"
          className="ml-2"
          size="small"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="category">Category</MenuItem>
          <MenuItem value="sku">SKU</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="currentStock">Quantity / Stock</MenuItem>
        </TextField>
      </div>
      {/* Inventory List */}
      {inventory.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No items in inventory.
        </p>
      ) : finalInventory.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No items match your search.
        </p>
      ) : (
        finalInventory.map((item, idx) => (
          <InventoryCard
            key={idx}
            item={item}
            onEdit={(item) => {
              setEditItem(getInventoryItemById(item.id));
              setFormOpen(true);
            }}
            onDelete={(item) => {
              setItemToDelete(getInventoryItemById(item.id));
            }}
          />
        ))
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
        onClose={() => {
          setFormOpen(false);
          setEditItem(null);
        }}
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
