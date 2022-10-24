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
            props.handleSaveBtn();
          }}
        >
          <svg className="icn">
            <use href="#close-icon"></use>
          </svg>
        </a>

        <div className="flex-item auto">
          <input
            type="text"
            autoFocus={true}
            autoComplete="off"
            value={inputValue}
            placeholder={props.placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={(e) => {
              delay = setTimeout(() => {
                props.handleInputValue(inputValue);
                setInputValue("");
              }, 300);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                saveNewItem();
              }
            }}
          />
        </div>
        <div className="pad10 pad-x-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              saveNewItem();
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputField;
