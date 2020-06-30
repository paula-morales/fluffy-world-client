import { apiUrl } from "../../config/constants";
import axios from "axios";

export function profilesFetched(payload) {
  return {
    type: "profiles_fetched",
    payload,
  };
}

export function fetchProfilesByDistance(serviceId, lat, lng) {
  return async function thunk(dispatch, getState) {
    try {
      const res = await axios.get(
        `${apiUrl}/userservice/${serviceId}/${lat}/${lng}`
      );
      dispatch(profilesFetched(res.data));
    } catch (e) {
      console.log("error", e.message);
    }
  };
}
export async function fetchProfiles(dispatch, getState) {
  try {
    const res = await axios.get(`${apiUrl}/userservice`);
    dispatch(profilesFetched(res.data));
  } catch (e) {
    console.log("error", e.message);
  }
}
