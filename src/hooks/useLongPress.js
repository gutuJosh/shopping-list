import { useState, useRef } from "react";

export default function useLongPress() {
  const [action, setAction] = useState("");
  const isClick = useRef(false);
  let timer = null;

  function startPressTimer(fn) {
    timer = setTimeout(() => {
      if (!isClick.current) {
        setAction("longpress");
        fn();
      }
    }, 1000);
  }

  function handleOnClick(fn) {
    if (action === "longpress") {
      return;
    }
    setAction("click");
    isClick.current = true;
    clearTimeout(timer);
    return fn();
  }

  function handleOnMouseDown(fn) {
    isClick.current = false;
    startPressTimer(fn);
  }

  function handleOnMouseUp(fn) {
    return fn();
  }

  function handleOnTouchStart(fn) {
    isClick.current = false;
    startPressTimer(fn);
  }

  function handleOnTouchEnd(fn) {
    return fn;
  }

  return {
    action,
    setAction,
    handlers: {
      handleOnClick,
      handleOnMouseDown,
      handleOnMouseUp,
      handleOnTouchStart,
      handleOnTouchEnd,
    },
  };
}
