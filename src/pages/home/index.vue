<template lang="pug">
  .home
    navigation(title="首页" :hideLeft="true")
    .round
      .back
        image(mode="scaleToFill" src="/static/images/turnplate-bg.png")
      .pointer(@click="start")
        image(mode="widthFix" src="/static/images/pointer.png")
      .round-wrap
        .item
          .prize-wrap
            span 物品1
            image(mode="widthFix" src="/static/images/prize-1.png")
        .item
          .prize-wrap
            span 物品2
            image(mode="widthFix" src="/static/images/prize-2.png")
        .item
          .prize-wrap
            span 物品3
            image(mode="widthFix" src="/static/images/prize-3.png")
        .item
          .prize-wrap
            span 物品4
            image(mode="widthFix" src="/static/images/prize-4.png")
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      timer: ''
    }
  },
  methods: {
    start () {
      if (this.timer) {
        return
      }
      // 随机停止位置
      let final = Math.floor(Math.random() * 361)
      // 旋转速度
      let speed = 5000
      this.$mp.page.animate('.pointer', [
        {rotate: 0, ease: 'ease-out'},
        {rotate: 36000 + final, ease: 'ease-out'}
      ], speed)
      // 外部转盘旋转
      this.$mp.page.animate('.back', [
        {rotate: 0, ease: 'ease-out'},
        {rotate: -(500 + final), ease: 'ease-out'}
      ], speed)
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = ''
        if (final >= 0 && final < 90) {
          console.log('物品2')
        } else if (final >= 90 && final < 180) {
          console.log('物品4')
        } else if (final >= 180 && final < 270) {
          console.log('物品3')
        } else if (final >= 270 && final < 360) {
          console.log('物品1')
        }
      }, speed)
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="stylus">

.home {
  display flex
  align-items center
  justify-content center
  .round {
    position relative
    display flex
    align-items center
    justify-content center
    width 220px
    height 220px
    .back {
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      image {
        width 100%
        height 100%
      }
    }
    .pointer {
      position absolute
      top 0
      left 0
      display flex
      align-items center
      justify-content center
      width 100%
      height 100%
      z-index 3
      image {
        width 50px
      }
    }
    .round-wrap {
      position relative
      display flex
      flex-wrap wrap
      width 80%
      height 80%
      z-index 2
      border-radius 50%
      overflow hidden
      .item {
        display flex
        align-items center
        justify-content center
        width 50%
        height 50%
        &:nth-child(1) {
          background #ffb933
          .prize-wrap {
            padding-top 10px
            padding-left 10px
            transform rotate(-45deg)
          }
        }
        &:nth-child(2) {
          background #ffe8b5
          .prize-wrap {
            padding-top 10px
            padding-right 10px
            transform rotate(45deg)
          }
        }
        &:nth-child(3) {
          background #ffe8b5
          .prize-wrap {
            padding-top 10px
            padding-left 10px
            transform rotate(-135deg)
          }
        }
        &:nth-child(4) {
          background #ffb933
          .prize-wrap {
            padding-top 10px
            padding-right 10px
            transform rotate(135deg)
          }
        }
        .prize-wrap {
          display flex
          flex-direction column
          align-items center
          justify-content center
          span {
            padding-bottom 5px
            font-size 13px
          }
          image {
            width 20px
          }
        }
      }
    }
  }
}
</style>
