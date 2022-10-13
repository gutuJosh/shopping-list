import React, { useState, useContext, useEffect, Suspense } from "react";
import { AppContext } from "../context/AppContextProvider";
import { useNavigate } from "react-router-dom";
import handleDisplay from "../helpers/HandleDisplay";
import dataBaseManager from "../indexedDbManager";
import CustomBtn from "../components/customBtn";
import Filters from "../components/Filters";
import useLongPress from "../hooks/useLongPress";
import useDatabase from "../hooks/useDatabase";
import useMicrophone from "../hooks/useMicrophone";

const InputField = React.lazy(() => import("../components/inputFiled"));

function Home() {
  let dbManager = dataBaseManager;
  const [state, dispatch] = useContext(AppContext);
  const [appStatus, setAppStatus] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [filter, setFilter] = useState(0);
  const [lists, setList] = useDatabase(
    state.currentList,
    dataBaseManager,
    filter
  );
  const { action, setAction, handlers } = useLongPress();
  const [micResult, dispatchSpeach] = useMicrophone("en-US", false);
  let navigate = useNavigate();

  const createList = (listName) => {
    if (listName === "") {
      console.log("List name is empty!");
      return;
    }
    const duplicateItem = lists.filter(
      (item) => item.name.toLowerCase() === listName.toLowerCase()
    );
    if (duplicateItem.length > 0) {
      console.log("List name allready exists!");
      return;
    }
    const newItem = {
      id: lists.length + 1,
      name: listName,
      date: Date.now(),
      records: 0,
      status: 0,
    };
    setAppStatus(true);
    dbManager
      .createTable(listName)
      .then(() => {
        setAppStatus(false);
        const getLists = [...lists];
        getLists.push(newItem);
        setList(getLists);
        return dbManager.insertData("metadata", newItem);
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.log(err));
  };

  const editList = (obj) => {
    dispatch({
      type: "SELECT_LIST",
      payload: obj,
    });
  };

  const deleteList = (e, name) => {
    setAppStatus(true);
    let li = e.target;
    while (li.tagName !== "LI") {
      li = e.target.parentNode;
    }
    li.classList.add("hide");
    li.addEventListener("transitionend", () => {
      li.style.display = "none";
      li.classList.remove("hide");
      dbManager
        .deleteTable(name)
        .then((resp) => {
          li.removeAttribute("style");
          if (resp.status === "ok") {
            setAppStatus(false);
            const getLists = lists.filter((element) => element.name !== name);
            setList(getLists);
            if (getLists.length > 0) {
              dbManager
                .removeRow("metadata", name)
                .then((resp) => console.log(resp))
                .catch((err) => console.log(err));
            }
          }
        })
        .catch((err) => console.log(err));
    });
  };

  const handleSpeach = () => {
    if (action === "click") {
      return;
    }
    if (action === "longpress") {
      dispatchSpeach("stop");
      setAction("");
      return;
    }
    dispatchSpeach("start");
  };

  const handleFilters = (key) => {
    const getItems = document.querySelectorAll(".all-lists li");
    getItems.forEach((item) => {
      item.classList.remove("show", "show-enter");
    });
    setFilter(key);
    dispatch({
      type: "CHANGE_LIST_STATUS",
      payload: key,
    });
  };

  useEffect(() => {
    handleDisplay(50, filter);
    return () => {
      dbManager = null;
    };
  }, [lists]);

  useEffect(() => {
    if (micResult !== "") {
      createList(
        `${micResult.charAt(0).toUpperCase()}${micResult.substring(
          1,
          micResult.length
        )}`
      );
      setTimeout(() => {
        setAction("");
      }, 300);
    }
  }, [micResult]);

  return (
    <>
      {appStatus && <h2>Loading ...</h2>}
      <h1>Le tue liste</h1>
      {showInput === true && (
        <Suspense fallback={<div>Loading...</div>}>
          <InputField
            placeholder="Insert list name"
            handleInputValue={createList}
          />
        </Suspense>
      )}
      <Filters handleClick={handleFilters} />
      {lists !== false && (
        <ul className="all-lists">
          {lists.map((item, i) => (
            <li
              key={i}
              data-status={item.status}
              onClick={() => {
                editList(item);
                navigate(
                  `/edit-list/${encodeURIComponent(item.name.toLowerCase())}`
                );
              }}
            >
              {item.name} ({item.records}) items
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteList(e, item.name);
                }}
              >
                X
              </span>
            </li>
          ))}
        </ul>
      )}
      <CustomBtn
        title="Add new list"
        className={`add-new-item ${action}`}
        onClick={() => {
          handlers.handleOnClick(() => {
            if (!showInput) {
              setShowInput(true);
            } else {
              setShowInput(false);
              setAction("");
            }
          });
        }}
        onMouseDown={() => {
          handlers.handleOnMouseDown(handleSpeach);
        }}
        onTouchStart={() => {
          handlers.handleOnTouchStart(handleSpeach);
        }}
      />
    </>
  );
}

export default Home;
