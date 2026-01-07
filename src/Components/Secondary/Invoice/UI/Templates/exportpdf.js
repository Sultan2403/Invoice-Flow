import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function exportPdf({ invoice, onComplete }) {
  const element = document.getElementById("invoice-template");
  html2canvas(element, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4"); // portrait, points, A4 size
    const pdfWidth = pdf.internal.pageSize.getWidth() - 40; // 20pt margin each side
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);

    pdf.save(`Invoice-${invoice.invoice_name}.pdf`);
    if (onComplete) onComplete();
  });
}
