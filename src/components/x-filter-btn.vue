<template>
  <span class="x-filter-btn" :class="{ active: filterActive }" @click="$emit('click')">
    筛选
    <span class="xIcon-filter-cm" :class="{ active: filterActive }"></span>
  </span>
</template>

<script>
export default {
  name: "x-filter-btn",
  props: {
    filterActive: Boolean
  }
};
</script>

<style lang="scss">
.x-filter-btn {
  position: relative;
  line-height: 40px;
  padding: 0 15px;
  &.active {
    color: $rootColor;
  }
  &::after {
    display: block;
    content: "";
    position: absolute;
    border-left: 1px solid $gray-d7;
    top: 10%;
    bottom: 10%;
    left: 0;
    transform: rotateY(45deg);
  }
}
</style>
