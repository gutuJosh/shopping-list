import { useState, useEffect } from "react";

function ListItemDetails(props) {
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
    <div className="item-details flex">
      <label className="flex-item auto pad-x-10">
        <span className="inline-block">Items number:</span>

        <input
          type="text"
          value={qty}
          onChange={(e) => setQty(formatValue(e.target.value))}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
      <label className="flex-item auto pad-x-10">
        <span className="inline-block">Price per item:</span>

        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(formatValue(e.target.value))}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
      <label className="pad-x-10">
        <button
          className="pad-x-20"
          onClick={(e) => {
            props.update(props.data.name, {
              id: props.data.id,
              name: props.data.name,
              qty: qty,
              price: price,
              status: props.data.status,
            });
            setTimeout(
              () =>
                e.target.parentNode.closest("li").classList.remove("active"),
              300
            );
          }}
        >
          OK
        </button>
      </label>
    </div>
  );
}

export default ListItemDetails;
