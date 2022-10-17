import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Header(props) {
  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, []);

  return (
    <>
      <header className="menu-container pad20">
        <nav className="nav">
          <ul className="flex">
            <li>
              {location.pathname !== "/" && (
                <a
                  title="Back"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    props.handleActive("home");
                    navigate(`/`);
                  }}
                >
                  <svg className="icn">
                    <use href="#arrow-left-icon"></use>
                  </svg>
                </a>
              )}
            </li>
            <li className="flex-item auto txt-center">Shopping list</li>
            <li>
              <a
                title="Settings"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  props.handleActive("settings");
                  navigate(`/settings`);
                }}
              >
                <svg className="icn">
                  <use href="#gear-icon"></use>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
