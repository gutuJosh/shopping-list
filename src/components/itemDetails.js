import React, { useState } from "react";

function ItemDetails(props) {
  const [qty, setQty] = useState(props.data.qty);
  const [price, setPrice] = useState(props.data.price);
  return (
    <div className="item-details">
      <label>
        Quantity:
        <input
          type="number"
          value={qty}
          onChange={(e) => {
            setQty(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          readOnly={props.data.status === 1}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          readOnly={props.data.status === 1}
        />
      </label>
      <button
        onClick={(e) => {
          props.update(props.data.name, {
            id: props.data.id,
            name: props.data.name,
            qty: qty,
            price: price,
            status: props.data.status,
          });
          setTimeout(
            () => e.target.parentNode.closest("li").classList.remove("active"),
            300
          );
        }}
      >
        Ok
      </button>
    </div>
  );
}

export default ItemDetails;
