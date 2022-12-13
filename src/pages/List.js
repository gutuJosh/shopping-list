import React, { useState, useContext, useEffect, useCallback } from "react";
import ListItemDetails from "../components/ListItemDetails";
import NewItemForm from "../components/NewItemForm";
import ListItem from "../components/ListItem";
import CustomCheckBox from "../components/CustomCheckBox";
import FilterBtns from "../components/FilterBtns";
import SaveBtn from "../components/SaveBtn";
import handleDisplay from "../helpers/HandleDisplay";
import StorageManager from "../helpers/StorageManager";
import { AppContext } from "../context/AppContextProvider";
import { ListsContext } from "../context/ListsContextProvider";
import dataBaseManager from "../indexedDbManager";
import { useNavigate } from "react-router-dom";
import formatDate from "../helpers/FormatDate";
import useDatabase from "../hooks/useDatabase";
import useMicrophone from "../hooks/useMicrophone";
import useLongPress from "../hooks/useLongPress";
import useLanguage from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";

const calculateTotal = (items) => {
  const total = items.reduce((sum, value) => {
    let price =
      value.price === "" ? 0 : Number(value.price) * Number(value.qty);
    return sum + price;
  }, 0);

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(total);
};

function List() {
  let dbManager = dataBaseManager;
  const [state, dispatch] = useContext(AppContext);
  const [listState, dispatcher] = useContext(ListsContext);
  const [showInput, setShowInput] = useState(false);
  const [itemStatus, setItemStatus] = useState(0);
  const [newItemValue, setNewItemValue] = useState(false);
  const [listItems, dispatchList] = useDatabase(
    state.currentList.name,
    dataBaseManager,
    itemStatus,
    dispatcher
  );
  const { action, setAction, handlers } = useLongPress(600);
  const { t } = useTranslation();
  let navigate = useNavigate();
  const [language] = useLanguage();
  const [micResult, dispatchSpeach] = useMicrophone(language, true);
  const totalPrice = useCallback(
    () => calculateTotal(listState.items),
    [listState]
  );
  const setListItems = (items) => dispatchList(items);

  const addItem = (itemName) => {
    const getItemName = typeof itemName === "string" ? itemName : itemName.name;

    if (getItemName === "") {
      return;
    }

    const duplicateItem = listItems.filter(
      (item) => item.name.toLowerCase() === getItemName.toLowerCase()
    );
    if (duplicateItem.length > 0) {
      alert(t("Item name already exists!"));
      return;
    }

    const getMaxId = listItems.reduce((sum, item) => {
      if (item.id > sum) {
        sum = item.id;
      }
      return sum;
    }, 0);

    const itemToAdd =
      typeof itemName === "string"
        ? {
            id: getMaxId + 1,
            name: getItemName.trim(),
            qty: 1,
            price: "",
            status: 0,
          }
        : {
            id: getMaxId + 1,
            name: getItemName.trim(),
            qty: itemName.qty,
            price: itemName.price,
            status: 0,
          };

    dbManager
      .insertData(state.currentList.name, itemToAdd)
      .then((resp) => {
        if (resp.status === "ok") {
          const items = [...listItems];
          items.push(itemToAdd);
          setListItems(items);
          const listStore = [...listState.items];
          listStore.push(itemToAdd);
          dispatcher({
            type: "ADD_ITEM",
            payload: itemToAdd,
          });
          updateMetadata(state.currentList, listStore);
        }
      })
      .catch((err) => {
        /*console.log(err)*/
      });
  };

  const removeItem = (e, name) => {
    if (name === "") {
      alert(t("Item name can'not be empty!"));
      return;
    }

    let li = e.target;
    if (li.tagName !== "LI") {
      li = e.target.closest("li");
    }
    li.classList.add("hide");
    li.addEventListener("transitionend", () => {
      li.style.display = "none";
      li.classList.remove("hide");
      dbManager
        .removeRow(state.currentList.name, name)
        .then((resp) => {
          li.removeAttribute("style");
          if (resp.status === "ok") {
            const items = listItems.filter((item) => item.name !== name);
            setListItems(items);
            const listStore = [
              ...listState.items.filter((item) => item.name !== name),
            ];
            dispatcher({
              type: "REMOVE_ITEM",
              payload: name,
            });

            updateMetadata(state.currentList, listStore);
          }
        })
        .catch((err) => {
          /*console.log(err)*/
        });
    });
  };

  const updateItem = (index, newValue, objName = state.currentList.name) => {
    dbManager
      .updateRow(objName, index, newValue)
      .then((resp) => {
        if (resp.status === "ok") {
          const getItems = listItems.map((item) => {
            if (item.id === newValue.id) {
              item = newValue;
            }
            return item;
          });
          const listStore = [];
          listState.items.forEach((item) => {
            if (item.id === newValue.id) {
              item = newValue;
            }
            listStore.push(item);
          });
          dispatchList(getItems);
          dispatcher({
            type: "UPDATE_ITEMS",
            payload: newValue,
          });
          updateMetadata(state.currentList, listStore);
        } else {
          alert(t(resp));
        }
      })
      .catch((err) => alert(err.message));
  };

  const getListStatus = (list) => {
    let status = list.length === 0 ? 0 : 1;
    let compleatedTask = list.filter((item) => item.status === 0);
    if (compleatedTask.length > 0) {
      status = 0;
    }
    console.log(compleatedTask);
    return status;
  };

  const updateMetadata = async (tableData, list) => {
    console.log(list);
    const data = {
      id: tableData.id,
      name: tableData.name,
      date: tableData.date,
      records: list.length,
      status: getListStatus(list),
    };

    const response = await dbManager.updateRow("metadata", "name", data);
    if (response.status === "ok") {
      dispatch({
        type: "SELECT_LIST",
        payload: {
          id: state.currentList.id,
          name: state.currentList.name,
          date: state.currentList.date,
          records: data.records,
          status: data.status,
        },
      });
    } else {
      alert(response.msg);
    }
  };

  const handleSpeach = () => {
    if (action === "click") {
      return;
    }
    dispatchSpeach("start");
  };

  const handleFilters = (key) => {
    const getItems = document.querySelectorAll(".all-lists li");
    getItems.forEach((item) => {
      item.classList.remove("show", "show-enter");
    });
    setItemStatus(key);
  };

  const updateItemStatus = () => {
    return {
      items: listItems,
      updateTable: updateItem,
    };
  };

  const replaceItems = (from, to) => {
    const getItems = [...listItems];
    const getFromItem = listItems.filter((item, i) => i === from);
    const getToItem = listItems.filter((item, i) => i === to);

    getItems.splice(to, 1, getFromItem[0]);
    getItems.splice(from, 1, getToItem[0]);
    const updateItems = getItems.map((item, i) => {
      item.id = i + 1;
      return item;
    });

    updateItems.forEach(async (item, i) => {
      let newValue = {
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        status: item.status,
      };

      let response = await dbManager.updateRow(
        state.currentList.name,
        item.name,
        newValue
      );
      if (response.status !== "ok") {
        alert(response.msg);
      }
    });

    dispatchList(updateItems);
  };

  useEffect(() => {
    handleDisplay(80, itemStatus);
  }, [listItems]);

  useEffect(() => {
    if (state.currentList.name === undefined) {
      navigate(`/`);
      return;
    }
    return () => {
      /*if (!mounted() && state.currentList.name !== undefined) {
        //updateMetadata(state.currentList, listItems);
        dbManager = null;
      }*/
      dbManager = null;
      dispatcher({
        type: "DELETE_ITEMS",
        payload: [],
      });
      StorageManager.removeSession("listInitialize");
    };
  }, []);

  useEffect(() => {
    if (micResult !== "") {
      if (micResult === "roger over" || micResult === "not roger") {
        setAction("");
      } else {
        addItem(micResult);
      }
    }
  }, [micResult]);

  return (
    <>
      <h1 className="pad-x-20">
        {state.currentList.name}{" "}
        <span>
          ({listState.items.length}) {t("items")}
        </span>
      </h1>
      {listItems !== false && (
        <div className="flex mtop20 pad-x-20">
          <p className="flex-item">
            {t("Total cost")}: {totalPrice()}
          </p>
          <p className="flex-item txt-right">
            {t("Created at")}: {formatDate(state.currentList.date)}
          </p>
        </div>
      )}
      {showInput === true && (
        <NewItemForm
          btnLabel={t("Save")}
          placeholder={t("Add item")}
          handleInputValue={addItem}
          handleSaveBtn={() => {
            setShowInput(false);
            setAction("");
          }}
          captureValue={setNewItemValue}
          page="list"
          translator={t}
        />
      )}
      <FilterBtns
        name="list-items"
        handleClick={handleFilters}
        translator={t}
      />
      {listItems !== false && (
        <ul className="shopping-list all-lists pad-x-20 blocked">
          {listItems.map((item, i) => (
            <ListItem
              index={i}
              id={item.id}
              handleSwitch={replaceItems}
              key={`listitem_${i}`}
            >
              <div className="flex">
                <CustomCheckBox
                  {...item}
                  handleValue={updateItemStatus}
                  index={i}
                />

                <div className="pad-x-10 txt-center">
                  <svg
                    className="icn"
                    title={t("Dettails")}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.target.closest("li").classList.toggle("active");
                      try {
                        setTimeout(
                          () =>
                            e.target.closest("li").scrollIntoView({
                              block: "start",
                              behavior: "smooth",
                            }),
                          350
                        );
                      } catch (e) {
                        /*console.log(e.message)*/
                      }
                    }}
                  >
                    <use href="#elipsis-icon"></use>
                  </svg>
                </div>

                <div>
                  <svg
                    className="icn"
                    title="Delete"
                    onClick={(e) => {
                      removeItem(e, item.name);
                    }}
                  >
                    <use href="#trash-icon"></use>
                  </svg>
                </div>
              </div>
              <ListItemDetails data={item} update={updateItem} translator={t} />
            </ListItem>
          ))}
        </ul>
      )}
      <SaveBtn
        btnlabel={t("Save")}
        tip={t("Tap & hold for a voice note")}
        title={t("Add new item")}
        className={`add-new-item ${action}`}
        onClick={() => {
          handlers.handleOnClick(() => {
            if (!showInput) {
              setShowInput(true);
            } else {
              setShowInput(false);
              setAction("");
              if (newItemValue) {
                addItem(newItemValue);
                setNewItemValue(false);
              }
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
          if (action === "click") {
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
          if (action === "click") {
            return;
          }

          handlers.handleOnTouchStart(handleSpeach);
        }}
      />
    </>
  );
}

export default List;
