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
      canvas#canvas(type="2d" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}")
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      canvas: '',
      canvasWidth: 375,
      canvasHeight: 260,
      startSite: '',
      dpr: wx.getSystemInfoSync().pixelRatio,
      lineResult: [null, null, null]
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
      this.canvas.beginPath()
      this.canvas.lineCap = 'round'
      this.canvas.strokeStyle = 'green'
      this.canvas.lineWidth = 6
      this.canvas.moveTo(siteX * this.dpr, siteY * this.dpr)
    },
    touchMove (e) {
      if (!this.startSite || (this.startSite && this.lineResult[this.startSite - 1] !== null)) {
        return
      }
      this.canvas.lineTo(e.touches[0].x * this.dpr, e.touches[0].y * this.dpr)
      this.canvas.stroke()
      this.canvas.moveTo(e.touches[0].x * this.dpr, e.touches[0].y * this.dpr)
    },
    touchEnd (e) {
      if (!this.startSite || (this.startSite && this.lineResult[this.startSite - 1] !== null)) {
        return
      }
      let siteX = e.changedTouches[0].x
      let siteY = e.changedTouches[0].y
      if (this.startSite === 1) {
        this.lineResult[0] = this.countResult(resultIndex, e.changedTouches[0].x, e.changedTouches[0].y)
        console.log('连线1：', this.lineResult[0])
      } else if (this.startSite === 2) {
        this.lineResult[1] = this.countResult(resultIndex, e.changedTouches[0].x, e.changedTouches[0].y)
        console.log('连线2：', this.lineResult[1])
      } else if (this.startSite === 3) {
        this.lineResult[2] = this.countResult(resultIndex, e.changedTouches[0].x, e.changedTouches[0].y)
        console.log('连线3：', this.lineResult[2])
      }
      this.startSite = ''
    },
    countResult (key, siteX, siteY) {
      if (key === 0) {
        return siteX <= 115 && siteY >= 140
      } else if (key === 1) {
        return siteX <= 230 && siteX > 115 && siteY >= 140
      } else if (key === 2) {
        return siteX > 230 && siteX <= 345 && siteY >= 140
      }
    }
  },
  mounted () {
    setTimeout(() => {
      wx.createSelectorQuery().select('#canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          canvas.width = res[0].width * this.dpr
          canvas.height = res[0].height * this.dpr
          this.canvas = canvas.getContext('2d')
        })
    }, 1500)
  }
}
</script>

<style scoped lang="stylus">

.link-line {
  width 100%
  .main-wrap {
    position relative
    margin-top 50px
    padding 30px 15px
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
    #canvas {
      position absolute
      top 0
      left 0
    }
  }
}
</style>
