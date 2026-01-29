import { useEffect, useState } from "react";
import validateCustomer from "../Helpers/Validation/validateCustomer";
import { addNewCustomer, updateCustomer } from "../Helpers/Storage/customers";
import { Button, TextField } from "@mui/material";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import BasicModal from "../../../UI/Modal/modal";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { X } from "lucide-react";

export default function Customer_Form({ editCustomer, onSubmit, onClose }) {
  const initialCustomerObj = {
    id: crypto.randomUUID(),
    name: "",
    email: "",
    phone: "",
    address: "",
  };
  const [customer, setCustomer] = useState(initialCustomerObj);
  const [errors, setErrors] = useState({});
  const [changes, setChanges] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (editCustomer) {
      setCustomer(editCustomer);
    }
  }, [editCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });

    setChanges(true);
  };

  const checkUnsavedChanges = () => {
    if (changes) {
      setModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateCustomer(customer);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (editCustomer) {
      updateCustomer(customer);
    } else {
      addNewCustomer(customer);
    }

    // Reset form after submission
    onSubmit?.(customer);
    setCustomer(initialCustomerObj);
    setErrors({});
    setChanges(false);
  };

  return (
    <div className="border p-6 rounded shadow-sm mt-6 max-w-md mx-auto relative">
      <BasicModal open={modalOpen}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Unsaved Changes</h2>
          <p>You have unsaved changes. Are you sure you want to close?</p>
          <div>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
          <div>
            <Button
              onClick={() => {
                setModalOpen(false);
                onClose();
              }}
            >
              Discard Changes
            </Button>
          </div>
        </div>
      </BasicModal>
      <h2 className="text-xl font-semibold mb-4 text-center">Customer Form</h2>
      <X className="hover:cursor-pointer absolute top-4 right-4" onClick={checkUnsavedChanges} />

      <div className="flex flex-col gap-3">
        <TextField
          label="Name *"
          name="name"
          value={customer.name}
          onChange={handleChange}
          error={errors.name}
          helperText={errors.name}
          fullWidth
        />
        <TextField
          label="Email *"
          name="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
          helperText={errors.email}
          fullWidth
        />

        <div>
          <FormControl error={Boolean(errors.phone)} fullWidth>
            <div className="flex items-center gap-2 p-2 border rounded bg-gray-50" style={{alignItems: 'center'}}>
              <PhoneInputWithCountrySelect
                className="w-full"
                placeholder="Enter phone number"
                value={customer.phone}
                onChange={(value) => setCustomer({ ...customer, phone: value })}
              />
            </div>
            <FormHelperText>{errors.phone}</FormHelperText>
          </FormControl>
        </div>

        <TextField
          label="Address"
          name="address"
          value={customer.address}
          helperText={errors.address}
          error={errors.address}
          onChange={handleChange}
          fullWidth
        />

        <div className="flex justify-end gap-2 mt-2">
          <Button onClick={checkUnsavedChanges} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editCustomer ? "Update Customer" : "Add Customer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
