// -------------------- Invoice Helpers -----------------------------------------
export function validateInvoice(invoice) {
  const errors = {};

  // --- Invoice Name ---
  const invoiceNameRegex = /^[a-zA-Z0-9\s._-]{1,50}$/;
  if (!invoice.invoice_name?.trim()) {
    errors.invoice_name = "Invoice name is required";
  } else if (!invoiceNameRegex.test(invoice.invoice_name.trim())) {
    errors.invoice_name =
      "Invoice name can include letters, numbers, spaces, '.', '-', '_' only (max 50 chars)";
  }

  // --- Customer Name ---
  const customerNameRegex = /^[a-zA-Z0-9\s.'-]{1,50}$/;
  if (!invoice.customer.name?.trim()) {
    errors.customer_name = "Customer name is required";
  } else if (!customerNameRegex.test(invoice.customer.customer_name.trim())) {
    errors.customer_name =
      "Customer name can include letters, numbers, spaces, apostrophe, period, hyphen (max 50 chars)";
  }

  // --- Customer Email (optional) ---
  if (invoice.customer.email?.trim()) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(invoice.customer.customer_email.trim())) {
      errors.customer_email = "Invalid email format";
    }
  }

  // --- Customer Address (optional) ---
  if (invoice.customer.address?.trim()) {
    const addressRegex = /^[a-zA-Z0-9\s.,#-]{0,100}$/;
    if (!addressRegex.test(invoice.customer.customer_address.trim())) {
      errors.customer_address =
        "Address can include letters, numbers, spaces, ',', '.', '#' or '-' (max 100 chars)";
    }
  }

  // --- Issue Date ---
  if (!invoice.issueDate) {
    errors.issueDate = "Issue date is required";
  } else {
    const issueDate = new Date(invoice.issueDate);
    if (isNaN(issueDate.getTime())) {
      errors.issueDate = "Issue date is invalid";
    }
  }

  // --- Due Date ---
  if (!invoice.dueDate) {
    errors.dueDate = "Due date is required";
  } else {
    const dueDate = new Date(invoice.dueDate);
    const issueDate = new Date(invoice.issueDate);

    if (isNaN(dueDate.getTime())) {
      errors.dueDate = "Due date is invalid";
    } else if (dueDate < issueDate) {
      errors.dueDate = "Due date cannot be before issue date";
    }
  }

  // --- Items ---
  if (!invoice.items || invoice.items.length === 0) {
    errors.items = "At least one item is required to create an invoice";
  }

  // -------------------- ITEMS CHECK --------------------
  if (!invoice.items || invoice.items.length === 0) {
    errors.items = "At least one item is required to create an invoice";
  }

  // Taxes
  if (invoice.tax) {
    if (typeof invoice.tax !== "number" || isNaN(invoice.tax)) {
      errors.tax = "Tax must be a valid number";
    } else if (invoice.tax <= 0) {
      errors.tax = "Tax must be greater than zero";
    } else if (invoice.tax > 100) {
      errors.tax = "Tax must be between 0 and 100";
    }
  }

  return errors;
}
