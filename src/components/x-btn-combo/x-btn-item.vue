<template>
  <div
    class="x-btn-item"
    @click="onClick"
    :class="{ ['xb-active']: $parent.$props.mdl === name }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    name: String
  },
  inject: ["syncVal"],
  methods: {
    onClick() {
      this.$emit("click");
      this.syncVal(this.name);
    }
  }
};
</script>

<style lang="scss">
.x-btn-item {
  text-align: center;
  padding: 0 10px;
  font-size: 12px;
}
</style>
