import React from "react";

function CheckBox(props) {
  return (
    <>
      <input
        type="checkbox"
        value={props.name}
        defaultChecked={props.status === 1 ? true : false}
        id={`box_${props.index}`}
        onChange={(e) => {
          const obj = props.handleValue();
          const items = obj.items;
          items.forEach((element) => {
            if (element.name === props.name) {
              element.status = e.target.checked ? 1 : 0;
            }
          });
          obj.updateItems(items);
          obj.updateTable(props.name, {
            id: props.id,
            name: props.name,
            qty: props.qty,
            price: props.price,
            status: e.target.checked ? 1 : 0,
          });
        }}
      />
      <label htmlFor={`box_${props.index}`}>{props.name.trim()}</label>
    </>
  );
}

export default CheckBox;
