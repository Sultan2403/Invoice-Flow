// Item level calculations

export const calculateItemSubtotal = (item) => {
  return item.unitPrice * item.quantity;
};

export const calculateItemTax = (item) => {
  if (!item.applyTax || !item.taxRate) return 0;
  return calculateItemSubtotal(item) * item.taxRate;
};

export const calculateItemTotal = (item) => {
  return calculateItemSubtotal(item) + calculateItemTax(item);
};

// Cart level calculations

export const calculateCartSubtotal = (items) =>
  items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);

export const calculateCartTax = (items) =>
  items.reduce((sum, item) => sum + calculateItemTax(item), 0);

export const calculateCartTotal = (items) =>
  calculateCartSubtotal(items) + calculateCartTax(items);
