import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContextProvider";
import handleDisplay from "../helpers/HandleDisplay";
import dataBaseManager from "../indexedDbManager";
import InputField from "../components/InputField";
import SaveBtn from "../components/SaveBtn";
import FilterBtns from "../components/FilterBtns";
import RadioButton from "../components/RadioButton";
import ListItem from "../components/ListItem";
import useLongPress from "../hooks/useLongPress";
import useDatabase from "../hooks/useDatabase";
import useMicrophone from "../hooks/useMicrophone";
import useLanguage from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";

function Home() {
  let dbManager = dataBaseManager;
  const [state, dispatch] = useContext(AppContext);
  const [appStatus, setAppStatus] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newItemValue, setNewItemValue] = useState(false);
  const [filter, setFilter] = useState(0);
  const shoppingList = useRef(null);
  const [lists, setList] = useDatabase(
    state.currentList,
    dataBaseManager,
    filter
  );
  const { action, setAction, handlers } = useLongPress();
  const [language] = useLanguage();
  const [micResult, dispatchSpeach] = useMicrophone(language, false);
  const { t } = useTranslation();

  const createList = (listName) => {
    if (listName === "") {
      return;
    }
    const duplicateItem = lists.filter(
      (item) => item.name.toLowerCase() === listName.toLowerCase()
    );
    if (duplicateItem.length > 0) {
      alert(t("List name allready exists!"));
      return;
    }
    const getMaxId = lists.reduce((sum, item) => {
      if (item.id > sum) {
        sum = item.id;
      }
      return sum;
    }, 0);
    const newItem = {
      id: getMaxId + 1,
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
        shoppingList.current.scrollTo(
          0,
          shoppingList.current.scrollHeight + 100
        );
        return dbManager.insertData("metadata", newItem);
      })
      .then((resp) => {
        //console.log(resp);
      })
      .catch((err) => {
        /*console.log(err)*/
      });
  };

  const deleteList = (e, name) => {
    setAppStatus(true);
    let li = e.target;
    if (li.tagName !== "LI") {
      li = e.target.closest("li");
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
                .then((resp) => {
                  /*console.log(resp)*/
                })
                .catch((err) => {
                  /*console.log(err)*/
                });
            }
          }
        })
        .catch((err) => {
          /*console.log(err)*/
        });
    });
  };

  const replaceItems = (from, to) => {
    const getItems = [...lists];
    const getFromItem = lists.filter((item, i) => i === from);
    const getToItem = lists.filter((item, i) => i === to);

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
        date: item.date,
        records: item.records,
        status: item.status,
      };

      let response = await dbManager.updateRow("metadata", item.name, newValue);
      if (response.status !== "ok") {
        alert(t(response.msg));
      }
    });

    setList(updateItems);
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
      if (micResult === "roger over" || micResult === "not roger") {
        setAction("");
      } else {
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
    }
  }, [micResult]);

  return (
    <>
      {appStatus && <h2>Loading ...</h2>}
      <h1 className="pad-x-20">{t("My Lists")}</h1>
      {showInput === true && (
        <InputField
          btnLabel={t("Save")}
          placeholder={t("Insert list name")}
          handleInputValue={createList}
          handleSaveBtn={(value = false) => {
            setShowInput(false);
            setAction("");
          }}
          captureValue={setNewItemValue}
        />
      )}
      <FilterBtns handleClick={handleFilters} translator={t} />
      {lists !== false && (
        <ul
          className="shopping-list all-lists main-list pad-x-20"
          ref={shoppingList}
        >
          {lists.map((item, i) => (
            <ListItem
              index={i}
              id={item.id}
              handleSwitch={replaceItems}
              key={`listitem_${i}`}
            >
              <div className="flex">
                <RadioButton {...item} />
                <div>
                  <svg
                    className="icn"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteList(e, item.name);
                    }}
                  >
                    <use href="#trash-icon"></use>
                  </svg>
                </div>
              </div>
            </ListItem>
          ))}
        </ul>
      )}
      <SaveBtn
        btnlabel={t("Save")}
        tip={t("Tap for a text note | Tap & hold for a voice note")}
        title={t("Add new list")}
        className={`add-new-item ${action}`}
        onClick={() => {
          handlers.handleOnClick(() => {
            if (!showInput) {
              setShowInput(true);
            } else {
              setShowInput(false);
              setAction("");
              if (newItemValue) {
                createList(newItemValue);
                setNewItemValue(false);
              }
            }
          });
        }}
        onMouseDown={() => {
          if (action === "click") {
            return;
          }
          handlers.handleOnMouseDown(handleSpeach);
        }}
        onTouchStart={() => {
          if (action === "click") {
            return;
          }
          handlers.handleOnTouchStart(handleSpeach);
        }}
      />
    </>
  );
}

export default Home;
