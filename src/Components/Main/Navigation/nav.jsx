import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="w-64 h-screen bg-blue-600 text-white flex flex-col p-6">
      {/* Logo / App Name */}
      <NavLink to="/" className="text-2xl font-bold mb-8">
        Invoice Flow
      </NavLink>

      {/* Links */}
      <ul className="flex flex-col gap-4">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "opacity-90"
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "opacity-90"
            }
          >
            Invoices
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/create-invoice"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "opacity-90"
            }
          >
            Create Invoice
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
