import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { promiseMiddleware, localStorageMiddleware } from "./middleware";
import reducer from "./reducer";

import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const getMiddleware = () => {
  if (process.env.NODE_ENV === "production") {
    return applyMiddleware(
      promiseMiddleware,
      localStorageMiddleware
    );
  } else {
    // Enable additional logging in non-production environments.
    return applyMiddleware(
      promiseMiddleware,
      localStorageMiddleware,
    );
  }
};

export const store = createStore(reducer, composeWithDevTools(getMiddleware()));
