const StorageManager = {
  setLocal: function (name, value) {
    if (typeof Storage !== "undefined") {
      // Code for localStorage
      localStorage.setItem(name, value); // Store
      return true;
    } else {
      // Sorry! No Web Storage support..
      return false;
    }
  },

  setLocalJson: function (name, value) {
    if (typeof Storage !== "undefined") {
      // Code for localStorage
      localStorage.setItem(name, JSON.stringify(value)); // Store
      return true;
    } else {
      // Sorry! No Web Storage support..
      return false;
    }
  },

  getLocal: function (name) {
    if (localStorage[name]) {
      return localStorage[name];
    } else {
      return false;
    }
  },

  getLocalJson: function (name) {
    if (localStorage[name]) {
      return JSON.parse(localStorage[name]);
    } else {
      return false;
    }
  },

  removeLocalItem: function (name) {
    if (localStorage[name]) {
      localStorage.removeItem(name);
      return true;
    } else {
      return false;
    }
  },

  setSession: function (name, value) {
    if (typeof Storage !== "undefined") {
      // Code for localStorage
      sessionStorage.setItem(name, JSON.stringify(value)); // Store
      return true;
    } else {
      // Sorry! No Web Storage support..
      return false;
    }
  },

  getSession: function (name) {
    if (sessionStorage[name]) {
      return JSON.parse(sessionStorage[name]);
    } else {
      return false;
    }
  },

  removeSession: function (name) {
    if (sessionStorage[name]) {
      sessionStorage.removeItem(name);
      return true;
    } else {
      return false;
    }
  },
};
export default StorageManager;
