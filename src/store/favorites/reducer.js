const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "favorites_fetched": {
      return payload;
    }
    case "add_favorite": {
      return [...state, ...payload];
    }
    case "remove_favorite": {
      return [...state.filter((favorite) => favorite.id !== payload)];
    }
    default:
      return state;
  }
};
