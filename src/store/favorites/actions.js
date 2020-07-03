import { apiUrl } from "../../config/constants";
import axios from "axios";
import { showMessageWithTimeout } from "../appState/actions";

export function favoritesFetched(payload) {
  return {
    type: "favorites_fetched",
    payload,
  };
}

export async function fetchFavorites(dispatch, getState) {
  try {
    const token = getState().user.token;
    console.log("token");
    const res = await axios.get(`${apiUrl}/user/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(favoritesFetched(res.data));
  } catch (e) {
    console.log("error", e.message);
    dispatch(showMessageWithTimeout("danger", true, "Something went wrong"));
  }
}
