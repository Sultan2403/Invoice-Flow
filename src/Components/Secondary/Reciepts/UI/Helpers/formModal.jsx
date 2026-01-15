import { useState, useEffect } from "react";
import { Button, TextField, MenuItem, IconButton } from "@mui/material";
import BasicModal from "../../../../UI/Modal/modal";
import { X } from "lucide-react";
import validateReceipt from "../../Helpers/Validation/validateReceipt";
import generateReceipt from "../../Helpers/Creation/generateReceipt";
import saveReceipt from "../../Helpers/Storage/saveReceipt";
import updateInvoice from "../../../Invoice/Helpers/Storage/updateInvoice";

export default function FormModal({ open, invoice, onSubmit }) {
  const [isOpen, setIsOpen] = useState(open);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");

  // Keep internal state in sync with prop
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => setIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const errors = validateReceipt({ paymentMethod });

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const receipt = generateReceipt({ invoice, paymentMethod });
    saveReceipt(receipt);
    const updatedInvoice = {
      ...invoice,
      receiptId: receipt.id,
      status: "Paid",
    };

    updateInvoice(updatedInvoice);
    onSubmit();
    handleClose();
  };

  return (
    <BasicModal open={isOpen} onClose={() => {}}>
      {/* X button */}
      <div className="flex justify-end mb-2">
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </div>

      <h2 className="text-lg font-semibold mb-4">Mark Invoice as Paid</h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          select
          label="Payment Method"
          value={paymentMethod}
          error={errors.paymentMethod}
          helperText={errors.paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
        >
          <MenuItem value="">Select method</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Card">Card</MenuItem>
          <MenuItem value="Transfer">Transfer</MenuItem>
          <MenuItem value="Mobile Money">Mobile Money</MenuItem>
        </TextField>

        <TextField
          label="Amount Paid"
          value={invoice.total.toFixed(2)}
          disabled
          fullWidth
        />
        <p className="text-sm text-gray-500 mt-1">
          Right now, only full payments are supported. Partial payments will be
          implemented in the future.
        </p>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Confirm Payment
          </Button>
        </div>
      </form>
    </BasicModal>
  );
}
