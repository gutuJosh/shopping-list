import React from "react";

function CustomBtn(props) {
  const lable = navigator.onLine
    ? `Tap for a text note | Tap &amp; hold for a voice note`
    : `Tap for a text note`;
  return (
    <div {...props} title={lable}>
      <span className="title-default"> + {props.title}</span>
      <span className="title-clicked"> Save</span>
      <span className="title-audio-end"> Stop</span>
    </div>
  );
}

export default CustomBtn;
