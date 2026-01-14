import getReceipts from "./getReceipts";

export default function saveReceipt(receipt) {
  const RECEIPT_KEY = "receipts";
  const receipts = getReceipts();

  localStorage.setItem(RECEIPT_KEY, JSON.stringify([...receipts, receipt]));
}
