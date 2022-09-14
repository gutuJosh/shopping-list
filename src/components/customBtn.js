import React, { useState } from "react";

function CustomBtn(props) {
  return (
    <div
      {...props}
      title="Tap for a text note | Tap &amp; hold for a voice note"
    >
      <span>Add new item</span>
    </div>
  );
}

export default CustomBtn;
