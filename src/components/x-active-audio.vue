<template>
  <div class="x-active-audio" :class="self_active ? cls : ''" @click="onClick">
    <slot></slot>
    <i></i>
  </div>
</template>

<script>
export default {
  name: "x-active-audio",
  props: {
    cls: {
      type: [String, Array],
      default: ""
    },
    idx: Boolean,
  },
  model: {
    prop: "idx",
    event: "sync"
  },
  data() {
    return {
      self_active: false
    };
  },
  methods: {
    onClick() {
      this.self_active = !this.self_active;
      this.$emit("sync", this.self_active);
    }
  },
  created() {
    this.self_active = this.idx;
  },
  watch: {
    idx(news) {
      this.self_active = news;
    }
  }
};
</script>

<style lang="scss"></style>
