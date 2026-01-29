import { Button } from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";

export default function CustomerCard({ customer, onEdit, onDelete }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
      {/* Customer Info */}
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
        
        <div className="grid gap-1 text-sm text-gray-600">
          {customer.email && (
            <p>
              <span className="font-medium text-gray-700">Email:</span> {customer.email}
            </p>
          )}
          {customer.phone && (
            <p>
              <span className="font-medium text-gray-700">Phone:</span> {customer.phone}
            </p>
          )}
          {customer.address && (
            <p>
              <span className="font-medium text-gray-700">Address:</span> {customer.address}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Edit2 size={16} />}
          onClick={() => onEdit(customer)}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
          size="small"
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Trash2 size={16} />}
          onClick={() => onDelete(customer)}
          className="border-red-300 text-red-700 hover:bg-red-50"
          size="small"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
