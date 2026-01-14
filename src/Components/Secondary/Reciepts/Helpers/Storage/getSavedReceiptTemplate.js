export default function getSavedReceiptTemplate() {
  const TEMPLATE_KEY = "receipt_templates";

  return localStorage.getItem(TEMPLATE_KEY) || "";
}
