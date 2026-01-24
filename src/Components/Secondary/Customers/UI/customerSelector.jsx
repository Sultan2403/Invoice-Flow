import { Autocomplete, TextField } from "@mui/material";
import { useState, useMemo } from "react";
import { getCustomers } from "../Helpers/Storage/customers";

export default function CustomerSelector({customers, selectedCustomer, setSelectedCustomer }) {
  
  const [localCust, setLocalCust] = useState(selectedCustomer || null)

  return (
    <Autocomplete
      options={customers}
      getOptionLabel={(cust) =>
        cust.name + (cust.email ? ` (${cust.email})` : "")
      }
      value={selectedCustomer || localCust}
      onChange={(event, newValue) => {setSelectedCustomer?.(newValue); setLocalCust(newValue)}}
      renderInput={(params) => (
        <TextField {...params} label="Select Customer (optional)" size="small" fullWidth />
      )}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
    />
  );
}
