import { Outlet } from "react-router-dom";
import Nav from "../Navigation/nav";

export default function Layout() {
  return (
    <div className="w-screen bg-gray-100 min-h-screen">
      <Nav />
      <main
        role="main"
        className="sm:ml-56 ml-0 p-8 flex justify-center overflow-y-auto items-start min-h-screen"
      >
        <div className="w-full max-w-5xl px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
