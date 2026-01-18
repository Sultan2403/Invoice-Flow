import { useState, useEffect } from "react";
import { Button, TextField, IconButton } from "@mui/material";
import BasicModal from "../../../UI/Modal/modal";
import { X } from "lucide-react";
import validateInventoryItem from "../Helpers/Validation/validateInventoryItem";
import {
  addNewInventoryItem,
  updateInventoryItem,
} from "../Helpers/Storage/inventory";
import { findSimilarInventoryItem } from "../Helpers/Search/findSimilarProducts";
import validateAdjustmentReason from "../Helpers/Validation/validateAdjustmentReason";

export default function InventoryForm({ open, onSubmit, onClose, itemToEdit }) {
  const defaultObj = {
    name: "",
    sku: "",
    description: "",
    price: "",
    currentStock: "",
    lowStockThreshold: "",
    adjustmentReason: "",
    category: "",
    imageUrl: "",
  };

  const adjustmentReasons = [
    "Stock Correction",
    "New Stock Arrival",
    "Damaged Goods",
    "Theft",
    "Other",
  ];
  const [errors, setErrors] = useState({});
  const [quantityChanged, setQuantityChanged] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [inventoryItem, setInventoryItem] = useState(defaultObj);

  useEffect(() => {
    if (itemToEdit)
      setInventoryItem({
        ...itemToEdit,
        stockAdjustment: 0,
        adjustmentReason: "",
      });
  }, [itemToEdit]);

  const handleClose = () => {
    onClose();
    setInventoryItem(defaultObj);
    setErrors({});
    setQuantityChanged(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "price" ||
      name === "lowStockThreshold" ||
      name === "stockAdjustment" ||
      name === "currentStock"
    ) {
      const numberval = parseFloat(value);
      setInventoryItem((prev) => ({ ...prev, [name]: numberval }));
      return;
    }
    if (name === "currentStock") {
      const originalQuantity = itemToEdit?.currentStock || 0;
      const newQuantity = parseFloat(value) || 0;
      setQuantityChanged(newQuantity !== originalQuantity);
    }

    setInventoryItem((prev) => ({ ...prev, [name]: value }));
  };

  const finalizeSave = (invItem) => {
    if (itemToEdit) {
      updateInventoryItem(invItem); // Its inv item here because inv item is the updated item.
    } else {
      addNewInventoryItem(invItem);
    }
    setInventoryItem(defaultObj);
    setErrors({});
    onSubmit?.();

    handleClose();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const realInvItem = {
      ...inventoryItem,
      id: itemToEdit?.id || crypto.randomUUID(),
      reserved: itemToEdit?.reserved || 0,
    };
    const validation = {
      ...validateInventoryItem(realInvItem),
      ...validateAdjustmentReason({
        adjustmentReason: realInvItem.adjustmentReason,
        quantityChanged,
        initialQuantity: itemToEdit ? itemToEdit.currentStock : 0,
        newQuantity: realInvItem.currentStock,
      }),
    };

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    if (quantityChanged) {
      const delta = {
        timestamp: new Date().toISOString(), // or just new Date() if you prefer
        previousQuantity: itemToEdit?.currentStock || 0,
        newQuantity: inventoryItem.stockAdjustment,
        reason: inventoryItem.adjustmentReason,
      };
      realInvItem.currentStock =
        itemToEdit?.currentStock + inventoryItem?.stockAdjustment;
      realInvItem.stockHistory = [...realInvItem.stockHistory, delta];
    }

    const similarItem = findSimilarInventoryItem(realInvItem);

    if (similarItem && !itemToEdit) {
      setConfirmation(true);
    } else {
      finalizeSave(realInvItem);
    }
  };

  return (
    <>
      <BasicModal open={unsaved}>
        <div className="flex flex-col gap-4 p-6">
          <h3 className="text-lg font-semibold">Unsaved Changes</h3>
          <p className="text-sm text-gray-600">
            You have unsaved changes. Are you sure you want to leave? You’ll
            lose your edits.
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outlined" onClick={() => setUnsaved(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setUnsaved(false);
                handleClose();
              }}
            >
              Leave Anyway
            </Button>
          </div>
        </div>
      </BasicModal>
      <BasicModal open={confirmation}>
        <div className="flex flex-col gap-4 p-6">
          <h3 className="text-lg font-semibold">Similar item detected</h3>

          <p className="text-sm text-gray-600">
            An item with a similar name and price already exists in your
            inventory. Do you want to continue anyway?
          </p>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outlined" onClick={() => setConfirmation(false)}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setConfirmation(false);
                finalizeSave(finalizeInventoryItem(inventoryItem)); // extracted save logic
              }}
            >
              Save anyway
            </Button>
          </div>
        </div>
      </BasicModal>
      <BasicModal
        open={open}
        onClose={() => {}}
        sx={{ width: "min(95vw, 700px)" }}
      >
        <div className="flex justify-end mb-2">
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </div>

        <h2 className="text-lg font-semibold mb-4">Add New Inventory Item</h2>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
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
              label="Price ($) *"
              name="price"
              type="number"
              value={inventoryItem.price}
              onChange={handleChange}
              error={errors.price}
              helperText={errors.price}
              fullWidth
            />
            <TextField
              label={
                itemToEdit
                  ? "Stock Adjustment (units) use negative values for reductions *"
                  : "Initial stock (units) *"
              }
              name={itemToEdit ? "stockAdjustment" : "currentStock"}
              type="number"
              value={
                itemToEdit
                  ? inventoryItem.stockAdjustment
                  : inventoryItem.currentStock
              }
              onChange={handleChange}
              error={itemToEdit ? errors.stockAdjustment : errors.currentStock}
              helperText={
                itemToEdit ? errors.stockAdjustment : errors.currentStock
              }
              fullWidth
            />
            {quantityChanged && (
              <TextField
                label="Adjustment Reason"
                name="adjustmentReason"
                select
                value={inventoryItem.adjustmentReason}
                onChange={handleChange}
                error={errors.adjustmentReason}
                helperText={errors.adjustmentReason}
                fullWidth
              >
                <option value="" disabled>
                  -- Select Reason --
                </option>
                {adjustmentReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </TextField>
            )}
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
              error={errors.lowStockThreshold}
              helperText={
                errors.lowStockThreshold ||
                "Optional: triggers low stock alerts"
              }
              fullWidth
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outlined" onClick={() => setUnsaved(true)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {itemToEdit ? "Save Edits" : " Add Item"}
            </Button>
          </div>
        </form>
      </BasicModal>
    </>
  );
}
