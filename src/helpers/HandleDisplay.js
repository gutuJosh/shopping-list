const handleTransitionEnd = () => {
  const getItems = document.querySelectorAll(".all-lists li");
  getItems.forEach((item) => {
    item.classList.remove("show-enter");
    item.classList.remove("hide");
    item.removeEventListener("transitionend", handleTransitionEnd);
  });
};

const handleDisplay = (delay, status) => {
  const getItems = document.querySelectorAll(".all-lists li:not(.show)");
  if (getItems.length === 0) {
    setTimeout(() => {
      handleDisplay(delay, status);
    }, 200);
    return;
  }

  let i = 1;
  getItems.forEach((item) => {
    setTimeout(() => {
      item.classList.add("show", "show-enter");
      item.addEventListener("transitionend", handleTransitionEnd);
    }, i * delay);
    i++;
  });

  setTimeout(() => {
    document.querySelector(".shopping-list").classList.remove("blocked");
  }, (getItems.length + getItems.length * 0.6) * (delay + 0.6));
};

export default handleDisplay;
