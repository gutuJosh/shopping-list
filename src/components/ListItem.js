import React, { useEffect, useState, useRef } from "react";
let targetIndex = false,
  direction = "",
  oldY = 0,
  delay = null,
  touchStartY = 0,
  initialDirection = null;

function ListItem(props) {
  const element = useRef(null);
  const [data, setData] = useState(false);
  const [styles, setStyles] = useState({});
  const removeClass = (name) => {
    const element = document.querySelectorAll(`.${name}`);
    if (element.length > 0) {
      element.forEach((item) => item.classList.remove(name));
    }
  };

  const setElementTopPosition = (el) => {
    const css = window.getComputedStyle(el);
    const height =
      el.offsetHeight +
      parseFloat(css["marginTop"]) +
      parseFloat(css["marginBottom"]);
    setStyles({
      top: props.index * height + "px",
    });
  };

  const handleMouseDown = (e) => {
    return;
    if (element.current.classList.contains("active")) {
      return;
    }
    if (e.changedTouches === undefined) {
      e.preventDefault();
    } else {
      if (e.targetTouches.length === 1) {
        return false;
      }
    }
    delay = setTimeout(() => draggItem(e), 350);
  };

  const draggItem = (e) => {
    if (e.changedTouches === undefined) {
      e.preventDefault();
    }
    enableDragg(e);
    window.addEventListener("mousemove", handleDragg, false);
    window.addEventListener("mouseup", handleMouseUp, false);
    element.current.addEventListener("touchmove", handleDragg, false);
    element.current.addEventListener("touchend", handleMouseUp, false);
  };

  const handleMouseUp = (e) => {
    return;
    if (e.changedTouches === undefined) {
      e.preventDefault();
    }
    disableDragg();
    if (targetIndex !== false) {
      props.handleSwitch(
        Number(element.current.dataset.index),
        Number(targetIndex)
      );
    }
    window.removeEventListener("mousemove", handleDragg, false);
    window.removeEventListener("mouseup", handleMouseUp);
    element.current.removeEventListener("touchmove", handleDragg);
    element.current.removeEventListener("touchend", handleMouseUp);
  };

  const enableDragg = (e) => {
    oldY = e.changedTouches ? e.changedTouches[0].clientY : e.pageY;
    touchStartY = oldY;
    element.current.parentNode.classList.add("draggable");
    if (!element.current.classList.contains("dragg-active")) {
      element.current.classList.remove("show");
      element.current.classList.add("dragg-active");
    }
    let coordinates = data;
    coordinates["liHeight"] = element.current.offsetHeight;
    setData(coordinates);
  };

  const disableDragg = () => {
    element.current.classList.add("show");
    element.current.classList.remove("dragg-active");
    element.current.parentNode.classList.remove("draggable");
    removeClass("move-up");
    removeClass("move-down");
    direction = "";
    oldY = 0;
    touchStartY = 0;
    initialDirection = null;
    setElementTopPosition(element.current);
  };

  const setDirection = (pageY) => {
    if (pageY < oldY) {
      direction = "top";
    } else if (pageY > oldY) {
      direction = "bottom";
    }
    oldY = pageY;
    if (initialDirection === null) {
      initialDirection = touchStartY < pageY ? "top" : "bottom";
    }
  };

  const handleDragg = (e) => {
    if (e.changedTouches === undefined) {
      e.preventDefault();
    }
    e.stopPropagation();
    const ev = e.changedTouches ? e.changedTouches[0].clientY : e.pageY;
    const flag = element.current.classList.contains("item-enter-done");
    setDirection(ev);
    let offsetTop =
      ev - data.containerTopPos - data.ulTopPos < 0
        ? 0 + "px"
        : ev - data.containerTopPos - data.ulTopPos;

    setStyles({
      top: flag ? offsetTop : offsetTop - data.liHeight / 2 + "px",
    });

    handleTouchEnter(e);
  };

  const handleMouseEnter = (e) => {
    return;
    if (!element.current.parentNode.classList.contains("draggable")) {
      return;
    }

    let getElement = e.target;
    while (getElement.tagName !== "LI") {
      getElement = getElement.parentNode;
    }
    targetIndex = Number(getElement.dataset.index);
    if (direction === "bottom") {
      if (getElement.classList.contains("move-down")) {
        getElement.classList.remove("move-down");
      } else {
        getElement.classList.add("move-up");
      }
    } else if (direction === "top") {
      if (getElement.classList.contains("move-up")) {
        getElement.classList.remove("move-up");
      } else {
        getElement.classList.add("move-down");
      }
    }
  };

  const handleTouchEnter = (e) => {
    return;
    if (e.changedTouches) {
      const htmlItem = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
      if (htmlItem.tagName === "LI") {
        targetIndex = Number(htmlItem.dataset.index);
        if (initialDirection === "top") {
          if (direction === "top") {
            if (htmlItem.classList.contains("move-up")) {
              htmlItem.classList.remove("move-up");
            }
          } else {
            htmlItem.classList.add("move-up");
          }
        } else {
          if (direction === "bottom") {
            if (htmlItem.classList.contains("move-down")) {
              htmlItem.classList.remove("move-down");
            }
          } else {
            htmlItem.classList.add("move-down");
          }
        }
      }
    }
  };

  const disableContextMenu = (event) => event.preventDefault();

  useEffect(() => {
    if (!data) {
      setData({
        containerTopPos: document.querySelector(".container").offsetTop,
        ulTopPos: element.current.parentNode.offsetTop,
      });
      setElementTopPosition(element.current);
      document.addEventListener("contextmenu", disableContextMenu);
    }
    try {
      element.current.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    } catch (e) {
      element.current
        .closest("ul")
        .scrollTo(0, element.current.closest("ul").scrollHeight - 100);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragg);
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  return (
    <li
      ref={element}
      style={styles}
      className={`${props.classId}`}
      onMouseDown={handleMouseDown}
      onMouseUp={() => clearTimeout(delay)}
      onTouchStart={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onTouchEnd={(e) => {
        clearTimeout(delay);
      }}
      data-index={props.index}
      data-id={props.id}
    >
      {props.children}
    </li>
  );
}

export default ListItem;
