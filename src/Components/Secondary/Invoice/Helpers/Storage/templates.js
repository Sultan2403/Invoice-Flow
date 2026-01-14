const TEMPLATE_KEY = "invoice_templates";

export function getSavedTemplate() {
  const previewTemplate = localStorage.getItem(TEMPLATE_KEY) || "classic";
  return previewTemplate;
}

export function saveTemplate(templateId) {
  localStorage.setItem(TEMPLATE_KEY, templateId);
}
