import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/AppContextProvider";
import Header from "./components/Header";
import Home from "./pages/Home";
import List from "./pages/List";
import Settings from "./pages/Settings";
import PageContainer from "./PageContainer";
import "./App.css";

function App() {
  const [activeComponent, setActiveComponent] = useState("home");
  const [currentComponent, setCurrentComponent] = useState("home");

  return (
    <BrowserRouter>
      <div className="App">
        <div className="nav">
          <Header handleActive={setCurrentComponent} />
        </div>
        <div className="container">
          <AppContextProvider>
            <Routes>
              <Route
                path="/"
                element={PageContainer(
                  Home,
                  "home",
                  activeComponent === "home" ? true : false,
                  () => setActiveComponent(currentComponent)
                )}
              />
              <Route
                path="/edit-list/:listName"
                element={PageContainer(
                  List,
                  "list",
                  activeComponent === "list" ? true : false,
                  () => setActiveComponent(currentComponent)
                )}
              />
              <Route
                path="/settings"
                element={PageContainer(
                  Settings,
                  "settings",
                  activeComponent === "settings" ? true : false,
                  () => setActiveComponent(currentComponent)
                )}
              />
            </Routes>
          </AppContextProvider>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
