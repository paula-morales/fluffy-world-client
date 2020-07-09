import { combineReducers } from "redux";
import appState from "./appState/reducer";
import user from "./user/reducer";
import profiles from "./profiles/reducer";
import typeOfService from "./typeOfServices/reducer";
import reviews from "./reviews/reducer";
import favorites from "./favorites/reducer";
import userById from "./userById/reducer";

export default combineReducers({
  appState,
  user,
  profiles,
  typeOfService,
  reviews,
  favorites,
  userById,
});
