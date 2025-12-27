// -------------------- Invoice Helpers -----------------------------------------

export function validateInvoice(invoice) {
  const { invoice_name, customer_name, quantity, price } = invoice;

  const errors = {};

  // Invoice name
  if (!invoice_name?.trim()) {
    errors.invoice_name = "Invoice name is required";
  } else if (/^\d+$/.test(invoice_name.trim())) {
    errors.invoice_name = "Invoice name cannot be only numbers";
  }

  // Customer name
  if (!customer_name?.trim()) {
    errors.customer_name = "Customer name is required";
  } else if (/^\d+$/.test(customer_name.trim())) {
    errors.customer_name = "Customer name cannot be only numbers";
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
