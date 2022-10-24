/* global navigator */
import { useEffect, useRef, useState } from "react";

function SaveBtn(props) {
  const element = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [label, setLabel] = useState(
    "Tap for a text note | Tap & hold for a voice note"
  );

  const addAnimation = () => {
    element.current.classList.add("animated");
    setLoaded(true);
  };

  useEffect(() => {
    if (!loaded) {
      element.current.addEventListener("transitionend", addAnimation);
    }
    if (!navigator.onLine) {
      setLabel(false);
    }
  }, []);

  return (
    <footer className="pad-x-20">
      <button {...props} ref={element}>
        <span className="title-default">+ {props.title}</span>
        <span className="title-clicked">Save</span>
        <span className="title-audio-end">
          <svg className="icn">
            <use href="#microphone-icon"></use>
          </svg>
        </span>
      </button>
      {label && <small className="tips">{label}</small>}
    </footer>
  );
}

export default SaveBtn;
