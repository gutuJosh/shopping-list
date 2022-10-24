import React, { useState, useEffect } from "react";

function SwitchBtn(props) {
  const [inputValue, setInputValue] = useState(false);
  const t = props.translator;
  useEffect(() => {
    setInputValue(navigator.onLine ? props.permission : false);
  }, [props]);

  return (
    <>
      <input
        type="checkbox"
        value={inputValue}
        checked={inputValue ? true : false}
        className="switch"
        id={props.id}
        onChange={(e) => {
          e.stopPropagation();
          props.handlePermission();
          if (!e.target.checked) {
            alert(t("Microphone permission already given!"));
          }
        }}
      />
      <label htmlFor={props.id}>&nbsp;</label>
    </>
  );
}

export default SwitchBtn;
