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
import InvSelector from "./inventorySelector";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Your Inventory</h1>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            onClick={() => setFormOpen(true)}
          >
            Add New Item
          </button>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <InvSelector invItems={inventory} setSearchTerm={setSearchTerm} />
            </div>
            <TextField
              select
              fullWidth
              label="Search By"
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

          <TextField
            select
            fullWidth
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
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
        </div>

        {/* Inventory List or Empty State */}
        {inventory.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No items in inventory.</p>
            <p className="text-gray-400 text-sm mt-2">
              Start by adding your first product.
            </p>
          </div>
        ) : finalInventory.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No items match your search.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {finalInventory.map((item, idx) => (
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
            ))}
          </div>
        )}

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

        {/* Delete Confirmation Modal */}
        <BasicModal open={itemToDelete}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Delete Item</h3>
            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{itemToDelete?.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
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
            <p className="text-lg font-semibold text-gray-800">
              Item saved successfully
            </p>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              onClick={handleCloseFeedback}
            >
              Close
            </button>
          </div>
        </BasicModal>
      </div>
    </div>
  );
}
