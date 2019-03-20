import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="nav-wrapper grey darken-3">
      <div className="container">
        <Link to="/" className="brand-logo">
          Goodreads App
        </Link>
        <ul className="right">
          <li>
            <NavLink className="nav-item nav-link" to="/search">
              Search Books
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
