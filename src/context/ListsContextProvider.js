import React, { useReducer, createContext } from "react";

export const ListsContext = createContext();

const initialState = {
  items: [],
};

const reducer = (listState, action) => {
  switch (action.type) {
    case "ASSIGN_ITEMS":
      return {
        items:
          listState.items.length === 0 ? [...action.payload] : listState.items,
      };
    case "UPDATE_ITEMS":
      return {
        items: listState.items.map((item) => {
          if (item.id === action.payload.id) {
            item = action.payload;
          }
          return item;
        }),
      };
    case "ADD_ITEM":
      const listItems = listState.items;
      listItems.push(action.payload);
      return {
        items: [...listItems],
      };

    case "REMOVE_ITEM":
      return {
        items: [
          ...listState.items.filter((item) => item.name !== action.payload),
        ],
      };

    case "DELETE_ITEMS":
      return {
        items: action.payload,
      };

    default:
      throw new Error();
  }
};

export const ListsContextProvider = (props) => {
  const [listState, dispatcher] = useReducer(reducer, initialState);

  return (
    <ListsContext.Provider value={[listState, dispatcher]}>
      {props.children}
    </ListsContext.Provider>
  );
};
