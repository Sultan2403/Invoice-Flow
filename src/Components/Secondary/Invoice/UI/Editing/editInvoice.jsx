import { TextField } from "@mui/material";
import { getInvoices } from "../../Helpers/Local Storage/getInvoices";
import useInvoiceId from "../../Hooks/useInvoice";
import { useState } from "react";
import Button from "@mui/material/Button";
import { Edit, PlusIcon } from "lucide-react";

export default function Edit_Invoice() {
  const invoice = useInvoiceId(getInvoices());
  const today = new Date().toISOString().split("T")[0];

  const [invoiceData, setInvoiceData] = useState(invoice);
  const [globalTax, setGlobalTax] = useState(0);
  const [errors, setErrors] = useState({});

  console.log(invoice);

  if (invoice.status === "Draft") {
    return (
      <form
        // onSubmit={handleSubmit}
        noValidate
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        {/* HEADER */}
        <h2 className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
          <span>{<Edit />}</span> <span>Edit Invoice</span>
        </h2>

        {/* INVOICE METADATA */}
        <section className="grid gap-4 sm:grid-cols-2">
          {/* Invoice Name */}
          <TextField
            label="Invoice Name *"
            value={invoiceData.name || ""}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, name: e.target.value })
            }
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          {/* Customer Name */}
          <TextField
            label="Customer Name *"
            value={invoiceData.customer?.name || ""}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                customer: { ...invoiceData.customer, name: e.target.value },
              })
            }
            fullWidth
            error={Boolean(errors.customer?.name)}
            helperText={errors.customer?.name}
          />

          {/* Customer Email */}
          <TextField
            label="Customer Email"
            value={invoiceData.customer?.email || ""}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                customer: { ...invoiceData.customer, email: e.target.value },
              })
            }
            fullWidth
            error={Boolean(errors.customer?.email)}
            helperText={errors.customer?.email}
          />

          {/* Customer Address */}
          <TextField
            label="Customer Address"
            value={invoiceData.customer?.address || ""}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                customer: { ...invoiceData.customer, address: e.target.value },
              })
            }
            fullWidth
            error={Boolean(errors.customer?.address)}
            helperText={errors.customer?.address}
          />

          {/* Issue Date */}
          <TextField
            label="Issue Date *"
            type="date"
            value={invoiceData.issueDate}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, issueDate: e.target.value })
            }
            fullWidth
            error={Boolean(errors.issueDate)}
            helperText={errors.issueDate}
            slotProps={{
              input: { min: today },
              label: { shrink: true },
            }}
          />

          {/* Due Date */}
          <TextField
            label="Due Date *"
            type="date"
            value={invoiceData.dueDate || ""}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, dueDate: e.target.value })
            }
            fullWidth
            error={Boolean(errors.dueDate)}
            helperText={errors.dueDate}
            slotProps={{
              input: { min: invoiceData.issueDate },
              label: { shrink: true },
            }}
          />
        </section>

        <section className="space-y-3">
          {invoiceData.items.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
              >
                {/* Left: Info + stats */}
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {item.description}
                  </p>

                  {/* Stats: flex row on desktop, stacked on mobile */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-md text-gray-700">
                    <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                      <span className="font-medium mr-1">Qty:</span>
                      <span>{item.quantity}</span>
                    </div>
                    <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                      <span className="font-medium mr-1">Price:</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                    <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                      <span className="font-medium mr-1">Local Tax:</span>
                      <span>{item.tax}%</span>
                    </div>
                    <div className="sm:flex sm:items-center border-l border-gray-300 pl-2">
                      <span className="font-medium mr-1">Global Tax:</span>
                      <span>{globalTax}%</span>
                    </div>
                    <div className="sm:flex sm:items-center border-l border-gray-300 pl-2 font-bold">
                      <span className="font-medium mr-1">Total:</span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions, same width */}
                <div className="flex gap-2 sm:flex-col sm:items-end mt-2 sm:mt-0">
                  <Button
                    type="button"
                    onClick={() => StartItemEdit(item.id)}
                    variant="outlined"
                    size="small"
                    className="w-24"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    variant="contained"
                    color="error"
                    size="small"
                    className="w-24"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </section>
      </form>
    );
  }
}
