<template>
  <div class="x-btn-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    mdl: [Number, String]
  },
  model: {
    prop: "mdl",
    event: "sync"
  },
  provide() {
    return {
      syncVal: this.syncVal,
      mdl: this.mdl
    };
  },
  methods: {
    syncVal(val) {
      this.$emit("sync", val);
      this.$emit('change')
    }
  }
};
</script>

<style lang="scss">
.x-btn-bar {
  display: flex;
  padding: 5px;
}
</style>
