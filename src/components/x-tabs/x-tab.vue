<script>
// ******************************
//      x-tab 的 title 不能设置为可变值
// ******************************
export default {
  name: 'x-tab',
  props: ['title'],
  render(h) {
    return h('div', { class: 'x-tab' }, this.$slots.default)
  }
}
</script>
