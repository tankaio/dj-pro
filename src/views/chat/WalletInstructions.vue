<template>
  <div class="page-WalletInstructions-root">
    <x-header :is-right="false" />
    <div class="container">
      <div class="bg wallet-instructions-bg"></div>
    </div>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
export default {
  components: {
    xHeader
  }
}
</script>

<style lang="scss">
.page-WalletInstructions-root {
  .container {
    padding: 14px;
  }
  .bg {
    width: 348px;
    height: 631px;
  }
}
</style>
