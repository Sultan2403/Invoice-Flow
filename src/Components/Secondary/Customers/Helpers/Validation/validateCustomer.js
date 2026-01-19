export default function validateCustomer(customer) {
  const errors = {};
  if (!customer.name || customer.name.trim() === "") {
    errors.name = "Name is required";
  }
  if (!customer.email || customer.email.trim() === "") {
    errors.email = "Email is required";
  }
  if (!customer.phone || customer.phone.trim() === "") {
    errors.phone = "Phone is required";
  }
  return errors;
}
