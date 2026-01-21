import { deleteCustomer, getCustomers } from "../Helpers/Storage/customers";
import { useEffect, useMemo, useState } from "react";
import Customer_Form from "./customerForm";
import CustomerCard from "./customerCard";
import BasicModal from "../../../UI/Modal/modal";
import { Button } from "@mui/material";

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
    <div>
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <Button onClick={() => setFormOpen(true)}>Add Customer</Button>
      {customers.length === 0 ? (
        <div>
          <p>No customers found.</p>
        </div>
      ) : (
        customers.map((customer) => (
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
        ))
      )}
      <BasicModal open={confirmation} onClose={() => setConfirmation(false)}>
        <div>
          <h1>Delete Customer</h1>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-bold text-red-500">{deleteItem?.name}</span>
          </p>
          <p>This action cannot be undone.</p>
          <div>
            <Button
              onClick={() => {
                setConfirmation(false);
                setDeleteItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmation(false);
                deleteCustomer(deleteItem);
                setDeleteItem(null);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </BasicModal>
      <BasicModal open={formOpen}>
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

      <BasicModal open={feedback} onClose={() => setFeedback(false)}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Success</h2>
          <p>The customer has been added/edited successfully.</p>
          <Button onClick={() => setFeedback(false)}>Close</Button>
        </div>
      </BasicModal>
    </div>
  );
}
