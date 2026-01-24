import { Autocomplete, TextField } from "@mui/material";


export default function InvSelector({invItems,  setSearchTerm }) {
  


  return (
    <Autocomplete
      options={invItems}
      getOptionLabel={(item) => item.name + item.category}
      onInputChange={(e, value) => setSearchTerm(value)}
      renderInput={(params) => (
        <TextField {...params} fullWidth label="Search Inventory" size="small" />
      )}
    />
  );
}
