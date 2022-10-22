import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/AppContextProvider";
import Home from "./pages/Home";
import List from "./pages/List";
import Settings from "./pages/Settings";
import PageContainer from "./PageContainer";
import "./App.css";

function App() {
  const [activeComponent, setActiveComponent] = useState("home");
  const [currentComponent, setCurrentComponent] = useState("home");

  const handleMenu = (pageName) => setCurrentComponent(pageName);

  useEffect(() => {
    //handle theme mode
    window.addEventListener(
      "load",
      () => {
        if (localStorage["theme"]) {
          document.querySelector("body").classList.add(localStorage["theme"]);
        }
      },
      false
    );
  }, []);

  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route
            path="/"
            element={PageContainer(
              Home,
              "home",
              activeComponent === "home" ? true : false,
              () => setActiveComponent(currentComponent),
              handleMenu
            )}
          />
          <Route
            path="/edit-list/:listName"
            element={PageContainer(
              List,
              "list",
              activeComponent === "list" ? true : false,
              () => setActiveComponent(currentComponent),
              handleMenu
            )}
          />
          <Route
            path="/settings"
            element={PageContainer(
              Settings,
              "settings",
              activeComponent === "settings" ? true : false,
              () => setActiveComponent(currentComponent),
              handleMenu
            )}
          />
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
