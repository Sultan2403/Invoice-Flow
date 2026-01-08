import "./App.css";
import Create_Invoice from "./Components/Secondary/Invoice/UI/Creation/createInvoice";
import InvoiceTable from "./Components/Secondary/Invoice/UI/Display/invoiceCard";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import Layout from "./Components/Main/Layout/layout";

import Dashboard from "./Components/Secondary/Dashboard/dashboard";

import DisplayInvoice from "./Components/Secondary/Invoice/UI/Display/invoiceDisplay";
import PreviewInvoice from "./Components/Secondary/Invoice/UI/Templates/preview";

function App() {
  // optional: ensure invoices are loaded on mount
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoices/view" element={<InvoiceTable />} />
          <Route path="invoices/create" element={<Create_Invoice />} />
          <Route path="invoices/view/:invoiceId" element={<DisplayInvoice />} />
          <Route
            path="invoices/view/:invoiceId/pdf-preview"
            element={<PreviewInvoice />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
