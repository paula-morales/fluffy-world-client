import { apiUrl } from "../../config/constants";
import axios from "axios";
import { showMessageWithTimeout } from "../appState/actions";

export function favoritesFetched(payload) {
  return {
    type: "favorites_fetched",
    payload,
  };
}

export function newFavorite(payload) {
  return {
    type: "add_favorite",
    payload,
  };
}

export function removeFavorite(payload) {
  return {
    type: "remove_favorite",
    payload,
  };
}

export async function fetchFavorites(dispatch, getState) {
  try {
    const token = getState().user.token;
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

export function toggleFavorite(idUserService, isFavorite) {
  return async function thunk(dispatch, getState) {
    try {
      const token = getState().user.token;

      if (!isFavorite) {
        const res = await axios.post(
          `${apiUrl}/user/favorites/add`,
          { idUserService },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response", res.data);
        dispatch(newFavorite([res.data]));
      } else if (isFavorite) {
        const res = await axios.delete(
          `${apiUrl}/user/favorites/remove/${isFavorite.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        dispatch(removeFavorite(isFavorite.id));
      } else {
        dispatch(
          showMessageWithTimeout(
            "danger",
            true,
            "Something went wrong with your fav"
          )
        );
      }
    } catch (e) {
      console.log("error", e.message);
      dispatch(showMessageWithTimeout("danger", true, "Something went wrong"));
    }
  };
}
