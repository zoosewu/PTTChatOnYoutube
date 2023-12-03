import { state, mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,

  // 嚴格模式，禁止直接修改 state
  strict: true
})
