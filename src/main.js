import App from './App'
import Vue from 'vue'
import VHtmlPlugin from '@megalo/vhtml-plugin'
import Vuex from 'vuex'
import mixin from './mixin'
import MegaloRouterPatch from 'megalo-router-patch'

Vue.use(MegaloRouterPatch)
Vue.use(VHtmlPlugin)
Vue.use(Vuex)
Vue.mixin(mixin)

const store = require('./store.js').default
Vue.prototype.store = store

let methods = mixin.methods
methods.setHttp()

const app = new Vue(App)

app.$mount()

export default {
  config: {
    pages: [
      'pages/round/index',
      'pages/line/index'
    ],
    window: {
      navigationStyle: 'custom',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'title',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#333',
      selectedColor: '#007d37',
      list: [
        {
          pagePath: 'pages/round/index',
          text: 'round',
          iconPath: 'native/tabbar/home.png',
          selectedIconPath: 'native/tabbar/home_on.png'
        },
        {
          pagePath: 'pages/line/index',
          text: 'line',
          iconPath: 'native/tabbar/home.png',
          selectedIconPath: 'native/tabbar/home_on.png'
        }
      ]
    }
  }
}
