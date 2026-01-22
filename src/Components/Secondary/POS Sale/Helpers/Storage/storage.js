const POS_SALE_STORAGE_KEY = "pos_sale_data";

export function getSaleData() {
  return JSON.parse(localStorage.getItem(POS_SALE_STORAGE_KEY)) || [];
}

export function saveSaleData(saleData) {
  const updated = [getSaleData(), ...saleData];
  localStorage.setItem(POS_SALE_STORAGE_KEY, JSON.stringify(updated));
}
