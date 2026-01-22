import BasicModal from "../../../UI/Modal/modal";
import { Button } from "@mui/material";

export default function ConfirmationModal({
  open,
  onClose,
  items,
  customer,
  totalAmount,
  onConfirm,
}) {
  return (
    <BasicModal open={open} onClose={onClose}>
      <div className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Sale</h2>
        <p className="mb-2">Customer: {customer?.name || "No Customer"}</p>
        <ul className="mb-4">
          {items.map((item) => (
            <li key={item.id} className="text-sm">
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
        <p className="font-semibold">Total: ${totalAmount}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outlined" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => onConfirm()}>
            Confirm
          </Button>
        </div>
      </div>
    </BasicModal>
  );
}
