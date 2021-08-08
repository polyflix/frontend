import { combineReducers } from "redux";
import { authReducer } from "../../../authentication/redux/reducers/auth.reducer";
import { subtitleImprovementReducer } from "../../../subtitles/redux/reducers/subtitle-improvement.reducer";
import { serverStateReducer } from "./serverState.reducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  serverState: serverStateReducer,
  subtitleImprovement: subtitleImprovementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
