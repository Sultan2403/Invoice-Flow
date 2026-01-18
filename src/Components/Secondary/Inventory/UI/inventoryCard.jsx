import { IconButton, Typography } from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";
import { currencyFormatter } from "../../../../Utils/helpers";

export default function InventoryCard({ item, onEdit, onDelete }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition w-full">
      {/* Image */}
      <div className="w-full md:w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="max-w-full max-h-full"
          />
        ) : (
          <Typography className="text-gray-400 text-sm">No Image</Typography>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500">
            Category: {item.category || "N/A"}
          </p>
          <p className="text-sm text-gray-500">SKU: {item.sku || "N/A"}</p>
        </div>

        <div className="flex gap-6 mt-2 text-gray-700">
          <p className="text-sm font-medium">
            Unit Price: {currencyFormatter.format(item.price)}
          </p>
          <p className="text-sm font-medium">Qty Left: {item.quantity} units</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-between gap-2">
        <button
          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
          onClick={() => onEdit(item)}
        >
          <Edit2 size={16} /> Edit
        </button>
        <button
          className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
          onClick={() => onDelete(item)}
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
