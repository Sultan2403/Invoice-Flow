export function ValidateDraft({ draftItem, hasLocalTax }) {
  const errs = {};
  if (!draftItem.name.trim()) {
    errs.name = "Item name is required";
  }
  if (!draftItem.description.trim()) {
    errs.description = "Item description is required";
  }
  if (typeof draftItem.quantity !== "number" || isNaN(draftItem.quantity)) {
    errs.quantity = "Quantity must be a valid number";
  } else if (draftItem.quantity <= 0) {
    errs.quantity = "Quantity must be greater than zero";
  }

  if (typeof draftItem.price !== "number" || isNaN(draftItem.price)) {
    errs.price = "Price must be a valid number";
  } else if (draftItem.price <= 0) {
    errs.price = "Price must be greater than zero";
  }

  if (hasLocalTax) {
    if (typeof draftItem.tax !== "number" || isNaN(draftItem.tax)) {
      errs.tax = "Tax must be a valid number";
    } else if (draftItem.tax <= 0) {
      errs.tax = "Tax must be greater than zero";
    } else if (draftItem.tax > 100) {
      errs.tax = "Tax must be between 0 and 100";
    }
  }

  return errs;
}
