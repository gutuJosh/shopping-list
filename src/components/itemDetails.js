import React, { useState, useEffect } from "react";

function ItemDetails(props) {
  const [qty, setQty] = useState();
  const [price, setPrice] = useState();

  useEffect(() => {
    setQty(props.data.qty);
    setPrice(props.data.price);
  }, [props.data]);

  return (
    <div className="item-details">
      <label>
        Quantity:
        <input
          type="number"
          value={qty}
          onChange={(e) => {
            setQty(Number(e.target.value));
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          onClick={(e) => e.stopPropagation()}
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
