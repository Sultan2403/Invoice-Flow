const TEMPLATE_KEY = "receipt_templates";
export function getSavedReceiptTemplate() {
  return localStorage.getItem(TEMPLATE_KEY) || "";
}

export function saveReceiptTemplate(update) {
  localStorage.setItem(TEMPLATE_KEY, update);
}
