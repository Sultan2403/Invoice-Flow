import { Button } from "@mui/material";
import ProductImage from "../../../UI/Inventory/productImage";

export default function Cart_Card({ item, onAdd, onEdit, isInCart }) {
  return (
    <div className="border my-4 rounded-lg shadow-sm p-4 flex gap-4 hover:shadow-md transition">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden border">
        <ProductImage imageUrl={item.imageUrl} name={item.name} />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-blue-900">{item.name}</h3>
          <p className="text-gray-500 text-sm">{item.description}</p>
          <p className="text-gray-400 text-xs mt-1">
            Category: {item.category || "N/A"}
          </p>
          <p className="text-gray-700 text-sm mt-1">
            Price: <strong>${item.price}</strong>
          </p>
          <p
            className={`text-sm mt-1 ${
              item.currentStock <= item.lowStockThreshold
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            Stock: {item.currentStock}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            size="small"
            variant="contained"
            disabled={item.currentStock === 0 || isInCart(item.id)}
            onClick={() => onAdd(item)}
          >
            {isInCart(item.id) ? "In Cart" : item.currentStock === 0 ?"Out of Stock" : "Add to Cart"}
          </Button>

          <Button size="small" variant="outlined" onClick={() => onEdit(item)}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
