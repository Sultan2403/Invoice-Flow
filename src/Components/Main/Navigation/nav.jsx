import {
  FilesIcon,
  HomeIcon,
  PlusIcon,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Nav() {
  const [open, setOpen] = useState(() => {
    try {
      const raw = localStorage.getItem("navOpen");
      return raw === null ? true : raw === "1";
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("navOpen", open ? "1" : "0");
    } catch (e) {
      // ignore
    }
  }, [open]);

  return (
    <aside
      aria-label="Main navigation"
      className={`fixed left-0 top-0 h-screen z-40 bg-gradient-to-b from-sky-600 to-sky-700 text-white flex flex-col p-4 shadow-lg transition-all duration-200 ${
        open ? "w-56" : "w-22"
      }`}
    >
      {/* Logo / App Name */}
      <div className="mb-6 flex items-center justify-between ">
        <NavLink
          to="/"
          className="flex items-center gap-4"
          aria-label="Go to dashboard"
        >
          <div
            className={`w-12 h-12 bg-white/10 rounded flex items-center justify-center text-2xl font-bold`}
            title="Invoice Flow"
          >
            IF
          </div>
          <div className={`${open ? "block" : "hidden"}`}>
            <div className="text-2xl font-bold leading-4">Invoice Flow</div>
            <div className="text-xs text-white/90">Manage your invoices</div>
          </div>
        </NavLink>

        <button
          onClick={() => setOpen((s) => !s)}
          aria-label={open ? "Collapse navigation" : "Expand navigation"}
          aria-expanded={open}
          title={open ? "Collapse" : "Expand"}
          className="p-1 rounded hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1" aria-label="Primary navigation">
        <ul className="flex flex-col gap-2" role="menu">
          <li>
            <NavLink
              to="/"
              end
              role="menuitem"
              className={({ isActive }) =>
                isActive
                  ? `flex items-center gap-3 px-3 py-2 bg-white/10 rounded-md font-semibold ${
                      open ? "" : "justify-center"
                    }`
                  : `flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-md transition ${
                      open ? "" : "justify-center"
                    }`
              }
            >
              <span className="text-lg" aria-hidden>
                <HomeIcon />
              </span>
              <span className={`${open ? "" : "hidden"}`}>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="invoices/view"
              role="menuitem"
              className={({ isActive }) =>
                isActive
                  ? `flex items-center gap-3 px-3 py-2 bg-white/10 rounded-md font-semibold ${
                      open ? "" : "justify-center"
                    }`
                  : `flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-md transition ${
                      open ? "" : "justify-center"
                    }`
              }
            >
              <span className="text-lg" aria-hidden>
                <FilesIcon />
              </span>
              <span className={`${open ? "" : "hidden"}`}>Invoices</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="invoices/create"
              role="menuitem"
              className={({ isActive }) =>
                isActive
                  ? `flex items-center gap-3 px-3 py-2 bg-white/10 rounded-md font-semibold ${
                      open ? "" : "justify-center"
                    }`
                  : `flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-md transition ${
                      open ? "" : "justify-center"
                    }`
              }
            >
              <span className="text-lg" aria-hidden>
                <PlusIcon />
              </span>
              <span className={`${open ? "" : "hidden"}`}>Create Invoice</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="receipts"
              role="menuitem"
              className={({ isActive }) =>
                isActive
                  ? `flex items-center gap-3 px-3 py-2 bg-white/10 rounded-md font-semibold ${
                      open ? "" : "justify-center"
                    }`
                  : `flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-md transition ${
                      open ? "" : "justify-center"
                    }`
              }
            >
              <span className="text-lg" aria-hidden>
                <ReceiptText />
              </span>
              <span className={`${open ? "" : "hidden"}`}>Reciepts</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className={`mt-auto pt-6 ${open ? "" : "px-2"}`}>
        <div className={`${open ? "text-xs text-white/80 mb-2" : "hidden"}`}>
          Account
        </div>
        <button
          className={`w-full bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm transition ${
            open ? "text-sm" : "p-2"
          }`}
          aria-label="Sign out"
        >
          <span className={`${open ? "" : "sr-only"}`}>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
