import { useState, useEffect, useRef } from "react";
let delay;
function InputField(props) {
  const [inputValue, setInputValue] = useState("");
  const element = useRef(null);

  const saveNewItem = () => {
    clearTimeout(delay);
    props.handleInputValue(inputValue);
    setInputValue("");
  };

  useEffect(() => {
    setTimeout(() => element.current.classList.add("active"), 300);
  }, []);
  return (
    <div className="new-item-container pad20" ref={element}>
      <div className="flex">
        <a
          className="close-icon"
          href="#"
          title="Delete"
          onClick={(e) => {
            e.preventDefault();
            clearTimeout(delay);
            setInputValue("");
            props.captureValue(false);
            element.current.classList.remove("active");
            setTimeout(() => props.handleSaveBtn(), 300);
          }}
        >
          <svg className="icn">
            <use href="#close-icon"></use>
          </svg>
        </a>

        <div className="flex-item auto">
          <input
            id="new-item-field"
            type="text"
            autoFocus={true}
            autoComplete="off"
            value={inputValue}
            placeholder={props.placeholder}
            onChange={(e) => {
              setInputValue(e.target.value);
              props.captureValue(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                props.captureValue(false);
                saveNewItem();
              }
            }}
          />
        </div>
        <div className="pad10 pad-x-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              props.captureValue(false);
              saveNewItem();
              document.querySelector("#new-item-field").focus();
            }}
          >
            {props.btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputField;
