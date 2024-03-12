import { Link, Outlet } from "@remix-run/react";

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>About page</p>
      <nav>
        <Link to="team">Team</Link> | <Link to="history">History</Link>
      </nav>
      <Outlet />
    </div>
  );
}
