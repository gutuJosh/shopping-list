import { useState, useEffect } from "react";
import formatNumeric from "../helpers/FormatNumeric";

function ListItemDetails(props) {
  const [qty, setQty] = useState();
  const [price, setPrice] = useState();
  const t = props.translator;

  useEffect(() => {
    setQty(props.data.qty);
    setPrice(props.data.price);
  }, [props.data]);

  return (
    <form className="item-details flex">
      <label className="flex-item auto pad-x-10">
        <span className="inline-block">{t("Items number")}:</span>

        <input
          type="text"
          value={qty}
          inputMode="numeric"
          onChange={(e) => setQty(formatNumeric(e.target.value))}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
      <label className="flex-item auto pad-x-10">
        <span className="inline-block">{t("Price per item")}:</span>
        <input
          type="text"
          value={price}
          inputMode="numeric"
          placeholder={`x 1 ${t("item")}`}
          onChange={(e) => setPrice(formatNumeric(e.target.value))}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
      <label className="pad-x-10">
        <button
          className="pad-x-20"
          onClick={(e) => {
            e.preventDefault();
            props.update(props.data.name, {
              id: props.data.id,
              name: props.data.name,
              qty: qty,
              price: price,
              status: props.data.status,
            });
            setTimeout(() => {
              e.target.parentNode.closest("li").classList.remove("active");
            }, 300);
          }}
        >
          {t("OK")}
        </button>
      </label>
    </form>
  );
}

export default ListItemDetails;
