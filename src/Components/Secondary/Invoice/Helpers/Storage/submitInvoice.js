import { getInventoryItems, updateInventoryItem } from "../../../Inventory/Helpers/Storage/inventory";

export function submitInvoice(invoice) {
  const INVOICE_KEY = "invoices";

  // mark reserved quantities in inventory (do not decrement currentStock)
  try {
    const inventory = getInventoryItems();

    invoice.items?.forEach((it) => {
      const inv = inventory.find((i) => i.id === it.id);
      if (inv) {
        const reserved = Number(inv.reserved || 0) + Number(it.quantity || 0);
        const updatedInv = { ...inv, reserved };
        updateInventoryItem(updatedInv);
      }
    });
  } catch (e) {
    // Fail silently — reservation is best-effort
    console.warn("Failed to reserve inventory for invoice", e);
  }

  const existing = JSON.parse(localStorage.getItem(INVOICE_KEY)) || [];
  invoice.no = `INV-${new Date().getFullYear()}-${String(existing.length).padStart(3, "0")}`;
  const updated = [...existing, invoice];

  localStorage.setItem(INVOICE_KEY, JSON.stringify(updated));
}
