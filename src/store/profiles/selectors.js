export const profilesByIdSelector = (id) => (state) => {
  return state.profiles.find((profile) => {
    return profile.id === id;
  });
};

export const profilesSelector = (state) => {
  return state.profiles;
};
