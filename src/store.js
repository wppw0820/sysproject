import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isDetailsPage:false,
  },
  mutations: {
    setMark(state, params){
      state.isDetailsPage = params
    }
  },
  actions: {

  }
})
