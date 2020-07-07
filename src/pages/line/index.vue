<template lang="pug">
  .link-line
    navigation(title="连线" :hideLeft="true")
    .main-wrap
      .img-list
        .item
          image(mode="widthFix" src="/static/images/turnplate-bg.png")
        .item
          image(mode="widthFix" src="/static/images/turnplate-bg.png")
        .item
          image(mode="widthFix" src="/static/images/turnplate-bg.png")
      .option-list
        .item.bold
          span desk
        .item.bold
          span chair
        .item.bold
          span door
      canvas.canvas(type="2d" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd")
    .sub-wrap
      .tool-wrap
        .back-btn(v-if="isEnd && $route.query.fromPage == 'reviewList'" @click="goBack(2)") 返回列表
        .toolbar(v-else)
          .left
            image(v-if="$route.query.fromPage == 'reviewList' && checkIndex != 0" @click="$emit('last')" mode="widthFix" src="http://media.talkdoo.com/appletstudent/review/chevron_left.svg")
          .center
          .next-btn
            image(v-if="(fromPage == 'classDetail' && data.score >= 0 && data.score !== '') || $route.query.fromPage == 'reviewList'" mode="widthFix" src="http://media.talkdoo.com/appletstudent/review/next_btn.svg" @click="$emit('next')")
      .sub-btn
        button(
          v-if="data && fromPage == 'test' && showBtn"
          @click="checkAnswer"
          :loading="loading"
          :type="data.score !== '' && data.score < 60 ? 'warn' : 'primary'"
        ) {{data | btnText}}
</template>

<script>

export default {
  components: {
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    isEnd: {
      type: Boolean,
      default: false
    },
    checkIndex: {
      type: Number,
      default: 0
    },
    showStage: {
      type: Boolean,
      default: false
    },
    countdown: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      fromPage: this.$route.query.fromPage,
      transData: this,
      tipsAudioCtx: '',
      showBtn: false,
      loading: false,
      canvas: '',
      startSite: '',
      lineResult: [null, null, null]
    }
  },
  watch: {
    checkIndex () {
      // 题型不变，重置状态
      this.transData = this
      this.showBtn = false
      this.loading = false
      this.canvas = ''
      this.startSite = ''
      if (!this.showStage) {
        this.$emit('countdown')
      }
    },
    showStage () {
      // 页面显示
      if (!this.showStage) {
        this.$emit('countdown')
      }
    },
    countdown () {
      if (this.countdown == 0) {
        this.showBtn = true
        this.checkAnswer()
      }
    }
  },
  filters: {
    btnText (data) {
      if (data.score === '') {
        return 'Submit'
      } else if (data.score < 60) {
        return 'Error'
      } else {
        return 'Correct'
      }
    }
  },
  methods: {
    touchStart (e) {
      let siteX = e.touches[0].x
      let siteY = e.touches[0].y
      if (siteX <= 115 && siteY <= 120) {
        this.startSite = 1
      } else if (siteX <= 230 && siteX > 115 && siteY <= 120) {
        this.startSite = 2
      } else if (siteX <= 345 && siteY <= 120) {
        this.startSite = 3
      } else {
        this.startSite = ''
      }
      this.canvas.moveTo(siteX - (siteX / 8), e.touches[0].y - (e.touches[0].y / 4))
    },
    touchMove (e) {
      if (this.startSite && this.lineResult[this.startSite - 1] !== null) {
        return
      }
      let trueSiteX = e.touches[0].x - (e.touches[0].x / 8)
      let trueSiteY = e.touches[0].y - (e.touches[0].y / 4)
      this.canvas.lineTo(trueSiteX, trueSiteY)
      this.canvas.stroke()
      this.canvas.moveTo(trueSiteX, trueSiteY)
    },
    touchEnd (e) {
      if (this.startSite && this.lineResult[this.startSite - 1] !== null) {
        return
      }
      let siteX = e.changedTouches[0].x
      let siteY = e.changedTouches[0].y
      if (this.startSite === 1) {
        this.lineResult[0] = siteX <= 115 && siteY >= 140
        console.log('连线1：', this.lineResult[0])
      } else if (this.startSite === 2) {
        this.lineResult[1] = siteX <= 230 && siteX > 115 && siteY >= 140
        console.log('连线2：', this.lineResult[1])
      } else if (this.startSite === 3) {
        this.lineResult[2] = siteX <= 345 && siteY >= 140
        console.log('连线3：', this.lineResult[2])
      }
      this.startSite = ''
    }
  },
  mounted () {
    // 提示音播放器
    this.tipsAudioCtx = Megalo.createInnerAudioContext()
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.select('.canvas').node().exec((res) => {
        const canvas = res[0].node
        this.canvas = canvas.getContext('2d')
        this.canvas.beginPath()
        this.canvas.lineCap = 'round'
        this.canvas.strokeStyle = 'green'
        this.canvas.lineWidth = 4
      })
    }, 1000)
  }
}
</script>

<style scoped lang="stylus">

.link-line {
  width 100%
  .main-wrap {
    position relative
    width 345px
    height 200px
    margin 80px 15px 0
    .img-list {
      display flex
      .item {
        flex 1
        display flex
        align-items center
        justify-content center
        image {
          width 80px
        }
      }
    }
    .option-list {
      display flex
      padding-top 80px
      .item {
        flex 1
        display flex
        align-items center
        justify-content center
        height 40px
        span {
          display flex
          align-items center
          justify-content center
          width 90px
          height 30px
          border 5px solid #ffb933
          border-radius 10px
        }
      }
    }
    .canvas {
      position absolute
      top 0
      left 0
      width 100%
      height 100%
    }
  }
  .sub-wrap {
    position absolute
    left 0
    bottom 0
    width 100%
    .tool-wrap {
      display flex
      align-items center
      justify-content center
      .back-btn {
        display flex
        align-items center
        justify-content center
        width 90%
        height 40px
        border-radius 20px
        background theme
        color #fff
      }
      .toolbar {
        width 100%
        display flex
        justify-content space-between
        .left {
          display flex
          align-items center
          justify-content center
          width 98px
          image {
            width 50px
            height 50px
          }
        }
        .next-btn {
          display flex
          align-items center
          justify-content center
          width 98px
          image {
            width 50px
            height 50px
          }
        }
      }
    }
    .sub-btn {
      width 100%
      height 50px
      margin-top 30px
      button {
        width 100%
        height 100%
        border-radius 0
      }
    }
  }
}
</style>
