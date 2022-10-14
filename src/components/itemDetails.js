import React, { useState, useEffect } from "react";

function ItemDetails(props) {
  const [qty, setQty] = useState();
  const [price, setPrice] = useState();

  const formatValue = (data) => {
    let getValue = data.replace(/[a-zA-Z]/g, "").replace(/,/g, ".");
    if (isNaN(getValue)) {
      getValue = 0;
    }
    return getValue;
  };

  useEffect(() => {
    setQty(props.data.qty);
    setPrice(props.data.price);
  }, [props.data]);

  return (
    <div className="item-details">
      <label>
        Items number:
        <input
          type="text"
          value={qty}
          onChange={(e) => setQty(formatValue(e.target.value))}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
      <label>
        Price per item:
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(formatValue(e.target.value))}
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
