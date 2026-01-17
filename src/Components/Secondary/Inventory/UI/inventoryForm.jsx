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
    <BasicModal open={isOpen} onClose={() => {}}>
      <div className="flex justify-end mb-2">
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </div>

      <h2 className="text-lg font-semibold mb-4">Add New Inventory Item</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name + Description */}
        <div className="flex gap-4">
          <TextField
            label="Name"
            name="name"
            value={inventoryItem.name}
            onChange={handleChange}
            error={errors.name}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={inventoryItem.description}
            onChange={handleChange}
            fullWidth
          />
        </div>

        {/* Price + Quantity */}
        <div className="flex gap-4">
          <TextField
            label="Price"
            name="price"
            type="number"
            value={inventoryItem.price}
            onChange={handleChange}
            error={errors.price}
            fullWidth
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={inventoryItem.quantity}
            onChange={handleChange}
            error={errors.quantity}
            fullWidth
          />
        </div>

        {/* SKU */}
        <TextField
          label="SKU"
          name="sku"
          error={errors.sku}
          helperText={errors.sku}
          value={inventoryItem.sku}
          onChange={handleChange}
        />

        {/* Low Stock Threshold */}
        <TextField
          label="Low Stock Threshold"
          name="lowStockThreshold"
          type="number"
          value={inventoryItem.lowStockThreshold}
          onChange={handleChange}
        />

        {/* Category */}
        <TextField
          label="Category"
          name="category"
          value={inventoryItem.category}
          onChange={handleChange}
        />

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
