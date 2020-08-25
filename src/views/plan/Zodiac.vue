<template>
  <div class="number-zodiac-container" :class="type">
    <x-active-button
      v-for="(item, index) in btn_list"
      :key="index"
      :idx="item.text"
      :cls="['active', 'right']"
      :max="max"
      @click="onSelect"
      @limit="onLimit"
    >
      <span class="txt">{{ item.text }}</span>
      <div class="nums">
        <span class="num" :class="[`act-${item_n}`, item_n ? '' : 'none']" v-for="(item_n, index_n) in item.nums" :key="index_n">
          {{ item_n }}
        </span>
      </div>
    </x-active-button>
  </div>
</template>

<script>
import { BuildBallsXiao, xiaoList } from '@/utils/rule/zodiac.rule.js'
import { mapGetters } from 'vuex'

import xActiveButton from 'cpt/x-active-button.vue'

export default {
  components: {
    xActiveButton
  },
  data() {
    return {
      type: '',
      max: 0
    }
  },
  computed: {
    ...mapGetters(['getCuryear']),
    btn_list() {
      let xiao_map = xiaoList(BuildBallsXiao(this.getCuryear), this.getCuryear)
      let xiao_list = Object.keys(xiao_map)
        .map((ele, idx) => {
          let list = xiao_map[ele]
          return {
            text: ele,
            idx: idx,
            nums: list
          }
        })
        .reverse()
      return xiao_list
    }
  },
  methods: {
    matchType() {
      switch (this.type) {
        case 'tx':
          this.max = 4
          break
        case 'lx2':
          this.max = 2
          break
        case 'lx3':
          this.max = 3
          break
        case 'lx4':
          this.max = 4
          break
        case 'lx5':
          this.max = 5
          break
        case 'bz2':
        case 'z2':
          this.max = 2
          break
        case 'bz3':
        case 'z3':
          this.max = 3
          break
        case 'bz4':
        case 'z4':
          this.max = 4
          break
        case 'bz5':
        case 'z5':
          this.max = 5
          break
        case 'bz6':
        case 'z6':
          this.max = 6
          break
        case 'bz7':
        case 'z7':
          this.max = 7
          break
        case 'bz8':
        case 'z8':
          this.max = 8
          break
        case 'bz9':
        case 'z9':
          this.max = 9
          break
        case 'bz10':
        case 'z10':
          this.max = 10
          break
        case 'bz11':
        case 'z11':
          this.max = 11
          break
        default:
          this.max = 1
          break
      }
      // this.btn_list = [
      //   {
      //     text: "鼠",
      //     idx: 0,
      //     nums: [0, 12, 24, 36, 38]
      //   },
      //   {
      //     text: "牛",
      //     idx: 1,
      //     nums: [0, 11, 23, 35, 47]
      //   },
      //   {
      //     text: "虎",
      //     idx: 2,
      //     nums: [0, 10, 22, 34, 36]
      //   },
      //   {
      //     text: "兔",
      //     idx: 3,
      //     nums: [0, 9, 21, 33, 45]
      //   },
      //   {
      //     text: "龙",
      //     idx: 4,
      //     nums: [0, 8, 20, 32, 44]
      //   },
      //   {
      //     text: "蛇",
      //     idx: 5,
      //     nums: [0, 7, 19, 31, 43]
      //   },
      //   {
      //     text: "马",
      //     idx: 6,
      //     nums: [0, 6, 18, 30, 42]
      //   },
      //   {
      //     text: "羊",
      //     idx: 7,
      //     nums: [0, 5, 17, 29, 41]
      //   },
      //   {
      //     text: "猴",
      //     idx: 8,
      //     nums: [0, 4, 16, 28, 40]
      //   },
      //   {
      //     text: "鸡",
      //     idx: 9,
      //     nums: [0, 3, 15, 27, 39]
      //   },
      //   {
      //     text: "狗",
      //     idx: 10,
      //     nums: [0, 2, 14, 26, 38]
      //   },
      //   {
      //     text: "猪",
      //     idx: 11,
      //     nums: [1, 13, 25, 37, 49]
      //   }
      // ];
    },
    onSelect() {},
    onLimit() {
      this.$notify(`最多选择${this.max}个`)
    }
  },
  created() {
    this.matchType()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.type = to.params.type
      vm.matchType()
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.type = to.params.type
    this.matchType()
    next()
  }
}
</script>

<style lang="scss">
.number-zodiac-container {
  .x-active-button {
    display: flex;
    height: 44px;
    line-height: 44px;
    border-top: 1px solid $gray-d7;
    font-size: 15px;
    font-weight: 600;
    color: $txt;
    line-height: 44px;
    padding-right: 20px;
    &:last-child {
      border-bottom: 1px solid $gray-d7;
    }

    &.active {
      background-color: $gray-f5;
      box-shadow: inset 0 0 2px 0 rgba($color: #000000, $alpha: 0.3);
      .nums .num {
        border: none;
        color: $white;
        @each $k, $v in $plan-49 {
          &.act-#{$k} {
            background-color: $v;
          }
        }
      }
      &::after {
        border-color: $white;
      }
      i {
        background-color: $rootColor;
      }
    }
    .txt {
      padding-left: 35px;
      padding-right: 40px;
      flex: none;
    }
    .nums {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .num {
        box-sizing: border-box;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border-width: 1px;
        border-style: solid;
        line-height: 30px;
        text-align: center;
        &.none {
          opacity: 0;
        }
        @each $k, $v in $plan-49 {
          &.act-#{$k} {
            border-color: $v;
          }
        }
      }
    }
  }
}
</style>
