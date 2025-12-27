import "./App.css";
import Create_Invoice from "./Components/Invoice/createInvoice";
import InvoiceTable from "./Components/Invoice/invoiceCard";

function App() {
  return (
    <>
      <Create_Invoice />
      <InvoiceTable invoice={JSON.parse(localStorage.getItem("invoices"))} />
    </>
  );
}

export default App;
