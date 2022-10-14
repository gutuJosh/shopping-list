import React, { useContext } from "react";
import { AppContext } from "../context/AppContextProvider";
import { useNavigate } from "react-router-dom";

function RadioButton(props) {
  const [state, dispatch] = useContext(AppContext);

  let navigate = useNavigate();

  return (
    <>
      <input
        type="radio"
        value={props.name}
        id={`radio_${props.id}`}
        onChange={(e) => {
          e.stopPropagation();
          if (e.target.checked) {
            dispatch({
              type: "SELECT_LIST",
              payload: props,
            });
            navigate(
              `/edit-list/${encodeURIComponent(props.name.toLowerCase())}`
            );
          }
        }}
      />
      <label htmlFor={`radio_${props.id}`}>
        {props.name.trim()} ({props.records}) items
      </label>
    </>
  );
}

export default RadioButton;
