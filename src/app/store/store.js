import { state, mutations } from './mutations.js';
import getters from './getters.js';
import actions from './actions.js';
Vue.use(Vuex);

export let store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,

  // 嚴格模式，禁止直接修改 state
  strict: true
});

