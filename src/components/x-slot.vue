<script>
/**
 * 这个组件的意图为，将当前组件的父组件下其他组件的 slot 提取出来
 */
export default {
  name: 'x-slot',
  props: [
    'name', // 目标组件的插槽的名称
    'idx', // 当前组件x-slot 的 key
    'target', // 目标组件的 key
    'cls' // 提出的slot 的外包dom类名,
  ],
  render(h) {
    let slots
    let slostFun = () => {}

    this.$parent.$children.forEach(item => {
      // 由于父组件下拥有不同的子组件，
      // 使用子组件上的 key 来确定和当前 x-slot 的映射关系
      if (item[this.target] === this.idx) {
        slots = item
      }
    })
    if (slots && slots.$scopedSlots) {
      slostFun = slots.$scopedSlots[this.name] || slostFun
      return h('div', { class: this.cls }, slostFun())
    } else {
      return h('div', { class: this.cls })
    }
  }
}
</script>
