import { useState, useRef } from "react";

export default function useLongPress(delay = 1000) {
  const [action, setAction] = useState("");
  const isClick = useRef(false);
  let timer = null;

  function startPressTimer(fn) {
    timer = setTimeout(() => {
      //spech api can be used only when user is online
      if (
        navigator.onLine &&
        (window.SpeechRecognition || window.webkitSpeechRecognition)
      ) {
        if (!isClick.current) {
          setAction("longpress");
          fn();
        }
      }
    }, delay);
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

  function handleOnTouchStart(fn) {
    isClick.current = false;
    startPressTimer(fn);
  }

  return {
    action,
    setAction,
    handlers: {
      handleOnClick,
      handleOnMouseDown,
      handleOnTouchStart,
    },
  };
}
