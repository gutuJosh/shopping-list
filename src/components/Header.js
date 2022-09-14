import React from "react";
import { useNavigate } from "react-router-dom";

function Header(props) {
  let navigate = useNavigate();

  return (
    <>
      <header className="mx-auto">
        <ul>
          <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                props.handleActive("home");
                navigate(`/`);
              }}
            >
              Home page
            </a>
          </li>

          <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                props.handleActive("list");
                navigate(`/settings`);
              }}
            >
              Settings
            </a>
          </li>
        </ul>
      </header>
    </>
  );
}

export default Header;
