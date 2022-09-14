import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  Suspense,
} from "react";
import { AppContext } from "../context/AppContextProvider";
import { useNavigate } from "react-router-dom";
import dataBaseManager from "../indexedDbManager";
import CustomBtn from "../components/customBtn";
import useLongPress from "../hooks/useLongPress";
import microphoneManager from "../microphoneManager";

const InputField = React.lazy(() => import("../components/inputFiled"));

function Home() {
  const [lists, setList] = useState([]);
  const [state, dispatch] = useContext(AppContext);
  const [appStatus, setAppStatus] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const { action, setAction, handlers } = useLongPress();
  const microphone = new microphoneManager("en-US");
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

  useEffect(() => {
    dbManager.getMetadata().then((response) => {
      console.log(response.results);
      if (response.results.length > 0) {
        //check the store and update records number
        const getItems = state.currentList.hasOwnProperty("records")
          ? response.results.map((item) => {
              if (item.name === state.currentList.name) {
                item.records = state.currentList.records;
              }
              return item;
            })
          : response.results;
        setList(
          getItems.sort((a, b) => {
            return b.date - a.date;
          })
        );
      }
    });

    microphone.handleEvent("start", (event) =>
      console.log("Ready to listen a voice command!")
    );

    return () => {
      dbManager = null;
    };
  }, [dbManager]);

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
          handlers.handleOnMouseDown(() => {
            console.log("Activate microphone then close");
            microphone.startMicrophone();
            setTimeout(() => setAction(""), 2000);
          });
        }}
      />
    </>
  );
}

export default Home;
