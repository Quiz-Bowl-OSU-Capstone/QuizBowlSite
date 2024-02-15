import { NavLink, Outlet, useRouteError } from "react-router-dom";

export function Home() {
  return (
    <>
      <h1>QuizBowl DataBase</h1>
    </>
  );
}

export function About() {
  return <h1>About 4-H Extension</h1>;
}

export function Contact() {
  return <h1>Contact us at..</h1>;
}

export function Help() {
  return <h1>Help Instructions</h1>;
}

export function Login() {
  return (
    <>
      <div className="dialog">
        <form>
          <label>
            Username:
            <input type="text" placeholder="Enter Username/Email" />
          </label>
          <br />
          <label>
            Password:
            <input type="text" placeholder="Enter Password" />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <nav className="navbar">
        <NavLink to="/">Quizbowl</NavLink>
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
