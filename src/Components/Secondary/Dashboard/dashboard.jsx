import { useEffect, useState } from "react";
import { getCustomers } from "../Customers/Helpers/Storage/customers";
import { getInventoryItems } from "../Inventory/Helpers/Storage/inventory";
import { getInvoices } from "../Invoice/Helpers/Storage/getInvoices";
import { getSaleData } from "../POS Sale/Helpers/Storage/storage";

function MetricCard({ title, value, hint }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [posSales, setPosSales] = useState([]);

  useEffect(() => {
    setCustomers(getCustomers());
    setInventory(getInventoryItems());
    setInvoices(getInvoices());
    setPosSales(getSaleData());
  }, []);

  const customerCount = customers.length;
  const inventoryCount = inventory.length;

  const lowStockCount = inventory.filter((i) => {
    if (typeof i.lowStockThreshold === "number") return i.currentStock <= i.lowStockThreshold;
    return i.currentStock <= 5;
  }).length;

  const inventoryValue = inventory.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.currentStock || 0)), 0);

  const invoiceCount = invoices.length;
  const totalSales = invoices.reduce((sum, inv) => sum + (Number(inv.total || 0)), 0);

  const recentInvoices = [...invoices].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard title="Customers" value={customerCount} />
        <MetricCard title="Inventory Items" value={inventoryCount} hint={`Low stock: ${lowStockCount}`} />
        <MetricCard title="Inventory Value" value={`$${inventoryValue.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard title="Invoices" value={invoiceCount} />
        <MetricCard title="Total Sales" value={`$${totalSales.toFixed(2)}`} />
        <MetricCard title="POS Records" value={posSales.length} />
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-2">Recent Invoices</h3>
        {recentInvoices.length === 0 ? (
          <div className="text-sm text-gray-500">No invoices yet.</div>
        ) : (
          <ul className="space-y-2">
            {recentInvoices.map((inv) => (
              <li key={inv.id} className="flex justify-between">
                <div>
                  <div className="font-medium">{inv.name || inv.no || "Invoice"}</div>
                  <div className="text-xs text-gray-500">{new Date(inv.createdAt).toLocaleString()}</div>
                </div>
                <div className="font-medium">${Number(inv.total || 0).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
