<template>
  <div
    class="x-page"
    :class="{
      [`page-${rootClass}-root`]: rootClass,
      isFooter,
      isHeader
    }"
  >
    <x-header v-if="isHeader" v-bind="{ closeBack, isRight }">
      <template v-if="$slots['hd-right']">
        <slot name="hd-right"></slot>
      </template>
    </x-header>
    <slot></slot>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
import xTabbar from 'cpt/x-tabbar.vue'
import xHeader from 'cpt/x-header.vue'
export default {
  name: 'x-page',
  components: {
    Tabbar,
    TabbarItem,
    xTabbar,
    xHeader
  },
  props: {
    rootClass: String,
    isFooter: {
      type: Boolean,
      default: false
    },
    isHeader: {
      type: Boolean,
      default: true
    },
    closeBack: Boolean,
    isRight: Boolean
  },
  methods: {},
  computed: {
    title() {
      return this.$route.meta.title || false
    }
  }
}
</script>

<style lang="scss">
.x-page {
  flex: 1;
  box-sizing: border-box;
  &.isFooter {
    padding-bottom: 48px;
  }
  &.isHeader {
    // //padding-top: 44px;
  }
}
</style>
