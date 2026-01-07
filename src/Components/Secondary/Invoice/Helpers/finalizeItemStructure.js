import { calcLocalTax } from "./calcFinancials";

export function finalizeItemStructure({ draftItem }) {
  const data = calcLocalTax({ draftItem });

  const finalDraftItem = {
    ...draftItem,
    ...data,
  };
  return finalDraftItem;
}
