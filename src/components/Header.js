import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../logo.png";
function Header(props) {
  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //console.log(location);
  }, []);

  return (
    <>
      <header className="menu-container pad-x-20">
        <nav className="main-nav">
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
            <li className="flex-item auto txt-center">
              <img
                src={logo}
                width="48"
                height="48"
                alt="logo"
                longdesc="shopping list"
                className="logo"
              />
            </li>
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
