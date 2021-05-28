import { combineReducers } from "redux";
import { authReducer } from "../../../authentication/redux/reducers/auth.reducer";
import { serverStateReducer } from "./serverState.reducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  serverState: serverStateReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
