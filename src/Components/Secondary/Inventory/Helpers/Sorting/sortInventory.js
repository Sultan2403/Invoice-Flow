export function sortInventoryByName(inventory, sortOrder) {
  return inventory.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (sortOrder === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
}

export function sortInventoryByPrice(inventory, sortOrder) {
  return inventory.sort((a, b) => {
    const priceA = a.price;
    const priceB = b.price;
    if (sortOrder === "asc") {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });
}

export function sortInventoryByQuantity(inventory, sortOrder) {
  return inventory.sort((a, b) => {
    const quantityA = a.currentStock;
    const quantityB = b.currentStock;
    if (sortOrder === "asc") {
      return quantityA - quantityB;
    } else {
      return quantityB - quantityA;
    }
  });
}
