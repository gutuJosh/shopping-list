/* global navigator */
import { useEffect, useState } from "react";

function SaveBtn(props) {
  const [label, setLabel] = useState(props.tip);

  useEffect(() => {
    if (!navigator.onLine) {
      setLabel(false);
    }
  }, []);

  return (
    <footer className="pad-x-20">
      <button {...props}>
        <span className="title-default">+ {props.title}</span>
        <span className="title-clicked">{props.btnlabel}</span>
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
