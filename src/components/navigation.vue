<template lang="pug">
  .navigation-wrap(:style="{height: statusBarHeight + 44 + 'px'}")
    .navigation(:style="{paddingTop: statusBarHeight + 'px', background: back, height: '44px', lineHeight: '44px'}")
      .left
        image(v-if="!hideLeft" mode="widthFix" src="/static/images/left.png" @click="checkLeft")
      .center
        image(v-if="loading" mode="widthFix" src="/static/images/title_loading.gif")
        span {{title}}
      .right
    .loading
      image(mode="widthFix" src="/static/images/top_loading.gif")
</template>

<script>

export default {
  components: {
  },
  props: {
    title: '',
    hideLeft: false,
    loading: {
      type: Boolean,
      default: false
    },
    back: {
      type: String,
      default: '#fff'
    },
    backPath: ''
  },
  methods: {
    checkLeft () {
      if (this.backPath) {
        let isTab = false
        if (this.backPath === '/pages/home/index' || this.backPath === '/pages/my/index') {
          isTab = true
        }
        this.go({ path: this.backPath, isTab: isTab })
      } else {
        this.goBack()
      }
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="stylus">

.navigation-wrap {
  .navigation {
    position fixed
    top 0
    left 0
    display flex
    align-items center
    justify-content space-between
    width 100%
    padding 0 10px
    z-index 98
    .left {
      display flex
      align-items center
      width 30px
    }
    .center {
      display flex
      align-items center
      justify-content center
      width 80px
      color #000
      image {
        width 12px
        margin-right 5px
      }
    }
    .right {
      width 30px
    }
  }
  .loading {
    position relative
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    padding-top 10px
    image {
      width 80px
    }
  }
}
</style>
