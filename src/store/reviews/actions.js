import { apiUrl } from "../../config/constants";
import axios from "axios";
import { showMessageWithTimeout } from "../appState/actions";

export function reviewsFetched(payload) {
  return {
    type: "reviews_fetched",
    payload,
  };
}
export function update_reviews(payload) {
  return {
    type: "update_reviews",
    payload,
  };
}

export async function fetchReviews(dispatch, getState) {
  try {
    const res = await axios.get(`${apiUrl}/review`);
    dispatch(reviewsFetched(res.data));
  } catch (e) {
    console.log("error", e.message);
  }
}

export function addReview(rating, comment, profileId) {
  return async function thunk(dispatch, getState) {
    try {
      const token = getState().user.token;

      const res = await axios.post(
        `${apiUrl}/review/`,
        {
          rating,
          comment,
          userServiceId: profileId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(update_reviews(res.data));
      dispatch(
        showMessageWithTimeout("success", true, "Your comment was registered!")
      );
    } catch (e) {
      console.log("error", e.message);
      dispatch(showMessageWithTimeout("danger", true, "Something went wrong"));
    }
  };
}
