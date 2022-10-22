import React, { useState, useEffect, useRef } from "react";

function InputField(props) {
  const [inputValue, setInputValue] = useState("");
  const element = useRef(null);
  useEffect(() => {
    setTimeout(() => element.current.classList.add("active"), 300);
  }, []);
  return (
    <div className="new-item-container pad20" ref={element}>
      <input
        type="text"
        autoFocus={true}
        autoComplete="off"
        value={inputValue}
        placeholder={props.placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={(e) => {
          props.handleInputValue(inputValue);
          setInputValue("");
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            props.handleInputValue(inputValue);
            setInputValue("");
          }
        }}
      />
    </div>
  );
}

export default InputField;
