import { combineReducers } from "redux";
import { authReducer } from "../../../authentication/redux/reducers/auth.reducer";

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
