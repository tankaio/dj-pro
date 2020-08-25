<template>
  <div class="x-sticky" :class="keyClass" :style="{ height: `${height}px` }">
    <div class="xs__middle" :class="xsMiddleClass" :style="{ position, top: `${top / 100}rem` }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'x-sticky',
  props: {
    offsetTop: {
      type: Number,
      default: 44
    }
  },
  data() {
    return {
      keyClass: '',
      xsMiddleClass: '',
      height: 0,
      position: 'relative',
      top: 0
    }
  },
  methods: {
    updateHeight() {
      this.$nextTick(() => {
        if (this.$xsMiddle) {
          this.height = $(this.$xsMiddle).height()
        }
      })
    },
    stickyJudge() {
      let offsetTop = $(this.$sticky).offset().top
      let scrollTop = window.scrollY
    //   console.log(offsetTop, this.offsetTop, scrollTop)

      if (scrollTop + this.offsetTop - offsetTop > -5) {
        this.position = 'fixed'
        this.top = this.offsetTop
        this.$emit('sticky')
      } else {
        this.position = ''
        this.top = 0
        this.$emit('unsticky')
      }
    }
  },
  created() {
    let key = Math.random()
    this.keyClass = `xs-${key}`
    this.xsMiddleClass = `xsm-${key}`
    this.onScroll = G.throttle(e => this.stickyJudge(), 100)
    window.addEventListener('scroll', this.onScroll)
  },
  mounted() {
    this.$sticky = document.getElementsByClassName(this.keyClass)[0]
    this.$xsMiddle = document.getElementsByClassName(this.xsMiddleClass)[0]
    this.updateHeight()
  },
  updated() {
    this.updateHeight()
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="scss">
.xs__middle {
  left: 0;
  right: 0;
  z-index: 1;
  background-color: $white;
}
</style>
