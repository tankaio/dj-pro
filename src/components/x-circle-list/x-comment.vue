<template>
  <div class="x-comment van-hairline--bottom">
    <x-comment-item :info="rootmsg" @repy="onRepy(rootmsg)">
      <template v-for="(item, index) in dependmsg">
        <x-comment-item @repy="onRepy(item)" :key="index" :info="item" v-if="index <= 2 || more" />
      </template>
      <div class="more" v-if="dependmsg.length >= 4" @click="more = !more">
        {{ more ? '收起' : `全部${dependmsg.length}条回复` }}
      </div>
    </x-comment-item>
  </div>
</template>

<script>
import xCommentItem from 'cpt/x-circle-list/x-comment-item.vue'
export default {
  components: {
    xCommentItem
  },
  name: 'x-comment',
  props: {
    rootmsg: Object,
    dependmsg: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      more: false
    }
  },
  methods: {
    onRepy(data) {
      this.$emit('repy', data, this.rootmsg.msgid)
    }
  }
}
</script>

<style lang="scss">
.x-comment {
  .xc__avatar{
    width: 25px;
    height: 25px;
  }
  .more {
    color: #3074b3;
  }
}
</style>
