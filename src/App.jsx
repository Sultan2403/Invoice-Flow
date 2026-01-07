import "./App.css";
import Create_Invoice from "./Components/Secondary/Invoice/UI/Creation/createInvoice";
import InvoiceTable from "./Components/Secondary/Invoice/UI/Creation/invoiceCard";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import Layout from "./Components/Main/Layout/layout";
import { getInvoices } from "./Utils/helpers";
import Dashboard from "./Components/Secondary/Dashboard/dashboard";
import { useEffect, useState } from "react";
import InvoiceTemplate from "./Components/Secondary/Invoice/UI/Templates/invoiceTemplate";
import DisplayInvoice from "./Components/Secondary/Invoice/UI/Display/invoiceDisplay";
import PreviewInvoice from "./Components/Secondary/Invoice/UI/Templates/preview";

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
            element={<DisplayInvoice invoices={invoices} />}
          />
          <Route
            path="invoices/view/:invoiceId/pdf-preview"
            element={<PreviewInvoice invoices={invoices} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
