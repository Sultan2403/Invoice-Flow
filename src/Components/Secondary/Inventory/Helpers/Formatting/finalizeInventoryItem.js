export default function finalizeInventoryItem(item) {
  return {
    ...item,
    id: item.id || crypto.randomUUID(),
    price: Number(item.price),
    quantity: Number(item.quantity),
    lowStockThreshold: item.lowStockThreshold
      ? Number(item.lowStockThreshold)
      : 0,
  };
}
