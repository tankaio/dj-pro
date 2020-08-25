<template>
  <div class="one-size-container" :class="type">
    <x-act-button v-model="val" idx="大" :cls="['active', 'right']">
      大
    </x-act-button>
    <x-act-button v-model="val" idx="小" :cls="['active', 'right']">
      小
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
      val: '大',
      type: ''
    }
  },
  methods: {
    ...mapMutations(['setNumberList'])
  },
  created() {
    this.$eventBus.$on('pull:numberlist', () => {
      if (this.val) this.setNumberList([this.val])
    })
  },
  destroyed() {
    this.$eventBus.$off('pull:numberlist')
  }
}
</script>

<style lang="scss">
.one-size-container {
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
