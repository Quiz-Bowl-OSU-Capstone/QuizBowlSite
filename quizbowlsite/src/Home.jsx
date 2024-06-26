import { NavLink, Outlet, useRouteError } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';

export default function App() {

  return (
    <CookiesProvider defaultSetOptions={{path: '/', maxAge: 3600}}>
      <nav className="navbar">
        <NavLink to="/">Quizpedia</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/help">Help</NavLink>
      </nav>
      <main>{<Outlet />}</main>
    </CookiesProvider>
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
