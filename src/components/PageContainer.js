import React from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import Header from "./Header";

const PageContainer = (
  WrappedComponent,
  keyProp,
  inProp,
  callback,
  handleMenu
) => {
  return (
    <SwitchTransition mode="in-out">
      <CSSTransition
        key={keyProp}
        in={inProp}
        timeout={300}
        classNames="page"
        unmountOnExit
        onExiting={callback}
      >
        <div className="page">
          <Header handleActive={handleMenu} />
          <WrappedComponent />
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default PageContainer;
