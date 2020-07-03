const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "favorites_fetched": {
      return payload;
    }
    default:
      return state;
  }
};
