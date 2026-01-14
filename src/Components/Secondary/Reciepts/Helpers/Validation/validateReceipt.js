export default function validateReceipt({ paymentMethod, amountPaid }) {
  const errors = {};

  // Validate payment method
  if (!paymentMethod || paymentMethod.trim() === "") {
    errors.paymentMethod = "Please select a payment method";
  }

  return errors;
}
