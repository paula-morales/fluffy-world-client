const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "services_fetched": {
      return payload;
    }
    default:
      return state;
  }
};
