<template>
  <div class="x-periods-tit">
    <div class="bar" v-if="tit">
      <span class="xIcon-period-cm"></span>
      <span class="tit">{{ tit }}</span>
      <span class="right">{{ right }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name:"x-periods-tit",
  props: ["tit", "right"]
};
</script>

<style lang="scss">
.x-periods-tit {
  background-color: $baseBgColor;
  padding-top: 8px;
  .bar {
    background-color: $white;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    font-size: 13px;
  }
  .tit {
    flex: 1;
    color: $txt;
    padding-left: 10px;
  }
  .right {
    color: $rootColor;
  }
}
</style>
