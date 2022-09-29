import React, { useState, useContext, useEffect, Suspense } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import ItemDetails from "../components/itemDetails";
import CheckBox from "../components/checkBox";
import Filters from "../components/Filters";
import CustomBtn from "../components/customBtn";
import { AppContext } from "../context/AppContextProvider";
import dataBaseManager from "../indexedDbManager";
import useIsMounted from "../hooks/useIsMounted";
import useDatabase from "../hooks/useDatabase";
import useMicrophone from "../hooks/useMicrophone";
import useLongPress from "../hooks/useLongPress";

const InputField = React.lazy(() => import("../components/inputFiled"));

function List() {
  const [state, dispatch] = useContext(AppContext);
  const [showInput, setShowInput] = useState(false);
  const [itemStatus, setItemStatus] = useState(0);
  const [listItems, dispatchList] = useDatabase(
    state.currentList.name,
    dataBaseManager
  );
  const { action, setAction, handlers } = useLongPress(600);
  const mounted = useIsMounted();
  let navigate = useNavigate();
  let dbManager = dataBaseManager;
  const [micResult, dispatchSpeach] = useMicrophone("en-US", true);

  const setListItems = (items) => dispatchList(items);

  const addItem = (itemName) => {
    if (itemName === "") {
      console.log("Item name is empty!");
      return;
    }

    const duplicateItem = listItems.filter(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );
    if (duplicateItem.length > 0) {
      console.log("Item name already exists!");
      return;
    }

    const itemToAdd = {
      id: listItems.length + 1,
      name: itemName.trim(),
      qty: 1,
      price: "",
      status: 0,
    };

    dbManager
      .insertData(state.currentList.name, itemToAdd)
      .then((resp) => {
        if (resp.status === "ok") {
          console.log(resp);
          const items = listItems;
          items.push(itemToAdd);
          setListItems(items);
          dispatch({
            type: "SELECT_LIST",
            payload: {
              id: state.currentList.id,
              name: state.currentList.name,
              date: state.currentList.date,
              records: items.length,
              status: getListStatus(),
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const removeItem = (name) => {
    if (name === "") {
      console.log("Item name can'not be empty!");
      return;
    }
    dbManager
      .removeRow(state.currentList.name, name)
      .then((resp) => {
        if (resp.status === "ok") {
          const items = listItems.filter((item) => item.name !== name);
          setListItems(items);
          dispatch({
            type: "SELECT_LIST",
            payload: {
              id: state.currentList.id,
              name: state.currentList.name,
              date: state.currentList.date,
              records: items.length,
              status: getListStatus(),
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const updateItem = (index, newValue, objName = state.currentList.name) => {
    dbManager
      .updateRow(objName, index, newValue)
      .then((resp) => {
        if (resp.status === "ok") {
          console.log(resp);
        }
      })
      .catch((err) => console.log(err));
  };

  const getListStatus = () => {
    let status = listItems.length === 0 ? 0 : 1;
    let compleatedTask = listItems.filter((item) => item.status === 0);
    if (compleatedTask.length > 0) {
      status = 0;
      /*compleatedTask = listItems.filter((item) => item.status === 1);
      if (compleatedTask.length > 0) {
        status = 0;
      }*/
    }
    return status;
  };

  const updateMetadata = async (tableData, list) => {
    const data = {
      id: tableData.id,
      name: tableData.name,
      date: tableData.date,
      records: list.length,
      status: getListStatus(),
    };
    const response = await dbManager.updateRow("metadata", "name", data);
    console.log(response);
  };

  const handleSpeach = () => {
    if (action === "click") {
      return;
    }
    dispatchSpeach("start");
  };

  const updateItemStatus = () => {
    return {
      items: listItems,
      updateItems: dispatchList,
      updateTable: updateItem,
    };
  };

  useEffect(() => {
    if (state.currentList.name === undefined) {
      navigate(`/`);
    }
    return () => {
      if (!mounted() && state.currentList.name !== undefined) {
        updateMetadata(state.currentList, listItems);
        dbManager = null;
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (micResult !== "") {
      addItem(micResult);
    }
  }, [micResult]);

  return (
    <>
      <h1>
        {state.currentList.name}{" "}
        <span>({state.currentList.records}) items</span>
      </h1>
      {showInput === true && (
        <Suspense fallback={<div>Loading...</div>}>
          <InputField placeholder="Add item" handleInputValue={addItem} />
        </Suspense>
      )}
      <Filters name="list-items" handleClick={setItemStatus} />
      {listItems !== false && (
        <ul>
          <TransitionGroup className="shopping-list">
            {listItems.map((item, i) => (
              <CSSTransition key={`item_${i}`} timeout={500} classNames="item">
                <li
                  className={
                    itemStatus === 1 && item.status !== 1
                      ? "hide"
                      : itemStatus === 2 && item.status === 1
                      ? "hide"
                      : ""
                  }
                >
                  <CheckBox
                    {...item}
                    handleValue={updateItemStatus}
                    index={i}
                  />
                  &nbsp;
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      e.target.closest("li").classList.toggle("active");
                    }}
                  >
                    ...
                  </span>
                  &nbsp;
                  <span
                    onClick={() => {
                      removeItem(item.name);
                    }}
                  >
                    X
                  </span>
                  <ItemDetails data={item} update={updateItem} />
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ul>
      )}
      <CustomBtn
        title="Add new item"
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
          if (action === "longpress") {
            dispatchSpeach("stop");
            setTimeout(() => {
              setAction("");
            }, 300);
            return;
          }
          handlers.handleOnMouseDown(handleSpeach);
        }}
        onTouchStart={() => {
          if (action === "longpress") {
            dispatchSpeach("stop");
            setAction("");
            return;
          }
          handlers.handleOnTouchStart(handleSpeach);
        }}
      />
    </>
  );
}

export default List;
