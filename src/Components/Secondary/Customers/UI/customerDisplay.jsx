import { getCustomers } from "../Helpers/Storage/customers";

export default function Customer_Display() {
  const customers = getCustomers();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))
      )}
    </div>
  );
}
