class indexedDbManager {
  constructor() {
    this.dbName = "Shoppinglist";
    // Hold an instance of a db object for us to store the IndexedDB data in
    this.db = "";
    this.dbVersion = this.getDbVersion();
    this.dbSchema = {
      keyPath: "name",
      index: [
        { name: "id", unique: false },
        { name: "name", unique: true },
        { name: "qty", unique: false },
        { name: "price", unique: false },
        { name: "status", unique: false },
      ],
    };
    this.metadataSchema = {
      keyPath: "name",
      index: [
        { name: "id", unique: false },
        { name: "name", unique: false },
        { name: "date", unique: true },
        { name: "records", unique: false },
        { name: "status", unique: false },
      ],
    };
  }

  getDbVersion() {
    if (typeof localStorage.dbVersion === "undefined") {
      localStorage.setItem("dbVersion", 1);
      return 1;
    } else {
      return Number(localStorage.dbVersion);
    }
  }

  setDbVersion(version) {
    localStorage.setItem("dbVersion", version);
    this.dbVersion = version;
    return version;
  }

  createTable(tableName) {
    return new Promise((resolve, reject) => {
      //Open Database
      const version = this.setDbVersion(this.dbVersion + 1);
      console.log("I try to open the database version " + version);
      const request = indexedDB.open(this.dbName, version);

      request.onerror = (event) => {
        reject({
          status: "ko",
          msg: event,
        });
      };

      request.onsuccess = (event) => {
        console.log("Wtf am I doing here? ");
      };

      request.onupgradeneeded = (event) => {
        console.log("I try to update the db version " + this.dbVersion);
        this.db = event.target.result;

        //create user's table
        if (!this.db.objectStoreNames.contains(tableName)) {
          const objectStore = this.db.createObjectStore(tableName, {
            keyPath: this.dbSchema.keyPath,
          });
          this.dbSchema.index.forEach((item) => {
            objectStore.createIndex(item.name, item.name, {
              unique: item.unique,
            });
          });
          this.db.close();
          resolve({
            status: "ok",
            msg: "Table " + tableName + "created successfully!",
          });
        } else {
          this.db.close();
          reject({
            status: "ko",
            msg: "Table exist!",
          });
        }
      };
    });
  }

