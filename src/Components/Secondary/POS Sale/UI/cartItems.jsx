import { Button } from "@mui/material";
import ProductImage from "../../../UI/Inventory/productImage";
import { currencyFormatter } from "../../../../Utils/helpers";

export default function Cart_Items({ cartItems = [], onEdit, onRemove }) {
  // Compute grand total
  const grandTotal = cartItems.reduce((acc, item) => acc + item.total, 0);

  if (cartItems.length === 0) {
    return <p className="text-gray-500 text-sm">Cart is empty.</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 p-3 border rounded-lg shadow-sm hover:shadow-md transition"
        >
          {/* Optional Product Image */}
          <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden border">
            <ProductImage imageUrl={item.imageUrl} name={item.name} />
          </div>

          {/* Item Details */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500">
              Unit Price: {currencyFormatter.format(item.unitPrice)}
            </p>
            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            <p className="text-sm text-gray-500">
              Tax:{" "}
              {item.applyTax ? `${(item.taxRate * 100).toFixed(2)}%` : "None"}
            </p>
            <p className="text-sm font-medium">
              Subtotal: {currencyFormatter.format(item.subtotal)}
            </p>
            <p className="text-sm font-bold">
              Total: {currencyFormatter.format(item.total)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-1">
           
              <Button
                variant="outlined"
                size="small"
                onClick={() => onEdit(item)}
              >
                Edit
              </Button>
   
           
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onRemove(item)}
              >
                Remove
              </Button>
    
          </div>
        </div>
      ))}

      {/* Grand Total */}
      <div className="flex justify-end mt-4 p-2 border-t border-gray-200">
        <p className="text-lg font-bold">
          Grand Total: {currencyFormatter.format(grandTotal)}
        </p>
      </div>
    </div>
  );
}
