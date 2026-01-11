import { TextField } from "@mui/material";
import { getInvoices } from "../../Helpers/Local Storage/getInvoices";
import useInvoiceId from "../../Hooks/useInvoice";
import { useState } from "react";
import Button from "@mui/material/Button";
import { Edit, Hammer, PlusIcon } from "lucide-react";

export default function Edit_Invoice() {
  const invoice = useInvoiceId(getInvoices());
  const today = new Date().toISOString().split("T")[0];

  const [invoiceData, setInvoiceData] = useState(invoice);
  const [globalTax, setGlobalTax] = useState(0);
  const [errors, setErrors] = useState({});

  console.log(invoice);

  if (invoice.status === "Draft") {
    return (
      <div className="w-full h-full flex items-center justify-center gap-2">
        <span>
          <Hammer />
        </span>{" "}
        <span>This page is under construction</span>
      </div>
    );
  }
}
