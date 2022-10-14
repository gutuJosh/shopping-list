import { useState, useEffect } from "react";

//custom hook outside the component to detect unmount
const useDatabase = (list, dataBaseManager, filter) => {
  const [listItems, setListItems] = useState(false);

  function dispatchList(data) {
    if (filter === 1) {
      setListItems(data.filter((item) => item.status === 1));
    } else if (filter === 2) {
      setListItems(data.filter((item) => item.status !== 1));
    } else {
      setListItems(data);
    }
  }

  useEffect(() => {
    if (typeof list === "object" || list === "") {
      // if list is empty get all tables
      dataBaseManager.getMetadata().then((response) => {
        try {
          if (response.results.length > 0) {
            //if list is object update last modified table
            const getResults = list.hasOwnProperty("records")
              ? response.results.map((item) => {
                  if (item.name === list.name) {
                    item["records"] = list.records; //update total records
                    item["status"] = list.status; //update list status
                  }
                  return item;
                })
              : response.results;
            dispatchList(
              getResults.sort((a, b) => {
                return a.id - b.id; //b.date - a.date;
              })
            );
          } else {
            dispatchList([]);
          }
        } catch (e) {
          console.log(e.message);
          dispatchList([]);
        }
      });
    } else {
      // get a particular table
      dataBaseManager.selectData(list).then((resp) => {
        dispatchList([
          ...resp.results.sort((a, b) => {
            return a.id - b.id;
          }),
        ]);
      });
    }
  }, [filter]);

  return [listItems, dispatchList];
};

export default useDatabase;
