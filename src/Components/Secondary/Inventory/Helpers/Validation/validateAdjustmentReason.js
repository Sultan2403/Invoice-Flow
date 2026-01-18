export default function validateAdjustmentReason({
  adjustmentReason,
  quantityChanged,
  initialQuantity,
  newQuantity,
  lowStockThreshold,
}) {
  if (quantityChanged && !adjustmentReason) {
    return {
      adjustmentReason: "Adjustment reason is required when quantity changes.",
    };
  } else if (
    adjustmentReason === "Damaged Goods" &&
    newQuantity > initialQuantity
  ) {
    return {
      adjustmentReason:
        "Cannot increase quantity when reason is 'Damaged Goods'.",
    };
  } else if (adjustmentReason === "Theft" && newQuantity > initialQuantity) {
    return {
      adjustmentReason: "Cannot increase quantity when reason is 'Theft'.",
    };
  } else if (
    adjustmentReason === "New Stock Arrival" &&
    newQuantity < initialQuantity
  ) {
    return {
      adjustmentReason:
        "Cannot decrease quantity when reason is 'New Stock Arrival'.",
    };
  }
  if (quantityChanged && lowStockThreshold > newQuantity) {
    return {
      lowStockThreshold:
        "Low stock threshold cannot be greater than current quantity.",
    };
  }
  if (
    quantityChanged &&
    (initialQuantity || 0) + inventoryItem.stockAdjustment < 0
  ) {
    return {
      stockAdjustment: "Resulting stock cannot be negative",
    };
  }
  return {};
}
