import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers/root.reducer";
import { composeWithDevTools } from "redux-devtools-extension";

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
