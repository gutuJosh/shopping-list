import React, { useState } from "react";

function CustomBtn(props) {
  return (
    <div
      {...props}
      title="Tap for a text note | Tap &amp; hold for a voice note"
    >
      <span className="title-default"> + Add new item</span>
      <span className="title-clicked"> Save</span>
      <span className="title-audio-end"> Stop</span>
    </div>
  );
}

export default CustomBtn;
