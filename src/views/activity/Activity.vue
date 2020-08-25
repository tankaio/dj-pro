<template>
  <!-- <x-page isFooter active="4" rootClass="activity" closeBack> </x-page> -->
  <x-layout modifier="activity">
    <x-header :left-arrow="false" :is-right="false" slot="header" />
    <router-link to="">
      <img src="@/assets/img/cpxx.png" />
    </router-link>
    <router-link to="">
      <img src="@/assets/img/hbcp.png" />
    </router-link>
  </x-layout>
</template>

<script>
import xPage from "cpt/x-page.vue";
export default {
  components: {
    xPage
  }
};
</script>

<style lang="scss">
.page-activity-root {
  background-color: $white;
  a {
    display: block;
    margin-top: 8px;
    font-size: 0;
    img {
      width: 100vw;
    }
    &:last-child {
      padding-bottom: 8px;
    }
  }
}
</style>
