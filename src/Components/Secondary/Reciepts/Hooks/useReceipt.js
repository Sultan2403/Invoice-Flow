import { useParams } from "react-router-dom";
import { useMemo } from "react";

export default function useReceiptId(receipts) {
  const { receiptId } = useParams();

  const receipt = useMemo(
    () => receipts.find((receipt) => String(receipt.id) === receipt.id),
    [receipts, receiptId]
  );

  return receipt;
}
