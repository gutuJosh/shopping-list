import React, { useReducer, createContext } from "react";

export const AppContext = createContext();

const initialState = {
  currentList: "",
  listStatus: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT_LIST":
      return {
        currentList: action.payload,
        listStatus: state.listStatus,
      };

    case "CHANGE_LIST_STATUS":
      return {
        currentList: state.currentList,
        listStatus: action.payload,
      };

    default:
      throw new Error();
  }
};

export const AppContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  return (
    <AppContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
};
