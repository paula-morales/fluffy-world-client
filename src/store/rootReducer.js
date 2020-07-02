import { combineReducers } from "redux";
import appState from "./appState/reducer";
import user from "./user/reducer";
import profiles from "./profiles/reducer";
import typeOfService from "./typeOfServices/reducer";
import reviews from "./reviews/reducer";

export default combineReducers({
  appState,
  user,
  profiles,
  typeOfService,
  reviews,
});
