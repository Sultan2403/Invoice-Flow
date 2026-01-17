import { validateSKU, validateSKUUnique } from "./validateSKU";

export default function validateInventoryItem(item) {
  const errors = {};

  // Required fields
  if (!item.name || item.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!item.price || isNaN(item.price)) {
    errors.price = "Price must be a number greater than 0";
  }

  if (!item.quantity || isNaN(item.quantity)) {
    errors.quantity = "Quantity must be a number greater than 0";
  }

  // Optional fields: validate numbers if provided
  if (item.lowStockThreshold && isNaN(item.lowStockThreshold)) {
    errors.lowStockThreshold =
      "Low stock threshold must be a number greater than 0";
  }

  errors.sku = validateSKU(item.sku) || validateSKUUnique(item.sku);

  return errors;
}
