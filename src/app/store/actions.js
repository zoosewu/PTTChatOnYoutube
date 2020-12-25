import mutations from './mutations.js';
import types from './mutations_type.js';

export const actions = {
  actionIncrease: ({ commit }) => {
    console.log('actionIncrease');
    commit(types.INCREASE);
  },

  actionDecrease: ({ commit }) => {
    console.log('actionDecrease');
    commit(types.DECREASE);
  },
  setHeight: (context, height) => {
    context.commit(types.SETHEIGHT, height);
  }
}