import { useState, useEffect, useRef } from "react";
let delay;
function InputField(props) {
  const [inputValue, setInputValue] = useState("");
  const element = useRef(null);

  useEffect(() => {
    setTimeout(() => element.current.classList.add("active"), 300);
  }, []);
  return (
    <div className="new-item-container pad20 flex" ref={element}>
      <div className="flex-item auto">
        <input
          type="text"
          autoFocus={true}
          autoComplete="off"
          value={inputValue}
          placeholder={props.placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={(e) => {
            delay = setTimeout(() => props.handleInputValue(inputValue), 300);
            setInputValue("");
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              clearTimeout(delay);
              props.handleInputValue(inputValue);
              setInputValue("");
            }
          }}
        />
      </div>
      <div className="pad10 pad-x-10">
        <a
          href="#"
          title="Delete"
          onClick={(e) => {
            e.preventDefault();
            clearTimeout(delay);
            setInputValue("");
            props.handleSaveBtn();
          }}
        >
          <svg className="icnx2 close-icn">
            <use href="#close-icon"></use>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default InputField;
