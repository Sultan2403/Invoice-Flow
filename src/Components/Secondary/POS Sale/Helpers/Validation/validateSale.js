export default function validateSale(saleData) {
  const errors = {};
  if (saleData.itemsToSell.length === 0) {
    errors.itemsToSell = "At least one item must be added to the cart.";
  }
  return errors;
}
