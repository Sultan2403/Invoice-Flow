import { Outlet } from "react-router-dom";
import Nav from "../Navigation/nav";

export default function Layout() {
  return (
    <div className="w-screen bg-gray-100 flex">
      <Nav />
      <main className="container mx-auto w-[80%] p-10 flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
}
