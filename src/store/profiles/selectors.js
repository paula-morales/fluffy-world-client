export const profilesByIdSelector = (id) => (state) => {
  return state.profiles.find((profile) => {
    return profile.userId === id;
  });
};

export const profilesSelector = (state) => {
  return state.profiles;
};
