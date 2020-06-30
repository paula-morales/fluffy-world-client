import { apiUrl } from "../../config/constants";
import axios from "axios";

export function profilesFetched(payload) {
  return {
    type: "profiles_fetched",
    payload,
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
