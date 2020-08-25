<template>
  <div class="one-double-container" :class="type">
    <x-act-button v-model="val" idx="单" :cls="['active', 'right']">
      单
    </x-act-button>
    <x-act-button v-model="val" idx="双" :cls="['active', 'right']">
      双
    </x-act-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import xActButton from 'cpt/x-act-button.vue'

export default {
  components: {
    xActButton
  },
  data() {
    return {
      val: '单',
      type: ''
    }
  },
  methods: {
    ...mapMutations(['setNumberList']),
    matchType(type) {
      this.type = type
    }
  },
  created() {
    this.$eventBus.$on('pull:numberlist', () => {
      this.setNumberList([this.val])
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
.one-double-container {
  display: flex;
  flex-wrap: wrap;
  .x-act-button {
    box-sizing: border-box;
    width: 50%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background-color: $gray-f5;
    font-size: 15px;
    font-weight: 600;
    &.active {
      color: $white;
      background-color: $rootColor;
      border: 1px solid $rootColor;
    }
  }
}
</style>
