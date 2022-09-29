import React, { useState, useContext, useEffect, Suspense } from "react";
import { AppContext } from "../context/AppContextProvider";
import { useNavigate } from "react-router-dom";
import dataBaseManager from "../indexedDbManager";
import CustomBtn from "../components/customBtn";
import Filters from "../components/Filters";
import useLongPress from "../hooks/useLongPress";
import useDatabase from "../hooks/useDatabase";
import useMicrophone from "../hooks/useMicrophone";

const InputField = React.lazy(() => import("../components/inputFiled"));

function Home() {
  const [state, dispatch] = useContext(AppContext);
  const [appStatus, setAppStatus] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [lists, setList] = useDatabase(state.currentList, dataBaseManager);
  const { action, setAction, handlers } = useLongPress();
  const [micResult, dispatchSpeach] = useMicrophone("en-US", false);
  let dbManager = dataBaseManager;
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
      .then((resp) => {
        console.log(resp);
        if (resp.status === "ok") {
          dbManager
            .insertData("metadata", newItem)
            .then((resp) => {
              console.log(resp);
            })
            .catch((err) => console.log(err));
          setAppStatus(false);
          const getLists = [...lists];
          getLists.push(newItem);
          setList(getLists);
        }
      })
      .catch((err) => console.log(err));
  };

  const editList = (obj) => {
    dispatch({
      type: "SELECT_LIST",
      payload: obj,
    });
  };

  const deleteList = (name) => {
    setAppStatus(true);
    dbManager
      .deleteTable(name)
      .then((resp) => {
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

  useEffect(() => {
    return () => {
      dbManager = null;
    };
  }, []);

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
      <Filters />
      {lists !== false && (
        <ul>
          {lists.map((item, i) => (
            <li
              key={i}
              onClick={() => {
                editList(item);
                navigate(
                  `/edit-list/${encodeURIComponent(item.name.toLowerCase())}`
                );
              }}
              className={
                state.listStatus === 1 && state.listStatus !== item.status
                  ? "hide"
                  : state.listStatus === 2 && item.status === 1
                  ? "hide"
                  : ""
              }
            >
              {item.name} ({item.records}) items
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteList(item.name);
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
