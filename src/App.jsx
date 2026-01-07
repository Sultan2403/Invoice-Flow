import "./App.css";
import Create_Invoice from "./Components/Secondary/Invoice/UI/Creation/createInvoice";
import InvoiceTable from "./Components/Secondary/Invoice/UI/Creation/invoiceCard";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import Layout from "./Components/Main/Layout/layout";
import { getInvoices } from "./Utils/helpers";
import Dashboard from "./Components/Secondary/Dashboard/dashboard";
import { useEffect, useState } from "react";
import InvoiceTemplate from "./Components/Secondary/Invoice/UI/Templates/invoiceTemplate";

function App() {
  const [invoices, setInvoices] = useState(getInvoices([]));

  // optional: ensure invoices are loaded on mount
  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="invoices/view"
            element={
              <InvoiceTable
                invoices={invoices}
                onInvoiceCreation={() => setInvoices(getInvoices())}
              />
            }
          />
          <Route path="invoices/create" element={<Create_Invoice />} />
          <Route
            path="invoices/view/:invoiceId"
            element={<InvoiceTemplate invoices={invoices} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
