import { Outlet } from "react-router-dom";
import Nav from "../Navigation/nav";

export default function Layout() {
  return (
    <div className="w-screen bg-gray-100 flex min-h-screen">
      <Nav />
      <main className="flex-1 p-10 flex justify-center overflow-y-auto items-center">
        <Outlet />
      </main>
    </div>
  );
}
