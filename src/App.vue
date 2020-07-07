<script>
export default {
  watch: {
    missingSkey () {
      // 检测skey是否意外丢失，尝试重新登录
      console.log('skey丢失，重新登录')
      this.doLogin()
    }
  },
  methods: {
    checkSession () {
      // 首次登录
      if (!Megalo.getStorageSync('token')) {
        console.log('首次登录')
        this.doLogin()
        return
      }
      // 检查 session_key 是否过期
      Megalo.checkSession({
        success: () => {
          console.log('未过期')
        },
        fail: () => {
          console.log('skey过期，重新登录')
          this.doLogin()
        }
      })
    },
    doLogin () {
      // 获取code，换取skey
      Megalo.login({
        success: res => {
          this.fetchSkey(res.code)
        },
        fail (err) {
          console.error('login fail: ', err)
        }
      })
    },
    async fetchSkey (code) {
      let data = await this.http.get('/site/wx', { code: code })
      if (data && data.skey) {
        Megalo.setStorageSync('token', data.skey)
      }
    },
    getStatusBarHeight () {
      Megalo.getSystemInfo({
        success: (res) => {
          this.store.dispatch('setStatusBarHeight', res.statusBarHeight)
        }
      })
    }
  },
  onLaunch () {
    this.getStatusBarHeight()
    // 版本更新
    this.update()
    // 网络监测
    this.netListen()
    // this.checkSession()
  }
}
</script>

<style lang="stylus">

page {
  height 100%
  color #555555
  font-size 14px
  & > div {
    min-height 100%
    background #fff
  }
}
image {
  width 100%
  height 100%
}
.theme {
  color theme
}
.red {
  color red
}
.gray {
  color fontGray
}
.bold {
  font-weight bold
}
.empty-tips,.loading {
  display flex
  align-items center
  justify-content center
  height 140px
  font-size 14px
  image {
    width 30px
    height 30px
  }
}
button {
  display flex
  align-items center
  justify-content center
  width 90%
  height 52px
  padding 0
  margin 0 auto
  line-height 0
  border-radius 8px
  background theme
  color #fff
  &::after {
    border none
  }
}
input {
  background backGray
}
.input-placeholder {
  color fontGray
  font-size 16px
  font-weight normal
}
</style>
