export default function CustomerCard({ customer }) {
  return (
    <div className="border p-4 rounded shadow-sm mb-4">
      <h2 className="text-xl font-semibold mb-2">{customer.name}</h2>
      <p className="text-sm text-gray-600 mb-1">Email: {customer.email}</p>
      <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
    </div>
  );
}
