<script>
import lazy from './core'
// 懒加载组件
export default {
  name: 'x-lazy-cpt',
  props: {
    height: [String, Number],
    preload: [String, Number],
    tag: {
      type: String,
      default: 'div'
    }
  },
  render(h) {
    if (this.show === false) {
      return h(this.tag, {
        ['class']: {
          'x-lazy-cpt': true
        },
        style: {
          height: `${Number(this.height) / 100}rem`
        }
      })
    } else {
      return h(
        this.tag,
        {
          ['class']: {
            'x-lazy-cpt': true
          },
          style: {
            height: `${Number(this.height) / 100}rem`
          }
        },
        this.$slots.default
      )
    }
  },
  data() {
    return {
      el: null,
      show: false,
      rect: {},
      nums: 0
    }
  },
  methods: {
    getRect() {
      this.rect = this.$el.getBoundingClientRect()
    },
    checkInView() {
      this.getRect()
      return this.rect.top < window.innerHeight + this.height * 2 && this.rect.bottom > 0
    },
    load() {
      this.show = true
      this.$emit('show', this)
    }
  },
  mounted() {
    this.el = this.$el
    lazy.addLazyBox(this)
    lazy.debounceComputedLoad()
  },
  beforeDestroy() {
    lazy.removeComponent(this)
  }
}
</script>
