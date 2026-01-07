import { calcLocalTax } from "./calcFinancials";

export function finalizeItemStructure() {
  const data = calcLocalTax({ draftItem });

  const finalDraftItem = {
    ...draftItem,
    ...data,
  };
  return finalDraftItem;
}
