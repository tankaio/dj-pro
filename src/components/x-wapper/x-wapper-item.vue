<template>
  <div class="x-wapper-item" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "x-wapper-item"
};
</script>

<style lang="scss">
.x-wapper-item {
  min-height: 150px;
  min-width: 343px;
  max-width: 343px;
  width: 343px;
  transition-duration: 500ms;
  > img {
    // box-shadow: 0 0 7px 0 rgba($color: #000000, $alpha: 0.6);
  }
}
</style>
