export default function calcDueDate(invoice) {
  // Calculate days until due

  const today = new Date();
  const due = new Date(invoice.dueDate);
  const diffTime = due - today;
  const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine due badge
  let dueBadge = { text: `Due in ${daysUntilDue} day(s)`, color: "success" };
  if (daysUntilDue <= 3) dueBadge.color = "error";
  else if (daysUntilDue <= 5) {
    dueBadge.color = "warning";
  }

  return { daysUntilDue, dueBadge };
}
