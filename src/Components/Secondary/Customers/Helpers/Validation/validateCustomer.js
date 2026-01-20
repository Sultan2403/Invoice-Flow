import isEmail from "validator/lib/isEmail";
import { isValidPhoneNumber } from "react-phone-number-input";

export default function validateCustomer(customer) {
  const errors = {};

  if (!customer.name?.trim()) {
    errors.name = "Name is required";
  } else if (customer.name.trim().length < 3) {
    errors.name = "Name must be at least three characters";
  }

  if (!customer.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isEmail(customer.email)) {
    errors.email = "Invalid email address";
  }

  if (customer.phone && !isValidPhoneNumber(customer.phone)) {
    errors.phone = "Invalid phone number";
  }

  if (customer.address && customer.address.trim().length < 3) {
    errors.address = "An address must be at least three characters";
  }

  return errors;
}
