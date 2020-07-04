import { apiUrl } from "../../config/constants";
import axios from "axios";
import { showMessageWithTimeout } from "../appState/actions";

function displayUser(payload) {
  return {
    type: "user_fetched",
    payload,
  };
}

export const getUserById = (id) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`${apiUrl}/user/${id}`);
      dispatch(displayUser(response.data));
    } catch (error) {
      console.log(error.message);
      dispatch(showMessageWithTimeout("danger", true, "Something went wrong"));
    }
  };
};
