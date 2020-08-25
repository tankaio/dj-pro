<template>
  <div class="page-start">
    <div class="AD" @click="onClickAD"></div>
    <div class="logoBar">
      <div class="left">
        <x-img src="" class="logo" />
        <div class="infoBar">
          <div class="tit">ddd</div>
          <div class="name">1111</div>
        </div>
      </div>
      <div class="btnBar">
        <van-button class="continue" @click="onClickContinue">
          跳过<van-count-down @finish="finish" :time="5000" format="ss" />
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xImg
  },
  methods: {
    finish() {
      this.$router.replace('/home')
    },
    onClickAD() {
      this.$router.replace('/home')
    },
    onClickContinue() {
      this.$router.replace('/home')
    }
  },
  created() {},
  mounted() {
    // let timer = setTimeout(() => {
    //   clearTimeout(timer);
    //   this.$router.replace("/home");
    // }, 2000);
  }
}
</script>

<style lang="scss">
.page-start {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .AD {
    flex: 1;
  }
  .logoBar {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    // position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    .left {
      flex: 1;
      display: flex;
      justify-content: center;

      .logo {
        width: 60px;
        height: 60px;
        border-radius: 8px;
      }
      .infoBar {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding-left: 15px;
      }
    }
    .btnBar {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 15px;
      .van-button__text {
        white-space: nowrap;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
