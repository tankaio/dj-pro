<template>
  <div class="color-bo-container" :class="type">
    <template v-if="type === 'tmbb'">
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo0" v-model="tmbb_r_size" idx="红_大">
        红大
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo0" v-model="tmbb_r_size" idx="红_小">
        红小
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo0" v-model="tmbb_r_od" idx="红_单">
        红单
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo0" v-model="tmbb_r_od" idx="红_双">
        红双
      </x-act-button>

      <!-- blue -->
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo1" v-model="tmbb_b_size" idx="蓝_大">
        蓝大
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" v-model="tmbb_b_size" idx="蓝_小" class="sebo1">
        蓝小
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" v-model="tmbb_b_od" idx="蓝_单" class="sebo1">
        蓝单
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" v-model="tmbb_b_od" idx="蓝_双" class="sebo1">
        蓝双
      </x-act-button>

      <!-- green -->
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo2" v-model="tmbb_g_size" idx="绿_大">
        绿大
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo2" v-model="tmbb_g_size" idx="绿_小">
        绿小
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo2" v-model="tmbb_g_od" idx="绿_单">
        绿单
      </x-act-button>
      <x-act-button :group.sync="group" @clear="onClear" cls="active right" class="sebo2" v-model="tmbb_g_od" idx="绿_双">
        绿双
      </x-act-button>
    </template>
    <template v-else>
      <x-active-button
        v-for="(item, index) in btn_list"
        :key="index"
        :idx="item.text"
        :class="`sebo${item.clr}`"
        cls="active right"
        :max="max"
      >
        {{ item.text }}
      </x-active-button>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import xActButton from 'cpt/x-act-button.vue'
import xActiveButton from 'cpt/x-active-button.vue'

export default {
  components: {
    xActButton,
    xActiveButton
  },
  data() {
    return {
      val: 0,
      max: 0,

      group: '',

      tmbb_r_size: '', // 特码半波红组大小
      tmbb_b_size: '', // 特码半波蓝组大小
      tmbb_g_size: '', // 特码半波绿组大小

      tmbb_r_od: '', // 特码半波红组单双
      tmbb_b_od: '', // 特码半波蓝组单双
      tmbb_g_od: '', // 特码半波绿组单双

      btn_list: [],
      type: ''
    }
  },
  methods: {
    ...mapMutations(['clearNumberList', 'setNumberList']),
    matchType(type) {
      this.type = type
      switch (type) {
        case 'tmbb':
          this.max = 3
          break
        default:
          this.max = 1
          this.btn_list = [
            {
              text: '红',
              clr: 0,
              val: 1
            },
            {
              text: '蓝',
              clr: 1,
              val: 2
            },
            {
              text: '绿',
              clr: 2,
              val: 3
            }
          ]
          break
      }
    },
    onClear(val) {
      switch (val) {
        case '红':
          this.tmbb_r_size = ''
          this.tmbb_r_od = ''
          break
        case '蓝':
          this.tmbb_b_size = ''
          this.tmbb_b_od = ''
          break
        case '绿':
          this.tmbb_g_size = ''
          this.tmbb_g_od = ''
          break
        default:
          break
      }
      this.clearNumberList()
    }
  },
  created() {
    this.$eventBus.$on('pull:numberlist', () => {
      if (this.type === 'tmbb') {
        let [prefix] = this.group.split('_')
        let numberlist = []
        switch (prefix) {
          case '红':
            numberlist = [this.tmbb_r_size, this.tmbb_r_od]
            break
          case '蓝':
            numberlist = [this.tmbb_b_size, this.tmbb_b_od]
            break
          case '绿':
            numberlist = [this.tmbb_g_size, this.tmbb_g_od]
            break
          default:
            break
        }
        this.setNumberList(numberlist)
      }
    })
  },
  destroyed() {
    this.$eventBus.$off('pull:numberlist')
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
.color-bo-container {
  display: flex;
  flex-wrap: wrap;
  .x-active-button,
  .x-act-button {
    box-sizing: border-box;
    width: 50%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border: 1px solid $gray-d7;
    font-size: 15px;
    font-weight: 600;
    border-top: none;
    @each $i, $v in $sebo {
      &.sebo#{$i} {
        color: $v;
      }
    }
    &:nth-child(2n) {
      border-left: none;
    }
    &:nth-child(1),
    &:nth-child(2) {
      border-top: 1px solid $gray-d7;
    }
    &.active {
      color: $white;
      background-color: $rootColor;
      border: 1px solid $rootColor;
    }
  }
}
</style>