  insertData(tableName, value) {
    return new Promise((resolve, reject) => {
      //Open Database
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        reject({
          status: "ko",
          msg: event,
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;

        const transaction = this.db.transaction([tableName], "readwrite");

        transaction.oncomplete = (event) => {
          this.db.close();
          resolve({
            status: "ok",
            msg: "The data was saved in the db sucessfuly!",
          });
        };

        transaction.onerror = (event) => {
          // Don't forget to handle errors!
          this.db.close();
          reject({
            status: "ko",
            msg: "Error! The data was not saved in the db!",
          });
        };
        let req;
        const objectStore = transaction.objectStore(tableName);
        if (Array.isArray(value)) {
          value.forEach((data) => {
            req = objectStore.add(data);
            req.onsuccess = (event) => {
              //console.log("Item id:" + data.id + "was saved");
            };
            req.onerror = (event) => {
              console.log(
                "Item id:" + data.id + "was not saved do to " + event.message
              );
            };
          });
        } else {
          req = objectStore.add(value);
          req.onsuccess = (event) => {
            resolve({ status: "ok", msg: "The message was added!" });
          };
          req.onerror = (event) => {
            reject({
              status: "ko",
              msg: event.message,
            });
          };
        }
      };
    });
  }

  updateRow(tableName, index, newValue) {
    return new Promise((resolve, reject) => {
      //Open Database
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        reject({
          status: "ko",
          msg: "Why didn't you allow my web app to use IndexedDB?!",
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        const objectStore = this.db
          .transaction([tableName], "readwrite")
          .objectStore(tableName);
        const req = objectStore.get(index);

        req.onerror = (event) => {
          reject({
            status: "ko",
            msg: "Request on " + tableName + ", index:" + index + ", failed!",
          });
        };

        req.onsuccess = (event) => {
          // Get the old value that we want to update
          //const data = event.target.result;

          // Put this updated object back into the database.
          const requestUpdate = objectStore.put(newValue);
          requestUpdate.onerror = (event) => {
            // Do something with the error
            this.db.close();
            reject({
              status: "ko",
              msg: "Error - the data was not updated!",
            });
          };
          requestUpdate.onsuccess = (event) => {
            // Success - the data is updated!
            this.db.close();
            resolve({
              status: "ok",
              msg: "Success - the data was updated!",
            });
          };
        };
      };
    });
  }

  removeRow(tableName, index) {
    return new Promise((resolve, reject) => {
      //Open Database
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        reject({
          status: "ko",
          msg: event,
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        const request = this.db
          .transaction([tableName], "readwrite")
          .objectStore(tableName)
          .delete(index);
        request.onsuccess = (event) => {
          this.db.close();
          resolve({ status: "ok", msg: "Success - the data was deleted!" });
        };
      };
    });
  }

  selectData(tableName) {
    return new Promise((resolve, reject) => {
      const data = [];
      //Open Database
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        reject({
          status: "ko",
          msg: event,
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        try {
          const objectStore = this.db
            .transaction(tableName)
            .objectStore(tableName);
          objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              data.push(cursor.value);
              cursor.continue();
            } else {
              this.db.close();
              resolve({
                status: "ok",
                msg: "Read with success from database",
                results: data,
              });
            }
          };
        } catch (e) {
          console.log(e.message);
        }
      };
    });
  }

  getMetadata() {
    return new Promise((resolve, reject) => {
      //Open Database
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        reject({
          status: "ko",
          msg: event,
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;

        const objectStore = this.db
          .transaction("metadata")
          .objectStore("metadata");

        if ("getAll" in objectStore) {
          objectStore.getAll().onsuccess = (event) => {
            this.db.close();
            resolve({
              status: "ok",
              msg: "Read with success from database",
              results: event.target.result,
            });
          };
        } else {
          const data = [];
          objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              data.push(cursor.value);
              cursor.continue();
            } else {
              this.db.close();
              resolve({
                status: "ok",
                msg: "Read with success from database",
                results: data,
              });
            }
          };
        }
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        //create metadata table
        if (!this.db.objectStoreNames.contains("metadata")) {
          const objectStore = this.db.createObjectStore("metadata", {
            keyPath: this.metadataSchema.keyPath,
          });
          this.metadataSchema.index.forEach((item) => {
            objectStore.createIndex(item.name, item.name, {
              unique: item.unique,
            });
          });
          this.db.close();
          resolve({
            status: "ok",
            msg: "Table metadata created successfully!",
          });
        } else {
          this.db.close();
          reject({
            status: "ko",
            msg: "Table metadata exist!",
          });
        }
      };
    });
  }

  getAllTables() {
    return new Promise((resolve, reject) => {
      //Open Database
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        reject({
          status: "ko",
          msg: event,
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        if (this.db.objectStoreNames.length === 0) {
          this.db.close();
          this.deleteDb(this.dbName).then((resp) => this.setDbVersion(1));
          resolve({ status: "ok", results: [] });
        } else {
          this.db.close();
          resolve({
            status: "ok",
            results: [...this.db.objectStoreNames],
          });
        }
      };
    });
  }

  deleteTable(tableName) {
    return new Promise((resolve, reject) => {
      //Open Database
      const version = this.setDbVersion(this.dbVersion + 1);
      const request = indexedDB.open(this.dbName, version);

      request.onerror = (event) => {
        reject({
          status: "ko",
          msg: event,
        });
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;

        //if (event.oldVersion < this.dbVersion) {
        try {
          this.db.deleteObjectStore(tableName);
          this.db.close();
          if (
            this.db.objectStoreNames.length === 1 &&
            this.db.objectStoreNames.contains("metadata")
          ) {
            this.deleteDb(this.dbName)
              .then((resp) => {
                this.setDbVersion(1);
                this.getMetadata()
                  .then((resp) => console.log(resp))
                  .catch((e) => console.log(e.message));
              })
              .catch((e) => console.log(e.message));
          }
          resolve({
            status: "ok",
            msg: "Database " + tableName + " was successfully deleted!",
          });
        } catch (e) {
          console.log(e);
          this.db.close();
          reject({
            status: "ko",
            msg: e.message,
          });
        }
        //}
      };
    });
  }

  deleteDb(dbName) {
    return new Promise((resolve, reject) => {
      const DBDeleteRequest = indexedDB.deleteDatabase(dbName);

      DBDeleteRequest.onerror = function(event) {
        reject("Error deleting database.");
      };

      DBDeleteRequest.onsuccess = function(event) {
        // should be undefined
        if (event.result === undefined) {
          resolve("Database deleted successfully");
        } else {
          reject("Error deleting database.");
        }
      };
    });
  }
}

const databaseManager = new indexedDbManager();
export default databaseManager;
