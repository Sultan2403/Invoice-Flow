import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const exportPdf = async ({ invoice, onComplete }) => {
  const element = document.getElementById("invoice-preview"); // wrap InvoiceTemplate with this id
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  if (imgHeight <= pdfHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
  } else {
    let heightLeft = imgHeight;
    let position = 0;
    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
      if (heightLeft > 0) pdf.addPage();
      position -= pdfHeight;
    }
  }

  pdf.save(`${invoice.name}.pdf`);
  onComplete();
};

export default exportPdf;
