import { Button } from "@mui/material";
import ProductImage from "../../../UI/Inventory/productImage";

export default function Inventory_Card({
  item,
  onAdd,
  onEdit,
  isInCart,
  itemInCart,
}) {
  const inCart = isInCart(item.id);

  const cartItem = itemInCart(item.id);

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
            className={`text-sm mt-1 ${item.currentStock <= item.lowStockThreshold ? "text-red-500" : "text-gray-500"}`}
          >
            {inCart ? "Initial Stock" : "Current Stock"}: {item.currentStock}
          </p>
          {inCart && (
            <p className="text-sm text-blue-700">
              Quantity in Cart: {cartItem?.quantity}
            </p>
          )}
          {inCart && (
            <p className="text-sm text-gray-500">
              Remaining Stock: {item.currentStock - cartItem?.quantity}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            size="small"
            variant="contained"
            disabled={item.currentStock === 0 || inCart}
            onClick={() => onAdd(item)}
          >
            {inCart
              ? "In Cart"
              : item.currentStock === 0
                ? "Out of Stock"
                : "Add to Cart"}
          </Button>
          {/* 
          <Button size="small" variant="outlined" onClick={() => onEdit(item)}>
            Edit
          </Button> */}
        </div>
      </div>
    </div>
  );
}
