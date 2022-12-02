import { useState, useEffect, useRef } from "react";
import formatNumeric from "../helpers/FormatNumeric";

let delay;
function NewItemForm(props) {
  const [inputValue, setInputValue] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const element = useRef(null);
  const checksign = useRef(null);
  const t = props.translator;

  const saveNewItem = () => {
    clearTimeout(delay);
    if (inputValue === "") {
      return;
    }
    if (props.page === "home") {
      const value = inputValue;
      props.handleInputValue(value);
    } else {
      if (qty === "" && price === "") {
        props.handleInputValue(inputValue);
      } else {
        props.handleInputValue({
          name: inputValue,
          qty: qty,
          price: price,
        });
        setQty("");
        setPrice("");
      }
    }
    setInputValue("");
    checksign.current.classList.add("show");
    setTimeout(() => checksign.current.classList.remove("show"), 1500);
  };

  useEffect(() => {
    setTimeout(() => element.current.classList.add("active"), 300);
  }, []);
  return (
    <div className="new-item-container pad20" ref={element}>
      <form className={props.page === "home" ? "flex" : "flex flex-column"}>
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
            setTimeout(() => {
              props.handleSaveBtn();
            }, 300);
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
          <svg className="icn checksign-icon" ref={checksign}>
            <use href="#checksign-icon"></use>
          </svg>
        </div>
        {props.page === "home" ? (
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
        ) : (
          <div className="flex-item flex mtop10">
            <div className="flex-item auto pad-y-5">
              <input
                type="text"
                placeholder={t("Items number")}
                value={qty}
                inputMode="numeric"
                name="itemQty"
                onChange={(e) => {
                  setQty(formatNumeric(e.target.value));
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    props.captureValue(false);
                    saveNewItem();
                  }
                }}
              />
            </div>
            <div className="flex-item auto pad-x-20 pad-y-5">
              <input
                type="text"
                value={price}
                inputMode="numeric"
                placeholder={t("Price per item")}
                name="itemPrice"
                onChange={(e) => {
                  setPrice(formatNumeric(e.target.value));
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    props.captureValue(false);
                    saveNewItem();
                  }
                }}
              />
            </div>
            <div className="pad-y-10 mtop5">
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
        )}
      </form>
    </div>
  );
}

export default NewItemForm;
