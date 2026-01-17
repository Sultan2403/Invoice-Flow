import { getInventory } from "../Storage/inventory";

export function validateSKU(sku) {
  if (!sku) return null; // optional

  const pattern = /^[a-zA-Z0-9-_]+$/; // only letters, numbers, dash, underscore
  if (!pattern.test(sku))
    return "SKU can only contain letters, numbers, - and _";

  if (sku.length < 3 || sku.length > 20)
    return "SKU must be 3-20 characters long";

  return null; // no errors
}

export function validateSKUUnique(sku) {
  if (!sku) return null; // optional
  const inventory = getInventory();
  const exists = inventory.some((item) => item.sku === sku);
  if (exists) return "SKU must be unique";
  return null;
}
