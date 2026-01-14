export default function getReceipts() {
  const RECEIPT_KEY = "receipts";

  const existing = JSON.parse(localStorage.getItem(RECEIPT_KEY)) || [];

  return existing;
}
