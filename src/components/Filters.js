import React, { useState } from "react";

function Filters(props) {
  const [active, setActive] = useState(0);

  const handleOnClick = (e) => {
    e.preventDefault();
    const data = Number(e.target.dataset.key);
    setActive(data);
    props.handleClick(data);
  };

  return (
    <nav>
      <button
        onClick={handleOnClick}
        data-key="0"
        disabled={active === 0 ? true : false}
      >
        All
      </button>
      <button
        onClick={handleOnClick}
        data-key="1"
        disabled={active === 1 ? true : false}
      >
        Completed
      </button>
      <button
        onClick={handleOnClick}
        data-key="2"
        disabled={active === 2 ? true : false}
      >
        Uncompleted
      </button>
    </nav>
  );
}

export default Filters;
