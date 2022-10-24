import React, { useState } from "react";

function FilterBtns(props) {
  const [active, setActive] = useState(0);
  const t = props.translator;

  const handleOnClick = (e) => {
    e.preventDefault();
    const data = Number(e.target.dataset.key);
    setActive(data);
    props.handleClick(data);
  };

  return (
    <nav className="filters-container mtop20 pad-x-20">
      <button
        onClick={handleOnClick}
        data-key="0"
        disabled={active === 0 ? true : false}
        className="pad-x-10"
      >
        {t("All")}
      </button>
      <button
        onClick={handleOnClick}
        data-key="1"
        disabled={active === 1 ? true : false}
        className="pad-x-10 inline-block"
      >
        {t("Completed")}
      </button>
      <button
        onClick={handleOnClick}
        data-key="2"
        disabled={active === 2 ? true : false}
        className="pad-x-10"
      >
        {t("Uncompleted")}
      </button>
    </nav>
  );
}

export default FilterBtns;
