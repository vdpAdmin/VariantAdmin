import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    reLoginFlag: false
  },
  mutations: {
    setReLoginFlag(state, payload) {
      state.reLoginFlag = payload.reLoginFlag
    }
  },
  actions: {
  },
  modules: {
  }
})
