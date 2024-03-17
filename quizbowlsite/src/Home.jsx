import { NavLink, Outlet, useRouteError } from "react-router-dom";

export default function App() {
  return (
    <>
      <nav className="navbar">
        <NavLink to="/">Quiz Bowl</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/help">Help</NavLink>
      </nav>
      <main>{<Outlet />}</main>
    </>
  );
}

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <>
      <h1>Error</h1>
      <p>{error.statusText || error.message}</p>
    </>
  );
}
