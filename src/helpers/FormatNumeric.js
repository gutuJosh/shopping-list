const formatNumeric = (data) => {
  let getValue = data.replace(/[a-zA-Z]/g, "").replace(/,/g, ".");
  if (isNaN(getValue)) {
    getValue = 0;
  }
  return getValue;
};

export default formatNumeric;
