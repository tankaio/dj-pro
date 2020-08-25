<template>
  <div class="x-service-msg">
    <div class="msg-body" :class="{ self }">
      <div class="msg">
        <div class="contxt">{{ msg }}</div>
      </div>
      <x-img :src="avatar" class="avatar" dft />
    </div>
    <van-divider>{{ time }}</van-divider>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xImg
  },
  name: 'x-service-msg',
  props: {
    self: {
      type: Boolean,
      default: true
    },
    msg: String,
    avatar: String,
    time: String
  }
}
</script>

<style lang="scss">
.x-service-msg {
  padding-top: 16px;
  .avatar {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 20px;
  }
  .van-divider {
    margin-bottom: 0;
  }
  .msg-body {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
    .msg {
      // min-height: 80px;
      // width: 257px;
      border-radius: 5px;
      border: 1px solid $gray-99;
      position: relative;
      padding: 10px 0;
      display: flex;
      &::after {
        content: '';
        display: block;
        position: absolute;
        height: 10px;
        width: 10px;
        border-left: 1px solid $gray-99;
        border-bottom: 1px solid $gray-99;
        left: 0;
        top: 50%;
        transform: translateY(-50%) translateX(-50%) rotateZ(45deg);
        background-color: $white;
      }
      .contxt {
        position: relative;
        padding: 0 10px;
        background-color: $white;
        flex: 1;
        z-index: 1;
        font-size: 15px;
        color: $txt;
      }
    }
    &.self {
      flex-direction: row;
      .msg::after {
        left: unset;
        right: 0;
        transform: translateX(50%) translateY(-50%) rotateZ(225deg);
      }
    }
  }
}
</style>
