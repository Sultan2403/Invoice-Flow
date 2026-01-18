import { getInventoryItems } from "../Storage/inventory";

export default function getInventoryItemById(id) {
  const inventory = getInventoryItems();
  return inventory.find((item) => item.id === id);
}
