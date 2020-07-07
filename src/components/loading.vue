<template lang="pug">
  .loading
    image(mode="widthFix" src="/static/images/loading.gif")
</template>

<script>

export default {
  props: {
  },
  components: {
  },
  data () {
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style scoped lang="stylus">

.loading {
  display flex
  align-items center
  justify-content center
  width 100%
  height 140px
  image {
    width 26px
  }
}
</style>
