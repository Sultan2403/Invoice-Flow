// -------------------- Invoice Helpers -----------------------------------------

export function validateInvoice(invoice) {
  const { invoice_name, customer_name, quantity, price } = invoice || {};

  const errors = {};

  // Invoice name
  if (!invoice_name?.trim()) {
    errors.invoice_name = "Invoice name is required";
  } else if (!/^[a-zA-z\s]+$/.test(invoice_name.trim())) {
    errors.invoice_name = "Invoice name must only include letterss";
  }

  // Customer name
  if (!customer_name?.trim()) {
    errors.customer_name = "Customer name is required";
  } else if (!/^[a-zA-z\s]+$/.test(customer_name)) {
    errors.customer_name = "Customer name must only include letters";
  }

  // quantity - ensure numeric comparison
  const q = Number(quantity);
  if (!quantity || Number.isNaN(q) || q < 1) {
    errors.quantity = "Quantity must be at least 1";
  }

  // price - ensure numeric comparison
  const p = Number(price);
  if (!price || Number.isNaN(p) || p < 1) {
    errors.price = "Price must be greater than 0";
  }

  return errors;
}

// Attach per-field validator helpers to the function for lightweight, keystroke validation
validateInvoice.field = function fieldValidator(fieldName, value) {
  switch (fieldName) {
    case "invoice_name": {
      if (!value?.trim()) return "Invoice name is required";
      if (!/^[a-zA-z\s]+$/.test(value.trim()))
        return "Invoice name cannot include numbers";
      return undefined;
    }

    case "customer_name": {
      if (!value?.trim()) return "Customer name is required";
      if (!/^[a-zA-z\s]+$/.test(value.trim()))
        return "Customer name must only include letters";
      return undefined;
    }

    case "quantity": {
      const n = Number(value);
      if (!value || Number.isNaN(n) || n < 1)
        return "Quantity must be at least 1";
      return undefined;
    }

    case "price": {
      const n = Number(value);
      if (!value || Number.isNaN(n) || n < 1)
        return "Price must be greater than 0";
      return undefined;
    }

    default:
      return undefined;
  }
};

export function submitInvoice(invoice) {
  const INVOICE_KEY = "invoices";

  const existing = JSON.parse(localStorage.getItem(INVOICE_KEY)) || [];
  const updated = [...existing, invoice];

  localStorage.setItem(INVOICE_KEY, JSON.stringify(updated));
}
