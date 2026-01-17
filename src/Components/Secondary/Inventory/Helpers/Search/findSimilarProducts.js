import { getInventoryItems } from "../Storage/inventory";

export function findSimilarInventoryItem(newItem) {
  const inventory = getInventoryItems();
  return inventory.find((item) => {
    // SKU match (strong signal)
    if (item.sku && newItem.sku && item.sku === newItem.sku) {
      return true;
    }

    // Name + price match (soft signal)
    const sameName =
      item.name?.trim().toLowerCase() === newItem.name?.trim().toLowerCase();

    const samePrice = Number(item.price) === Number(newItem.price);

    return sameName && samePrice;
  });
}
