import React, { useReducer, createContext } from "react";

export const AppContext = createContext();

const initialState = {
  currentList: "",
  listStatus: 0,
  tables: [],
  listItems: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT_LIST":
      return {
        currentList: action.payload,
        listStatus: state.listStatus,
        tables: state.tables,
        listItems: state.listItems,
      };

    case "CHANGE_LIST_STATUS":
      return {
        currentList: state.currentList,
        listStatus: action.payload,
        tables: state.tables,
        listItems: state.listItems,
      };

    default:
      throw new Error();
  }
};

export const AppContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
};
