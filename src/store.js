import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    statusBarHeight: '',
    missingSkey: false,
    userInfo: ''
  },
  actions: {
    setStatusBarHeight: ({ commit }, data) => {
      commit('setStatusBarHeight', data)
    },
    setUser: ({ commit }, data) => {
      commit('setUser', data)
    },
    setSkeyStatus: ({ commit }) => {
      commit('setSkeyStatus')
    }
  },
  mutations: {
    setStatusBarHeight (state, data) {
      state.statusBarHeight = data
    },
    setUser (state, data) {
      state.userInfo = data
    },
    setSkeyStatus (state) {
      state.missingSkey = !state.missingSkey
    }
  },
  getters: {}
})

export default store
