
interface State {
  themeColor: string;
}

const state: State = {
  themeColor: '#09bf89',
};

const getters = {
};

const mutations = {
  CHANGE_THEME_COLOR(state: State, paylod: any): void {
    state.themeColor = paylod.themeColor;
  },
};

const actions = {
  CHANGE_THEME_COLOR(context: any, paylod: any) {
    context.commit('CHANGE_THEME_COLOR', paylod);
  },
};

export default {
  state,
  actions,
  getters,
  mutations,
};
