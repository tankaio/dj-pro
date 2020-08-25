<template>
  <div class="x-active-button" :class="active ? cls : ''" @click="onClick">
    <slot></slot>
    <i></i>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'x-active-button',
  props: {
    cls: [String, Array, Object],
    idx: [String, Number],
    max: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      active: false,
      index: ''
    }
  },
  computed: {
    ...mapGetters(['getNumberList'])
  },
  methods: {
    ...mapMutations(['setNumberList']),
    onClick() {
      let res
      if (this.active) {
        res = this.getNumberList.filter(v => v !== this.idx)
      } else {
        if (this.getNumberList.length === this.max) {
          this.$emit('limit')
          return
        }

        res = this.getNumberList
        res.push(this.idx)
      }
      this.active = !this.active
      this.setNumberList(res)
      this.$emit('click')
    }
  },
  created() {
    let resetBtn = () => {
      this.active = false
      this.index = ''
    }
    this.$eventBus.$on('reset_btn', resetBtn)
    this.$once('hook:destroyed', () => this.$eventBus.$off('reset_btn'), resetBtn)
  }
}
</script>
