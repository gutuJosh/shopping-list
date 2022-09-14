import { useState, useRef } from "react";
let timer;
export default function useLongPress() {
  const [action, setAction] = useState("");
  const isClick = useRef(false);

  function startPressTimer(fn) {
    timer = setTimeout(() => {
      console.log("ref: " + isClick.current);
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
    return fn();
  }

  function handleOnMouseDown(fn) {
    isClick.current = false;
    startPressTimer(fn);
  }

  function handleOnMouseUp(fn) {
    return fn;
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
      handleOnMouseDown,
      handleOnTouchStart,
      handleOnTouchEnd,
    },
  };
}
