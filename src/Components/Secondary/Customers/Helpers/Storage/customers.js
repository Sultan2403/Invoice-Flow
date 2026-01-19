const CUSTOMER_KEY = "customers";
export function getCustomers() {
  return JSON.parse(localStorage.getItem(CUSTOMER_KEY)) || [];
}

export function saveCustomers(customers) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
}

export function addNewCustomer(customer) {
  const customers = getCustomers();
  const updated = [...customers, customer];
  saveCustomers(updated);
}

export function deleteCustomer(customer) {
  const customers = getCustomers();
  const updated = customers.filter((c) => c.id !== customer.id);
  saveCustomers(updated);
}

export function updateCustomer(customer) {
  const customers = getCustomers();
  const updated = customers.map((c) => (c.id === customer.id ? customer : c));
  saveCustomers(updated);
}
