<template>
  <div class="foldItemBar x-fold-redbag" @click="onClick">
    <div class="iconBar">
      <span class="xIcon-red-packet-fold"></span>
    </div>
    <div class="txt">
      红包
    </div>
  </div>
</template>

<script>
export default {
  name: "x-fold-regbag",
  methods: {
    onClick() {
      this.$router.push("/chat/redBagNiuNiu");
    }
  }
};
</script>

<style lang="scss">
.x-fold-redbag {
}
</style>
