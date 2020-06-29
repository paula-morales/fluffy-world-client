export const profilesByServiceIdSelector = (id) => (state) => {
  return state.profiles.filter((profile) => {
    return profile.serviceId === id;
  });
};

export const profilesSelector = (state) => {
  return state.profiles;
};
