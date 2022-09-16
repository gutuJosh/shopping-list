import React, { useState, useContext, useEffect, Suspense } from "react";
import ItemDetails from "../components/itemDetails";
import { AppContext } from "../context/AppContextProvider";
import { useNavigate } from "react-router-dom";
import dataBaseManager from "../indexedDbManager";
import useIsMounted from "../hooks/useIsMounted";
import CustomBtn from "../components/customBtn";
import useLongPress from "../hooks/useLongPress";
import microphoneManager from "../microphoneManager";

const InputField = React.lazy(() => import("../components/inputFiled"));

function List() {
  const [listItems, setListItems] = useState(false);
  const [state, dispatch] = useContext(AppContext);
  const [showInput, setShowInput] = useState(false);
  const { action, setAction, handlers } = useLongPress();
  const mounted = useIsMounted();
  const microphone = new microphoneManager("en-US", true);
  let dbManager = dataBaseManager;
  let navigate = useNavigate();

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
    console.log(listItems.length + 1);
    const itemToAdd = {
      id: listItems.length + 1,
      name: itemName,
      qty: 1,
      price: "",
      status: 0,
    };
    dbManager
      .insertData(state.currentList.name, itemToAdd)
      .then((resp) => {
        if (resp.status === "ok") {
          console.log(resp);
          const items = [...listItems];
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
    let status = 1;
    listItems.forEach((item) => {
      if (item.status === 0) {
        status = 0;
        return status;
      }
    });
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
    if (action === "longpress") {
      microphone.stopMicrophone();
      setAction("");
      return;
    }
    microphone.startMicrophone();
    microphone.handleEvent("result", (event) => {
      const result = event.results; //[event.results.length - 1][0].transcript;
      for (let i = 0; i < result.length; i++) {
        addItem(result[i][0].transcript);
        console.log(result[i][0].transcript);
      }
      //microphone.stopMicrophone();
      //setAction("");
    });
    microphone.handleEvent("end", (event) => {
      console.log("End listen!");
      microphone.stopMicrophone();
      setAction("");
    });

    microphone.handleEvent("error", (event) => {
      console.log("I didn't recognise that word!");
      microphone.stopMicrophone();
      setAction("");
    });
  };

  useEffect(() => {
    console.log("Render List component");
    if (state.currentList.name !== undefined) {
      if (listItems === false) {
        dbManager.selectData(state.currentList.name).then((resp) => {
          setListItems([
            ...resp.results.sort((a, b) => {
              return a.id - b.id;
            }),
          ]);
        });
      }
    } else {
      navigate(`/`);
    }
    return () => {
      if (!mounted()) {
        updateMetadata(state.currentList, listItems);
        dbManager = null;
      }
    };
  }, [dbManager, mounted]);

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

      {listItems !== false && (
        <ul>
          {listItems.map((item, i) => (
            <li
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                e.target.closest("li").classList.toggle("active");
              }}
            >
              <p>
                <span>{item.name}</span>&nbsp;
                <span
                  onClick={() => {
                    removeItem(item.name);
                  }}
                >
                  X
                </span>
              </p>
              <ItemDetails data={item} update={updateItem} />
            </li>
          ))}
        </ul>
      )}
      <CustomBtn
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

export default List;
