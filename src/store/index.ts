import { createStore } from 'vuex';
import contract from './modules/contract';
import user from './modules/user';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    contract,
    user
  },
  plugins: [createPersistedState()], // 添加持久化插件
});