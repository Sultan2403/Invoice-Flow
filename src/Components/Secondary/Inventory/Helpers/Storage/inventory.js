const INVENTORY_KEY = "inventory";

export function getInventoryItems() {
  return JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];
}

export function addNewInventoryItem(item) {
  const prev = getInventoryItems();
  localStorage.setItem(INVENTORY_KEY, JSON.stringify([...prev, item]));
}

export function updateInventoryItem(updatedItem) {
  const items = getInventoryItems();
  const updated = items.map((i) => (i.id === updatedItem.id ? updatedItem : i));
  saveInventoryItems(updated);
}

function saveInventoryItems(item) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(item));
}

export function deleteInventoryItem(item) {
  const items = getInventoryItems();
  const updated = items.filter((i) => i.id !== item.id);
  saveInventoryItems(updated);
}
