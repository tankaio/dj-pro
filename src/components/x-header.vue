<template>
  <van-nav-bar
    class="x-header"
    v-if="animated"
    fixed
    :left-text="leftText"
    :right-text="rightText"
    :left-arrow="leftArrow && !closeBack"
    :border="false"
    :title="title"
    @click-left="onClickLeft"
    @click-right="onClickRight"
    v-bind="{ zIndex: Number(zIndex) }"
  >
    <span class="xh-right" slot="right">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-if="!$slots.default && isRight">
        <van-icon v-if="$parent.$parent.name == 'games'" name="wap-nav" class="van-nav-bar__arrow games-nav-right" />
        <span v-else-if="$parent.name == 'betrecord'">筛选<i class="xIcon-record-cm"></i></span>
        <span class="xIcon-service-cm" v-else></span>
      </template>
    </span>
    <template v-if="$slots.left" slot="left">
      <slot name="left"></slot>
    </template>
    <template v-if="$slots.title" slot="title">
      <slot name="title"></slot>
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  name: 'x-header',
  props: {
    leftText: String,
    rightText: String,
    leftArrow: {
      type: Boolean,
      default: true
    },
    clickLeft: [Function, Boolean],
    closeBack: {
      type: Boolean,
      default: false
    },
    isRight: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: [String, Number],
      default: 10
    },
    centerText: String
  },
  data() {
    return {
      animated: false
    }
  },
  computed: {
    title() {
      return this.centerText || this.$route.meta.title
    }
  },
  methods: {
    onClickLeft() {
      if (this.clickLeft) {
        return this.clickLeft === true ? '' : this.clickLeft()
      } else {
        this.go(-1)
      }
    },
    onClickRight() {
      if (this.$slots.default) {
        this.$parent.$emit('click-right')
        this.$emit('click-right')
      } else if (this.$parent.$parent.name == 'games') {
        this.$emit('games-right')
      } else if (this.$parent.name == 'betrecord') {
        this.$emit('betrecord-right')
      } else {
        this.$router.push('/service')
      }
    }
  },
  mounted() {
    this.animated = true
  }
}
</script>

<style lang="scss">
.x-header {
  position: relative;
  height: 44px;
  overflow: hidden;
  // background-color: $rootColor;
  touch-action: manipulation;
  &.van-nav-bar {
    width: 100vw;
    height: 44px;
    background-color: $rootColor;
    > * {
      height: 44px;
      line-height: 44px;
      color: $white;
    }
  }

  .van-nav-bar__title {
    font-size: 17px;
  }
  .van-icon-arrow-left:before {
    color: $white;
    transform: scale(1.3);
  }
  i.games-nav-right {
    color: $white;
    font-size: 22px;
  }
  .van-nav-bar__text {
    color: $white;
  }
  .van-nav-bar__text:active {
    background: none;
  }
}
</style>
