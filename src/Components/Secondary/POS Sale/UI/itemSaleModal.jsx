import { useState, useEffect } from "react";
import { Button, TextField, Box } from "@mui/material";
import {
  calculateItemSubtotal,
  calculateItemTotal,
} from "../Helpers/Calc/calcs";

export default function ItemSaleModal({
  item = {},
  onClose,
  onAdd,
  onEdit,
  isEdit = false,
}) {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [applyTax, setApplyTax] = useState(item.applyTax || false);

  useEffect(() => {
    setQuantity(item.quantity || "");
    setError("");
    setApplyTax(item.applyTax || false);
  }, [item]);

  const handleConfirm = () => {
    if (quantity < 1 || quantity > item.currentStock) {
      setError(
        `Quantity must be between 1 and ${item.currentStock > 0 ? item.currentStock : 1}`
      );
      return;
    }

    const tempItem = {
      id: item.id,
      name: item.name,
      unitPrice: item.price || item.unitPrice,
      quantity: Number(quantity),
      taxRate: item.taxRate || 0,
      applyTax,
    };

    const finalItem = {
      ...tempItem,
      subtotal: calculateItemSubtotal(tempItem),
      total: calculateItemTotal(tempItem),
    };

    if (isEdit) {
      onEdit?.(finalItem);
    } else {
      onAdd?.(finalItem);
    }

    onClose?.();
  };

  return (
    <Box className="flex flex-col gap-4 p-4 w-full max-w-sm">
      <h3 className="text-lg font-semibold">{item.name}</h3>

      <p className="text-sm text-gray-600">
        Stock available: <strong>{item.currentStock}</strong>
      </p>

      <TextField
        label="Quantity to Sell *"
        type="number"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
          setError("");
        }}
        error={Boolean(error)}
        helperText={error}
        slotProps={{ htmlInput: { min: 1, max: item.currentStock } }}
        fullWidth
      />

      <Box className="flex items-center justify-between bg-gray-50 p-3 rounded">
        <span className="text-sm font-medium">
          Tax Rate: {item.taxRate ? (item.taxRate * 100).toFixed(2) : 0}%
        </span>

        <Button
          size="small"
          disabled={!item.taxRate || item.taxRate === 0}
          variant={applyTax ? "contained" : "outlined"}
          onClick={() => setApplyTax((prev) => !prev)}
        >
          {applyTax ? "Tax Applied" : "Apply Tax"}
        </Button>
      </Box>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </Box>
  );
}
