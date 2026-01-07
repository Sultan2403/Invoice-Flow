export function calcLocalTax({ draftItem }) {
  const subtotal = draftItem.quantity * draftItem.price;
  const taxRate = draftItem.tax / 100;
  const taxAmount = subtotal * taxRate; // The actual amount the customer is charged

  const total = subtotal + taxAmount;

  return { subtotal, taxAmount, taxRate, total };
}

export function calcGlobalFinancials({ globalTax, items }) {
  const itemsSubtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const taxRate = globalTax / 100;
  const taxAmount = itemsSubtotal * taxRate; // The actual amount the customer is charged
  const total = itemsSubtotal + taxAmount;

  return { itemsSubtotal, taxAmount, taxRate, total };
}
