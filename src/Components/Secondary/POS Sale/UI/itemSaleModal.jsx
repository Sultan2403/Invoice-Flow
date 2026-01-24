import { useState } from "react";
import { Button, TextField } from "@mui/material";
import {
  calculateItemSubtotal,
  calculateItemTotal,
} from "../Helpers/Calc/calcs";

export default function ItemSaleModal({
  item,
  onClose,
  onAdd,
  onEdit,
  isEdit = false,
}) {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [applyTax, setApplyTax] = useState(item.applyTax);

  const handleConfirm = () => {
    if (quantity < 1 || quantity > item.currentStock) {
      setError(
        `Quantity must be between 1 and ${item.currentStock > 0 ? item.currentStock : 1}`,
      );
      return;
    }

    const tempItem = {
      id: item.id,
      name: item.name,
      unitPrice: item.price || item.unitPrice,
      quantity,
      taxRate: item.taxRate || 0,
      applyTax,
    };

    const finalItem = {
      ...tempItem,
      subtotal: calculateItemSubtotal(tempItem),
      total: calculateItemTotal(tempItem),
    };

    if (isEdit) {
      onEdit(finalItem);
    } else {
      onAdd(finalItem);
    }

    onClose();
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-80">
      <h3 className="text-lg font-semibold">{item.name}</h3>

      <p className="text-sm text-gray-600">
        Stock available: {item.currentStock}
      </p>

      <TextField
        label="Quantity to Sell"
        type="number"
        value={quantity}
        onChange={(e) => {
          setQuantity(Number(e.target.value));
          setError("");
        }}
        error={error}
        helperText={error}
        slotProps={{ htmlInput: { min: 1, max: item.currentStock } }}
        fullWidth
      />

      <div className="flex items-center justify-between">
        <span className="text-sm">
          Tax: {item.taxRate ? (item.taxRate * 100).toFixed(2) : 0}%
        </span>
        <Button
          size="small"
          disabled={item.taxRate * 100 === 0 ? true : false}
          variant={applyTax ? "contained" : "outlined"}
          onClick={() => setApplyTax((prev) => !prev)}
        >
          {applyTax ? "Tax Applied" : "Apply Tax"}
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
