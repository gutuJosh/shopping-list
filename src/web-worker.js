/* eslint-disable no-restricted-globals */

const serviceWorker = () => {
  if (typeof indexedDB !== "undefined") {
    postMessage({
      status: "ok",
      msg: "IndexedDB api is supported in this browser!",
    });
  } else {
    postMessage({
      status: "ko",
      msg: "IndexedDB not supported in this browser!",
    });
    return;
  }
};
export default serviceWorker;
