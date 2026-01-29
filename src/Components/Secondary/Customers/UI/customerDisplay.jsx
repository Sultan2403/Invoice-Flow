import { deleteCustomer, getCustomers } from "../Helpers/Storage/customers";
import { useEffect, useMemo, useState } from "react";
import Customer_Form from "./customerForm";
import CustomerCard from "./customerCard";
import BasicModal from "../../../UI/Modal/modal";
import { Button } from "@mui/material";
import CustomerSelector from "./customerSelector";

export default function Customer_Display() {
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const customers = useMemo(
    () => getCustomers(),
    [editItem, deleteItem, feedback],
  );

  useEffect(() => {
    setTimeout(() => {
      setFeedback(false);
    }, 5000);
  }, [feedback]);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <button
            onClick={() => setFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add Customer
          </button>
        </div>

        {/* Customer List or Empty State */}
        {customers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No customers found.</p>
            <p className="text-gray-400 text-sm mt-2">Start by adding your first customer.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={(item) => {
                  setEditItem(item);
                  setFormOpen(true);
                }}
                onDelete={(item) => {
                  setConfirmation(true);
                  setDeleteItem(item);
                }}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <BasicModal open={confirmation} onClose={() => setConfirmation(false)}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Delete Customer</h3>
            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-600">{deleteItem?.name}</span>?
            </p>
            <p className="text-gray-500 text-sm">This action cannot be undone.</p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                onClick={() => {
                  setConfirmation(false);
                  setDeleteItem(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                onClick={() => {
                  setConfirmation(false);
                  deleteCustomer(deleteItem);
                  setDeleteItem(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </BasicModal>

        {/* Customer Form Modal */}
        <BasicModal open={formOpen} onClose={() => setFormOpen(false)}>
          <Customer_Form
            editCustomer={editItem}
            onClose={() => {
              setFormOpen(false);
              setEditItem(null);
            }}
            onSubmit={() => {
              setFeedback(true);
              setFormOpen(false);
              setEditItem(null);
            }}
          />
        </BasicModal>

        {/* Success Feedback Modal */}
        <BasicModal open={feedback} onClose={() => setFeedback(false)}>
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Success</h2>
            <p className="text-gray-600">The customer has been added/edited successfully.</p>
            <button
              onClick={() => setFeedback(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </BasicModal>
      </div>
    </div>
  );
}
