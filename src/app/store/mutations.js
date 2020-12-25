import types from './mutations_type.js';

// state
export const state = {
  count: 0,
  pluginHeight: GM_getValue(types.SETHEIGHT, 450)
}
// mutations
export const mutations = {
  // action 發出 commit 會對應到 mutation 使用的是 Object key 方式
  [types.INCREASE](state) {
    // 在 mutation 改變 state（只有 mutation 可以改變！）
    state.count += 1;
  },
  [types.DECREASE](state) {
    state.count -= 1;
  },
  [types.SETHEIGHT](state, height) {
    state.pluginHeight = height;
    GM_setValue(types.SETHEIGHT, height);
  },
}