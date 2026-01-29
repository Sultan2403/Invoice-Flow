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
      <div className="space-y-6">
        {/* Close Button */}
        <div className="flex justify-end">
          <IconButton onClick={handleClose} size="small" className="hover:bg-gray-100">
            <X size={20} />
          </IconButton>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800">Mark Invoice as Paid</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Payment Method */}
          <TextField
            select
            label="Payment Method *"
            value={paymentMethod}
            error={Boolean(errors.paymentMethod)}
            helperText={errors.paymentMethod || "Select how payment was received"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="">-- Select Method --</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Mobile Money">Mobile Money</MenuItem>
          </TextField>

          {/* Amount Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Amount to be Paid</p>
            <p className="text-2xl font-bold text-blue-700">
              ${invoice.total?.toFixed(2) || "0.00"}
            </p>
          </div>

          {/* Info Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ℹ️ Full payment is required. Partial payments will be supported in future updates.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outlined" 
              onClick={handleClose}
              sx={{ px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{ px: 3 }}
            >
              Confirm Payment
            </Button>
          </div>
        </form>
      </div>
    </BasicModal>
  );
}
