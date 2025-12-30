import "./App.css";
import Create_Invoice from "./Components/Secondary/Invoice/createInvoice";
import InvoiceTable from "./Components/Secondary/Invoice/invoiceCard";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Components/Main/Layout/layout";
import { getInvoices } from "./Utils/helpers";
import Dashboard from "./Components/Secondary/Dashboard/dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route
              path="invoices"
              element={<InvoiceTable invoice={getInvoices()} />}
            />
            <Route path="create-invoice" element={<Create_Invoice />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
