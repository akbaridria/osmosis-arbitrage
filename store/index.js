export const state = () => ({
    theme: "dark",
  });
  
  export const mutations = {
    SET_THEME(state, value) {
      state.theme = value;
    },
  };
  