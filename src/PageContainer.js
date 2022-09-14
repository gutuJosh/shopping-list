import React from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const PageContainer = (WrappedComponent, keyProp, inProp, callback) => {
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
          <WrappedComponent />
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default PageContainer;
