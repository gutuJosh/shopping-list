import React, { useState } from "react";

function InputField(props) {
  const [inputValue, setInputValue] = useState("");
  return (
    <>
      <input
        type="text"
        autoFocus={true}
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
    </>
  );
}

export default InputField;
