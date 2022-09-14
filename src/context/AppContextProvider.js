import React, { useReducer, createContext } from "react";

export const AppContext = createContext();

const initialState = {
  currentList: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT_LIST":
      return {
        currentList: action.payload,
      };

    case "REMOVE_LIST":
      return {
        currentList: "",
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
