export function validateInvoice(invoice) {
  const { invoice_name, customer_name, quantity, price } = invoice;

  const errors = {};

  if (!invoice_name?.trim()) {
    errors.invoice_name = "Invoice name is required";
  }

  if (!customer_name?.trim()) {
    errors.customer_name = "Customer name is required";
  }

  if (!quantity || quantity < 1) {
    errors.quantity = "Quantity must be at least 1";
  }

  if (!price || price < 1) {
    errors.price = "Price must be greater than 0";
  }

  return errors;
}

export function submitInvoice(invoice) {
  const INVOICE_KEY = "invoices";

  const existing = JSON.parse(localStorage.getItem(INVOICE_KEY)) || [];
  const updated = [...existing, invoice];

  localStorage.setItem(INVOICE_KEY, JSON.stringify(updated));
}
