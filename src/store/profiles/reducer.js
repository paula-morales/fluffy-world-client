const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "profiles_fetched": {
      return payload;
    }

    default:
      return state;
  }
};
