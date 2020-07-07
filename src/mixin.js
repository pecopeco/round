import Fly from 'flyio/dist/npm/wx'
const store = require('./store.js').default

let fly = new Fly()
let requestUrl, requestForm
let config = {
  api: 'https://mp.weixin.qq.com'
}

export default {
  components: {
  },
  data () {
    return {
    }
  },
  filters: {
    formatTime (time, yearKey = '-', monthKey = '-', dayKey = '',
      hasHour, hasMinute) {
      let date = new Date(time * 1000)
      let y = 1900 + date.getYear()
      let m = '0' + (date.getMonth() + 1)
      let d = '0' + date.getDate()
      let hour = '0' + date.getHours()
      let minute = '0' + date.getMinutes()
      let resultTime = y + yearKey + m.substring(m.length - 2, m.length) + monthKey + d.substring(d.length - 2, d.length) + dayKey
      if (hasHour && !hasMinute) {
        return resultTime + ' ' + hour.substring(hour.length - 2, hour.length)
      } else if (hasHour && hasMinute) {
        return resultTime + ' ' + hour.substring(hour.length - 2, hour.length) + ':' + minute.substring(minute.length - 2, minute.length)
      }
      return resultTime
    }
  },
  methods: {
    go (path) {
      this.$router.push(path)
    },
    goBack (key) {
      if (key) {
        this.$router.go(key)
      } else {
        this.$router.back()
      }
    },
    toast (text, delay) {
      setTimeout(function () {
        Megalo.showToast({ title: text, icon: 'none', duration: delay || 1000 })
      }, 100)
    },
    postUserInfo (userInfo) {
      this.http.post('/v1/profile/profile', {
        info: userInfo
      })
    },
    http (url, form = {}, type) {
      // 拦截重复请求
      if ((requestUrl === url && this.isObjectValueEqual(requestForm, form)) || (url === '/site/wx' && requestUrl === url)) {
        return
      }
      requestUrl = url
      requestForm = JSON.parse(JSON.stringify(form))
      let compleForm = form
      // let presetForm = {
      //   orgName: 123456
      // }
      // Object.assign(compleForm, presetForm)
      let transUrl = url.indexOf('http') !== -1 ? url : this.config.api + url
      return fly.request(transUrl, compleForm, {
        method: type,
        headers: {
          cookie: 'PHPSESSION=' + Megalo.getStorageSync('token') || ''
        },
        timeout: 10000
      }).then((res) => {
        // 重复请求延迟
        setTimeout(() => {
          requestUrl = ''
          requestForm = {}
        }, 300)
        if (type === 'delete' || res.status === 204) {
          return res.text()
        } else if (res.status === 200) {
          return res.data
        } else {
          this.toast(JSON.parse(res.data).error.msg)
        }
      }).catch((err) => {
        // 重复请求延迟
        setTimeout(() => {
          requestUrl = ''
          requestForm = {}
        }, 300)
        const codeMessage = {
          200: '服务器成功返回请求的数据.',
          201: '新建或修改数据成功.',
          202: '一个请求已经进入后台排队（异步任务）.',
          204: '删除数据成功.',
          400: '发出的请求有错误，服务器没有进行新建或修改数据的操作.',
          401: '用户没有权限（令牌、用户名、密码错误）.',
          403: '用户得到授权，但是访问是被禁止的.',
          404: '发出的请求针对的是不存在的记录，服务器没有进行操作.',
          406: '请求的格式不可得',
          410: '请求的资源被永久删除，且不会再得到的.',
          422: '当创建一个对象时，发生一个验证错误.',
          500: '服务器发生错误，请检查服务器.',
          502: '网关错误',
          503: '服务不可用，服务器暂时过载或维护.',
          504: '网关超时'
        }
        if (err.status === 401) {
          // 意外丢失skey
          store.dispatch('setSkeyStatus')
        }
        if (err.status >= 300) {
          const errortext = codeMessage[err.status] || err.response.statusText
          this.toast(errortext)
        }
      })
    },
    setHttp () {
      this.http.get = (url, form) => this.http(url, form, 'get')
      this.http.post = (url, form) => this.http(url, form, 'post')
      this.http.delete = (url, form) => this.http(url, form, 'delete')
      this.http.put = (url, form) => this.http(url, form, 'put')
    },
    // 判断两个对象属性是否完全相同
    isObjectValueEqual (objA, objB) {
      let aProps = Object.getOwnPropertyNames(objA)
      let bProps = Object.getOwnPropertyNames(objB)
      if (aProps.length !== bProps.length) {
        return false
      }
      for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i]
        let propA = objA[propName]
        let propB = objB[propName]
        if (typeof (propA) === 'object') {
          if (this.isObjectValueEqual(propA, propB)) {
            return true
          } else {
            return false
          }
        } else if (propA !== propB) {
          return false
        }
      }
      return true
    },
    // 表单验证
    validate (arr) {
      let err
      arr.some((item) => {
        // 数字转换字符串
        if (typeof (item.key) === 'number') {
          item.key = item.key.toString()
        }
        // 验证非空
        if (!item.key || item.key.match(/^[ ]+$/)) {
          err = '请填写' + item.name
          return
        }
        // 验证姓名
        if (item.type === 'name' && (!/^[\u4e00-\u9fa5]+$/.test(item.key) || item.key.length < 2)) {
          err = '请输入正确的' + item.name
          return
        }
        // 验证手机号
        if (item.type === 'phone' && !(item.key.length === 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(item.key))) {
          err = '请输入正确的' + item.name
          return
        }
        // 验证身份证号
        if (item.type === 'idCard' && !/^\d{6}(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(item.key)) {
          err = '请输入正确的' + item.name
        }
        // 验证金额
        if (item.type === 'price' && ((!Number.isFinite(Number(item.key)) || Number(item.key) <= 0) || (item.key.split('.')[1] && item.key.split('.')[1].length > 2))) {
          err = '请输入正确的' + item.name
        }
      })
      return err
    },
    update () {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log('是否有版本更新：', res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        Megalo.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        Megalo.showToast({
          title: '更新版本失败！',
          icon: 'none'
        })
      })
    },
    netListen () {
      Megalo.onNetworkStatusChange((res) => {
        if (res.networkType === 'none') {
          Megalo.showToast({
            title: '网络出问题了哦...',
            icon: 'none'
          })
        } else {
          Megalo.showToast({
            title: `已连接上网络`,
            icon: 'none'
          })
        }
      })
    },
    // 手机号验证
    isPhone (key) {
      return !(key.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(key))
    },
    // 数组随机排序
    randomArray (arr) {
      if (!(arr instanceof Array)) {
        console.error('生成随机数组调用失败：参数类型不正确')
        return
      }
      if (arr.length < 2) {     //大于1才有随机性
        return arr
      }
      let arrSource = arr.slice()          //复制源数组
      let arrTarget = []              //存储结果的数组
      f()
      function f () {
        if (arrSource.length < 2) {         //只有一个元素，随机完成
          arrTarget.push(arrSource[0])
          return
        }
        let min = 0
        let max = arrSource.length - 1
        let index = random(min, max)
        arrTarget.push(arrSource.splice(index, 1)[0])   //取出随机项
        f()    //递归执行随机
      }
      function random (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min) //1去掉则不含尾
      }
      return arrTarget
    }
  },
  computed: {
    config () {
      return config
    },
    statusBarHeight () {
      return this.store.state.statusBarHeight
    },
    userInfo () {
      return this.store.state.userInfo
    },
    missingSkey () {
      return this.store.state.missingSkey
    }
  },
  watch: {
  },
  mounted () {
    this.setHttp()
  },
  beforeDestory () {
  }
}
