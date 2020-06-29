import { apiUrl } from "../../config/constants";
import axios from "axios";

export function servicesFetched(payload) {
  return {
    type: "services_fetched",
    payload,
  };
}

export async function fetchServices(dispatch, getState) {
  try {
    const res = await axios.get(`${apiUrl}/service`);
    dispatch(servicesFetched(res.data));
  } catch (e) {
    console.log("error", e.message);
  }
}
