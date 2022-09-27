import React, { useState, useEffect } from "react";

//custom hook outside the component to detect unmount
const useDatabase = (list, dataBaseManager) => {
  const [listItems, setListItems] = useState(false);

  function dispatchList(data) {
    setListItems(data);
  }

  useEffect(() => {
    if (typeof list === "object" || list === "") {
      dataBaseManager.getMetadata().then((response) => {
        if (response.results.length > 0) {
          const getResults = list.hasOwnProperty("records")
            ? response.results.map((item) => {
                if (item.name === list.name) {
                  item.records = list.records;
                }
                return item;
              })
            : response.results;
          dispatchList(
            getResults.sort((a, b) => {
              return b.date - a.date;
            })
          );
        }
      });
    } else {
      dataBaseManager.selectData(list).then((resp) => {
        dispatchList([
          ...resp.results.sort((a, b) => {
            return a.id - b.id;
          }),
        ]);
      });
    }
  }, [list]);

  return [listItems, dispatchList];
};

export default useDatabase;
