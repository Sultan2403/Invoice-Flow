import { validateSKU, validateSKUUnique } from "./validateSKU";

export default function validateInventoryItem(item) {
  const errors = {};

  // Required fields
  if (!item.name || item.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!item.price) errors.price = "Item price is required";
  else if (isNaN(item.price)) {
    errors.price = "Price must be a number greater than 0";
  }

  if (!item.quantity) {
    errors.quantity = "Quantity is required";
  }

  if (isNaN(item.quantity)) {
    errors.quantity = "Quantity must be a number greater than 0";
  }

  // Optional fields: validate numbers if provided
  if (item.lowStockThreshold && isNaN(item.lowStockThreshold)) {
    errors.lowStockThreshold =
      "Low stock threshold must be a number greater than 0";
  }

  const skuErrs = validateSKU(item.sku) || validateSKUUnique(item.sku);
  skuErrs ? (errors.sku = skuErrs) : null;

  return errors;
}
