import { IconButton, Typography, Badge, Button } from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";
import { currencyFormatter } from "../../../../Utils/helpers";
import ProductImage from "../../../UI/Inventory/productImage";

export default function InventoryCard({ item, onEdit, onDelete }) {
  const isLowStock =
    item.lowStockThreshold !== undefined &&
    item.quantity <= item.lowStockThreshold;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition w-full">
      {/* Image */}
      <div className="w-full md:w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden shrink-0">
        <ProductImage imageUrl={item.imageUrl} name={item.name} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500">
              Category: {item.category || "N/A"}
            </p>
            <p className="text-sm text-gray-500">SKU: {item.sku || "N/A"}</p>
          </div>

          {/* Low stock badge */}
          {isLowStock && (
            <Badge
              color="error"
              variant="standard"
              badgeContent="Low Stock"
              className="ml-2"
            />
          )}
        </div>

        <div className="flex gap-6 mt-2 text-gray-700">
          <p className="text-sm font-medium">
            Unit Price: {currencyFormatter.format(item.price)}
          </p>
          <p
            className={`text-sm font-medium ${
              isLowStock ? "text-red-600 font-bold" : ""
            }`}
          >
            Qty Left: {item.currentStock} units
          </p>
          <p className="text-sm font-medium">
            Tax Rate: {(item.taxRate * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Edit2 size={16} />}
          onClick={() => onEdit(item)}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
          size="small"
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Trash2 size={16} />}
          onClick={() => onDelete(item)}
          className="border-red-300 text-red-700 hover:bg-red-50"
          size="small"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
