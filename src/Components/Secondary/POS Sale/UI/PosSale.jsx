import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "../../Customers/Helpers/Storage/customers";
import { getInventoryItems, updateInventoryItem } from "../../Inventory/Helpers/Storage/inventory";
import { sortInventoryByName } from "../../Inventory/Helpers/Sorting/sortInventory";
import Inventory_Card from "./inventoryCartCard";
import Customer_Form from "../../Customers/UI/customerForm";
import searchInventory from "../../Inventory/Helpers/Search/searchInventory";
import { Button, TextField } from "@mui/material";
import BasicModal from "../../../UI/Modal/modal";
import ItemSaleModal from "./itemSaleModal";
import Cart_Items from "./cartItems";
import CustomerSelector from "../../Customers/UI/customerSelector";
import saveReceipt from "../../Reciepts/Helpers/Storage/saveReceipt";
import getReceipts from "../../Reciepts/Helpers/Storage/getReceipts";
import { Check, Send, Eye, X } from "lucide-react";

export default function QuickSale() {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddingNewCust, setIsAddingNewCust] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [currItem, setCurrItem] = useState(null);
  const [isEditingCartItem, setIsEditingCartItem] = useState(false);
  const [customerWarning, setCustomerWarning] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  const customers = useMemo(() => getCustomers(), [isAddingNewCust]);
  const inventory = useMemo(() => getInventoryItems(), []);

  const searchResults = useMemo(
    () => searchInventory({ inventory, searchTerm }),
    [searchTerm, inventory],
  );

  const sortedInventory = useMemo(
    () => sortInventoryByName(searchResults, "asc"),
    [searchResults],
  );

  const onAddItem = (item) => {
    setCurrItem(item);
    setIsEditingCartItem(false);
  };

  const editCartItem = (editedItem) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === editedItem.id ? editedItem : i)),
    );
  };

  const removeCartItem = (itemToRemove) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemToRemove.id));
  };

  const isInCart = (id) => cartItems.some((i) => i.id === id);
  const itemInCart = (id) => cartItems.find((i) => i.id === id) || {};

  const onEditItem = (item) => {
    setIsEditingCartItem(true);
    setCurrItem(item);
  };

  const finalizeSale = () => {
    // validate stock before committing
    const inventory = getInventoryItems();
    for (const ci of cartItems) {
      const inv = inventory.find((i) => i.id === ci.id);
      if (!inv || Number(inv.currentStock || 0) < Number(ci.quantity || 0)) {
        setError(`Insufficient stock for ${ci.name}`);
        return;
      }
    }

    // decrement stock
    for (const ci of cartItems) {
      const inv = getInventoryItems().find((i) => i.id === ci.id);
      const updated = { ...inv, currentStock: Number(inv.currentStock || 0) - Number(ci.quantity || 0) };
      // reduce reserved if present
      if (updated.reserved) {
        updated.reserved = Math.max(0, Number(updated.reserved) - Number(ci.quantity || 0));
      }
      updateInventoryItem(updated);
    }

    // create receipt
    const total = cartItems.reduce((s, it) => s + Number(it.total || 0), 0);
    const receipt = {
      id: crypto.randomUUID(),
      no: `RCP-${new Date().getFullYear()}-${String(getReceipts().length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      items: cartItems,
      customer: selectedCustomer || null,
      total,
      amountPaid: total,
      paymentMethod: "Cash", // default for POS
      source: "POS",
    };

    saveReceipt(receipt);
    setLastReceipt(receipt);

    // clear cart
    setCartItems([]);
    setCurrItem(null);
    setSelectedCustomer(null);
    setError("");
    setShowConfirmation(false);
    setShowSuccess(true);
  };

  const handleCheckout = () => {
    // Validate cart has items
    if (cartItems.length === 0) {
      setError("Cart is empty. Add items before checkout.");
      return;
    }

    // Show confirmation modal
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Error Modal */}
      <BasicModal open={Boolean(error)} onClose={() => setError("")}>
        <div className="p-4 space-y-3">
          <h2 className="text-lg font-semibold text-red-700">Error</h2>
          <p className="text-sm text-gray-700">{error}</p>
          <div className="flex justify-end">
            <Button variant="contained" onClick={() => setError("")}>
              Close
            </Button>
          </div>
        </div>
      </BasicModal>

      {/* Confirmation Modal */}
      <BasicModal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Sale</h2>
            <button
              onClick={() => setShowConfirmation(false)}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Customer</p>
            <p className="text-lg font-semibold text-gray-900">
              {selectedCustomer?.name || "Walk-in Customer (No Customer Selected)"}
            </p>
            {selectedCustomer?.email && (
              <p className="text-xs text-gray-500 mt-1">{selectedCustomer.email}</p>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <p className="font-semibold text-gray-800">Items</p>
            <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ${Number(item.unitPrice || 0).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 min-w-[80px] text-right">
                    ${Number(item.total || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-800">Total Amount</p>
              <p className="text-2xl font-bold text-blue-700">
                ${Number(
                  cartItems.reduce((s, it) => s + Number(it.total || 0), 0)
                ).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={finalizeSale}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Confirm & Process
            </button>
          </div>
        </div>
      </BasicModal>

      {/* Success Modal */}
      <BasicModal open={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="space-y-6">
          {/* Success Header */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-green-100 rounded-full p-4">
              <Check size={40} className="text-green-600" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Sale Completed!</h2>
              <p className="text-sm text-gray-600 mt-2">
                Receipt #{lastReceipt?.no || "—"} has been generated
              </p>
            </div>
          </div>

          {/* Sale Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Total Amount:</span>
              <span className="font-bold text-gray-900">
                ${Number(lastReceipt?.total || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Items Sold:</span>
              <span className="font-bold text-gray-900">{lastReceipt?.items?.length || 0}</span>
            </div>
            {lastReceipt?.customer && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Customer:</span>
                <span className="font-bold text-gray-900">{lastReceipt.customer.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Time:</span>
              <span className="font-bold text-gray-900">
                {lastReceipt?.createdAt
                  ? new Date(lastReceipt.createdAt).toLocaleTimeString()
                  : "—"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2 border-t">
            <button
              onClick={() => {
                navigate(`/receipts/view/${lastReceipt?.id}`);
                setShowSuccess(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Eye size={18} /> View Receipt
            </button>

            {lastReceipt?.customer?.email && (
              <button
                onClick={() => {
                  // TODO: Implement send to customer functionality
                  console.log(`Sending receipt to ${lastReceipt.customer.email}`);
                  alert(`Receipt would be sent to ${lastReceipt.customer.email}`);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                <Send size={18} /> Send to Customer
              </button>
            )}

            <button
              onClick={() => {
                setShowSuccess(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </BasicModal>

      {/* Customer Modal */}
      <BasicModal open={isAddingNewCust}>
        <Customer_Form
          onClose={() => setIsAddingNewCust(false)}
          onSubmit={() => setIsAddingNewCust(false)}
        />
      </BasicModal>

      {/* Item Sale Modal */}
      <BasicModal open={Boolean(currItem)}>
        <ItemSaleModal
          item={currItem}
          isEdit={isEditingCartItem}
          onEdit={(item) => editCartItem(item)}
          onClose={() => setCurrItem(null)}
          onAdd={(item) => setCartItems((prev) => [...prev, item])}
        />
      </BasicModal>

      {/* Header + Controls */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Quick Sale</h1>

        {/* Top Bar: Search + Customers */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            label="Search Inventory"
            placeholder="Search by item name..."
            size="small"
            fullWidth
          />

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Customers Section */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">Customer (Optional)</label>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => setIsAddingNewCust(true)}
                  variant="outlined"
                  size="small"
                >
                  + Add New Customer
                </Button>
                {customers.length > 0 && (
                  <div className="flex-1">
                    <CustomerSelector
                      customers={customers}
                      selectedCustomer={selectedCustomer}
                      setSelectedCustomer={setSelectedCustomer}
                    />
                  </div>
                )}
              </div>
              {selectedCustomer && (
                <div className="text-xs text-blue-600">
                  ✓ {selectedCustomer.name}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content: Inventory (Left) + Cart (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Inventory</h2>
              {sortedInventory.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {sortedInventory.map((item) => (
                    <Inventory_Card
                      key={item.id}
                      onAdd={(item) => onAddItem(item)}
                      item={item}
                      isInCart={isInCart}
                      itemInCart={itemInCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6">No items found.</div>
              )}
            </div>
          </div>

          {/* Cart Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Cart</h2>
              <Cart_Items
                cartItems={cartItems}
                onEdit={(item) => onEditItem(item)}
                onRemove={(item) => removeCartItem(item)}
              />

              {/* Checkout Button */}
              <div className="mt-4 space-y-2">
                <Button
                  onClick={handleCheckout}
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={cartItems.length === 0}
                  sx={{
                    backgroundColor: cartItems.length === 0 ? "#ccc" : "#2563eb",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Checkout
                </Button>
                <div className="text-xs text-gray-500 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <strong>⚠️ Note:</strong> Checkout will immediately decrement stock. Ensure payment is confirmed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
