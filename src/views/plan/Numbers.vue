<template>
  <div class="positiveSpecialCode-container" :class="type">
    <x-active-button
      v-for="(item, index) in btn_list"
      :key="index"
      :idx="item"
      :class="`cl-${item}`"
      :cls="['active', 'right']"
      :max="max"
      @limit="onLimit"
    >
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
        case 'tc': // 特串
        case 'qz2': // 2全中
        case 'zt2': // 2中特
        case 'zmrx': // 直码任选
          this.max = 2
          break
        case 'm1': // 码 1
        case 'm2':
        case 'm3':
        case 'm4':
        case 'm5':
        case 'm6':
        case 'tmzx': // 特码直选
          this.max = 12
          break
        case 'bz5': // 5不中
          this.max = 5
          break
        case 'bz6':
          this.max = 6
          break
        case 'bz7':
          this.max = 7
          break
        case 'bz8':
          this.max = 8
          break
        case 'bz9':
          this.max = 9
          break
        case 'bz10':
          this.max = 10
          break
        case 'bz11':
          this.max = 11
          break
        case 'bz12':
          this.max = 12
          break
        case 'qz3': // 3 全中
        case 'z32': // 3中2
          this.max = 3
        default:
          break
      }
      this.btn_list = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49
      ]
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
.positiveSpecialCode-container {
  display: flex;
  flex-wrap: wrap;

  .x-active-button {
    width: 33.33%;
    height: 44px;
    border: 1px solid $gray-d7;
    box-sizing: border-box;
    border-top: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      border-top: 1px solid $gray-d7;
    }
    &:nth-child(3n + 2):not(:last-child) {
      border-left: none;
      border-right: none;
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
    @each $k, $v in $plan-49 {
      &.cl-#{$k} {
        .circl {
          border-color: $v;
        }
      }
    }
    &.active {
      background-color: $gray-f5;
      box-shadow: inset 0 0 2px 0 rgba($color: #000000, $alpha: 0.3);
      @each $k, $v in $plan-49 {
        &.cl-#{$k} {
          .circl {
            border: none;
            color: $white;
            background-color: $v;
          }
        }
      }

      > i {
        background-color: $rootColor;
      }
      &::after {
        border-color: $white;
      }
    }
  }
}
</style>
