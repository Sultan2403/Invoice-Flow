import { useState, useEffect } from "react";
import { Button, TextField, IconButton } from "@mui/material";
import BasicModal from "../../../UI/Modal/modal";
import { X } from "lucide-react";
import validateInventoryItem from "../Helpers/Validation/validateInventoryItem";
import { saveInventoryItem } from "../Helpers/Storage/inventory";

export default function InventoryForm({ open, onSubmit }) {
  const [isOpen, setIsOpen] = useState(open);
  const [errors, setErrors] = useState({});
  const [inventoryItem, setInventoryItem] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    quantity: "",
    lowStockThreshold: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventoryItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateInventoryItem(inventoryItem);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    saveInventoryItem(inventoryItem);
    onSubmit();
    handleClose();
  };

  return (
    <BasicModal
      open={isOpen}
      onClose={() => {}}
      sx={{ width: "min(95vw, 700px)" }}
    >
      <div className="flex justify-end mb-2">
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </div>

      <h2 className="text-lg font-semibold mb-4">Add New Inventory Item</h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Name + Category */}
        <div className="flex gap-4">
          <TextField
            label="Name *"
            name="name"
            value={inventoryItem.name}
            onChange={handleChange}
            error={errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Category"
            name="category"
            value={inventoryItem.category}
            onChange={handleChange}
            fullWidth
          />
        </div>

        {/* Description */}
        <TextField
          label="Description"
          name="description"
          value={inventoryItem.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        {/* Price + Quantity */}
        <div className="flex gap-4">
          <TextField
            label="Price *"
            name="price"
            type="number"
            value={inventoryItem.price}
            onChange={handleChange}
            error={errors.price}
            helperText={errors.price}
            fullWidth
          />
          <TextField
            label="Quantity *"
            name="quantity"
            type="number"
            value={inventoryItem.quantity}
            onChange={handleChange}
            error={errors.quantity}
            helperText={errors.quantity}
            fullWidth
          />
        </div>

        <div className="flex gap-4">
          <TextField
            label="SKU"
            name="sku"
            value={inventoryItem.sku}
            onChange={handleChange}
            error={errors.sku}
            helperText={errors.sku || "Optional: alphanumeric and unique"}
            fullWidth
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={inventoryItem.imageUrl}
            onChange={handleChange}
            helperText="Optional: paste a hosted image URL"
            fullWidth
          />
          <TextField
            label="Low Stock"
            name="lowStockThreshold"
            type="number"
            value={inventoryItem.lowStockThreshold}
            onChange={handleChange}
            helperText={
              errors.lowStockThreshold || "Optional: triggers low stock alerts"
            }
            fullWidth
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add Item
          </Button>
        </div>
      </form>
    </BasicModal>
  );
}
