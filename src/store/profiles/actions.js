import { apiUrl } from "../../config/constants";
import axios from "axios";
import { showMessageWithTimeout } from "../appState/actions";

export function profilesFetched(payload) {
  return {
    type: "profiles_fetched",
    payload,
  };
}

export function fetchProfilesByDistance(serviceId, lat, lng, km) {
  return async function thunk(dispatch, getState) {
    try {
      const res = await axios.get(
        `${apiUrl}/userservice/${serviceId}/${lat}/${lng}/${km}`
      );
      dispatch(profilesFetched(res.data));
    } catch (e) {
      console.log("error", e);
      if (e.message === "Request failed with status code 404") {
        dispatch(
          showMessageWithTimeout(
            "warning",
            true,
            "There are not candidates in this area"
          )
        );
      } else {
        dispatch(
          showMessageWithTimeout("danger", true, "Something went wrong")
        );
      }
    }
  };
}

export async function fetchProfiles(dispatch, getState) {
  try {
    const res = await axios.get(`${apiUrl}/userservice`);
    dispatch(profilesFetched(res.data));
  } catch (e) {
    console.log("error", e.message);
    dispatch(showMessageWithTimeout("danger", true, "Something went wrong"));
  }
}

export function sendEmail(id, date, time, message, serviceId) {
  return async function thunk(dispatch, getState) {
    try {
      const token = getState().user.token;

      const res = await axios.post(
        `${apiUrl}/userservice/contact/`,
        {
          mailToId: id,
          date,
          time,
          message,
          serviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      dispatch(
        showMessageWithTimeout("success", true, "Your request was sent!")
      );
    } catch (e) {
      console.log("error", e.message);
      dispatch(showMessageWithTimeout("danger", true, "Something went wrong"));
    }
  };
}

export function registerPet(
  name,
  description,
  picture,
  availableFrom,
  availableUntil
) {
  return async function thunk(dispatch, getState) {
    try {
      const token = getState().user.token;

      const res = await axios.post(
        `${apiUrl}/userservice/registerpet/`,
        {
          name,
          description,
          picture,
          availableFrom,
          availableUntil,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      dispatch(
        showMessageWithTimeout("success", true, "Your pet was registered!")
      );
    } catch (e) {
      console.log("error", e.message);
      dispatch(showMessageWithTimeout("danger", true, "Something went wrong"));
    }
  };
}

export function registerService(
  title,
  price,
  description,
  picture,
  serviceId,
  availableFrom,
  availableUntil
) {
  return async function thunk(dispatch, getState) {
    try {
      const token = getState().user.token;

      const res = await axios.post(
        `${apiUrl}/userservice/registerservice/`,
        {
          title,
          price,
          description,
          picture,
          serviceId,
          availableFrom,
          availableUntil,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      dispatch(
        showMessageWithTimeout("success", true, "Your service was registered!")
      );
    } catch (e) {
      console.log("error", e.message);
      dispatch(showMessageWithTimeout("danger", true, "Something went wrong"));
    }
  };
}
