import Vue from 'vue'
import Vuex from 'vuex'

import tagsView from './modules/tagsView'
import getters from './getters'
import shops from './modules/shops'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    tagsView,
    shops
  },
  getters,
  
})

export default store
