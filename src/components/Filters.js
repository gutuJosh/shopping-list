import React, { useContext } from "react";
import { AppContext } from "../context/AppContextProvider";

function Filters(props) {
  const [state, dispatch] = useContext(AppContext);

  const handleOnClick = (e) => {
    e.preventDefault();
    if (props.name === "list-items") {
      props.handleClick(Number(e.target.dataset.key));
    } else {
      dispatch({
        type: "CHANGE_LIST_STATUS",
        payload: Number(e.target.dataset.key),
      });
    }
  };

  return (
    <nav>
      <button onClick={handleOnClick} data-key="0">
        All
      </button>
      <button onClick={handleOnClick} data-key="1">
        Completed
      </button>
      <button onClick={handleOnClick} data-key="2">
        Uncompleted
      </button>
    </nav>
  );
}

export default Filters;
