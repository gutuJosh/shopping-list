import React, { useState, useEffect } from "react";

function CheckBox(props) {
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
      <label htmlFor={`box_${props.index}`} className="custom-check">
        <input
          type="checkbox"
          value={props.name}
          checked={btnState}
          id={`box_${props.index}`}
          onChange={(e) => {
            e.stopPropagation();
            setBtnState(btnState ? false : true);
            const obj = props.handleValue();
            const items = obj.items;
            items.forEach((element) => {
              if (element.name === props.name) {
                element.status = e.target.checked ? 1 : 0;
              }
            });

            obj.updateTable(props.name, {
              id: props.id,
              name: props.name,
              qty: props.qty,
              price: props.price,
              status: e.target.checked ? 1 : 0,
            });
          }}
        />
        <span className="txt">{props.name.trim()}</span>
        <span className="checkmark"></span>
      </label>
    </div>
  );
}

export default CheckBox;
