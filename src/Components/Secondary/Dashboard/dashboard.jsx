import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomers } from "../Customers/Helpers/Storage/customers";
import { getInventoryItems } from "../Inventory/Helpers/Storage/inventory";
import { getInvoices } from "../Invoice/Helpers/Storage/getInvoices";
import { getSaleData } from "../POS Sale/Helpers/Storage/storage";

function MetricCard({ title, value, hint }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
      <div className="text-sm text-blue-600">{title}</div>
      <div className="text-2xl font-bold mt-2 text-gray-800">{value}</div>
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
    <div className="w-full p-6 bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Dashboard</h2>

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

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-2 text-blue-800">Recent Invoices</h3>
          {recentInvoices.length === 0 ? (
            <div className="text-sm text-gray-500">No invoices yet.</div>
          ) : (
            <ul className="space-y-2">
              {recentInvoices.map((inv) => {
                const status = (inv.status || "").toLowerCase();
                const statusClasses =
                  status === "paid"
                    ? "bg-green-100 text-green-800"
                    : status === "sent"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800";

                return (
                  <li key={inv.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{inv.name || inv.no || "Invoice"}</div>
                      <div className="text-xs text-gray-500">{new Date(inv.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`px-2 py-1 rounded-full text-sm font-semibold ${statusClasses}`}>
                        {inv.status || inv.state || "draft"}
                      </div>

                      <div className="font-medium text-gray-800">${Number(inv.total || 0).toFixed(2)}</div>

                      <Link
                        to={`/invoices/view/${inv.id}/pdf-preview`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
