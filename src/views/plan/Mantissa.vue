<template>
  <div class="mantissa-container" :class="type">
    <x-active-button v-for="(item, index) in btn_list" :key="index" :idx="index" :max="max" @limit="onLimit" :cls="['active', 'right']">
      <span class="circl">{{ item }}</span>
    </x-active-button>
  </div>
</template>

<script>
import xActiveButton from 'cpt/x-active-button.vue'
export default {
  components: {
    xActiveButton
  },
  data() {
    return {
      btn_list: [],
      type: '',
      max: 0
    }
  },
  methods: {
    matchType(type) {
      switch (type) {
        case 'w2':
          this.max = 2
          break
        case 'w3':
          this.max = 3
          break
        case 'w4':
          this.max = 4
          break
        case 'tw':
          this.max = 1
          break
        case 'ztw':
          this.max = 7
          break
        default:
          break
      }
      this.btn_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    onLimit() {
      this.$notify(`该玩法最多选择${this.max}个号码`)
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let type = to.params.type
      vm.matchType(type)
    })
  },
  beforeRouteUpdate(to, from, next) {
    let type = to.params.type
    this.matchType(type)
    next()
  }
}
</script>

<style lang="scss">
.mantissa-container {
  display: flex;
  flex-wrap: wrap;
  .x-active-button {
    width: 50%;
    height: 44px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid $gray-d7;
    &:nth-child(2n -1) {
      border-right: 1px solid $gray-d7;
    }
    &:nth-child(1),
    &:nth-child(2) {
      border-top: 1px solid $gray-d7;
    }
    .circl {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      border-width: 1px;
      border-style: solid;
      font-size: 15px;
      font-weight: 600;
    }
    &.active {
      background-color: $gray-f5;
      box-shadow: inset 0 0 2px 0 rgba($color: #000000, $alpha: 0.3);
      .circl {
        border: none;
        color: $white;
      }
      .circl {
        background-color: $rootColor;
        color: $white;
      }
      > i {
        background-color: $rootColor;
      }
      &::after {
        border-color: $white;
      }
    }
    @each $k, $v in $wsSeBoBD {
      &.#{$k} .circl {
        border-color: $v;
      }
    }
  }
}
</style>
