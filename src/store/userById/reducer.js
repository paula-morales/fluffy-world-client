const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "user_fetched":
      return payload;

    default:
      return state;
  }
};
