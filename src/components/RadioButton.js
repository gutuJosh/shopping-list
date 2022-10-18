import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContextProvider";
import { useNavigate } from "react-router-dom";

function RadioButton(props) {
  const [state, dispatch] = useContext(AppContext);
  let navigate = useNavigate();
  const [btnState, setBtnState] = useState(false);

  useEffect(() => {
    if (props.status === 1) {
      setBtnState(true);
    } else {
      setBtnState(false);
    }
  }, [props]);

  return (
    <div className="flex-item auto">
      <label
        htmlFor={`radio_${props.id}`}
        className="custom-check"
        onClick={() => {
          dispatch({
            type: "SELECT_LIST",
            payload: props,
          });
          navigate(
            `/edit-list/${encodeURIComponent(props.name.toLowerCase())}`
          );
        }}
      >
        <input
          type="radio"
          value={props.name}
          id={`radio_${props.id}`}
          checked={btnState}
          onChange={(e) => {
            e.stopPropagation();
            setBtnState(btnState ? false : true);
          }}
        />
        <span className="txt">
          {props.name.trim()} ({props.records}) items
        </span>
        <span className="checkmark"></span>
      </label>
    </div>
  );
}

export default RadioButton;
