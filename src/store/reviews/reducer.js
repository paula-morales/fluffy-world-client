const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "reviews_fetched": {
      return payload;
    }
    case "update_reviews": {
      return payload;
    }
    default:
      return state;
  }
};
