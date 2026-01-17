const INVENTORY_KEY = "inventory";

export function getInventory() {
  return JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];
}

export function saveInventoryItem(item) {
  const prev = getInventory();
  localStorage.setItem(INVENTORY_KEY, [...prev, item]);
}
