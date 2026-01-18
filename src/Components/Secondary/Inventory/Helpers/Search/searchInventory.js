export default function searchInventory({
  inventory,
  searchTerm,
  searchBy = "name",
}) {
  if (!searchTerm) return inventory;
  return inventory.filter((item) =>
    String(item[searchBy]).toLowerCase().includes(searchTerm.toLowerCase()),
  );
}
