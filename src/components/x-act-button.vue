<template>
  <van-button class="x-act-button" size="small" :type="type" @click="onActive" :class="idx === active ? cls : ''" v-bind="$props">
    <slot></slot>
    <i></i>
  </van-button>
</template>

<script>
export default {
  name: 'x-act-button',
  props: {
    idx: [Number, String],
    cls: [String, Array, Object],
    active: [Number, String],
    disable: Boolean,
    type: {
      type: String,
      default: 'default'
    },
    group: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'active',
    event: 'active'
  },
  methods: {
    onActive() {
      if (this.disable) return
      if (this.group && G.isStr(this.group)) {
        let [prefix] = this.group.split('_')
        let [idx_prefix] = this.idx.split('_')

        if (prefix !== idx_prefix) {
          this.$emit('clear', prefix)
        }
        this.$emit('active', this.idx)
        this.$emit('update:group', this.idx)
      } else {
        this.$emit('active', this.idx)
        this.$emit('update:group', this.idx)
      }
    }
  },
  created() {
    let resetBtn = () => {
      this.$emit('active', '')
      this.$emit('update:group', '')
    }
    this.$eventBus.$on('reset_btn', resetBtn)
    this.$on('hook:destroyed', () => {
      this.$eventBus.$off('reset_btn', resetBtn)
    })
  }
}
</script>

<style lang="scss"></style>
