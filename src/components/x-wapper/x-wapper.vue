<template>
  <div class="x-wapper">
    <div class="xw-item-bar" id="xw-item-bar" v-if="list.length">
      <x-wapper-item @click="onJumpClick(list[list.length - 2].jump_url, list[list.length - 2].jump)">
        <x-img :lazy="false" :src="list[list.length - 2].pic" />
      </x-wapper-item>
      <x-wapper-item @click="onJumpClick(list[list.length - 1].jump_url, list[list.length - 1].jump)">
        <x-img :lazy="false" :src="list[list.length - 1].pic" />
      </x-wapper-item>
      <x-wapper-item v-for="(item, index) in list" :key="index" @click="onJumpClick(item.jump_url, item.jump)">
        <x-img :lazy="false" :src="item.pic" />
      </x-wapper-item>
      <x-wapper-item @click="onJumpClick(list[0].jump_url, list[0].jump)">
        <x-img :lazy="false" :src="list[0].pic" />
      </x-wapper-item>
      <x-wapper-item @click="onJumpClick(list[1].jump_url, list[1].jump)">
        <x-img :lazy="false" :src="list[1].pic" />
      </x-wapper-item>
      <x-wapper-item @click="onJumpClick(list[2].jump_url, list[2].jump)">
        <x-img :lazy="false" :src="list[2].pic" />
      </x-wapper-item>
    </div>
    <div class="xw-indicator-bar">
      <div class="xw-indicator" v-for="(item, index) in list" :key="index" :class="{ active: index === active }"></div>
    </div>
  </div>
</template>

<script>
import wapper from './core2'
import xWapperItem from './x-wapper-item.vue'
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xWapperItem,
    xImg
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    delay: {
      type: Number,
      default: 5000
    }
  },
  name: 'x-wapper',
  data() {
    return {
      active: 0
    }
  },
  methods: {
    onJumpClick(url, type) {
      switch (type) {
        case 0:
          break
        case 1:
          window.location.href = url
          break
        case 2:
          this.$router.push('/manito')
          break
        case 3:
          this.$router.push('/combo')
          break
        case 4:
          this.$router.push('/winRate')
          break
        case 5:
          this.$router.push('/champion')
          break
        case 6:
          this.$router.push('/activity')
          break
        default:
          break
      }
    }
  },
  mounted() {
    let count = 0
    let init = () => {
      count++
      let _wapper = wapper()
      if (count > 10) return
      if (!_wapper) return G.delay(() => init(), 1000)
      _wapper.flush(v => (this.active = v - 1))
      _wapper.start()
      G.$on('page-hidden', () => _wapper.setLock(true))
      G.$on('page-visible', () => _wapper.setLock(false))
      this.$on('hook:destroyed', () => _wapper.destroy())
    }
    init()
  }
}
</script>

<style lang="scss">
.x-wapper {
  width: 100vw;
  overflow: hidden;
  position: relative;
  .xw-indicator-bar {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    display: flex;
    .xw-indicator {
      height: 6px;
      width: 6px;
      margin-right: 6px;
      border-radius: 50%;
      background-color: $white;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        background-color: $rootColor;
      }
    }
  }
  .xw-item-bar {
    display: flex;
    padding: 5px 0;
  }
}
</style>
