<template>
  <div class="voiceview">
    <div class="voicebox">
      <div class="box-top">
        <span class="voice-icon xIcon-voice_white"></span>
        <div class="voicelines">
          <span v-for="(item,index) in 8" :key="index" :style="{width:lineWidth[index]+'px'}"></span>
        </div>
      </div>
      <div class="box-center">
        <span class="timer"></span>
        <span>00:00:00</span>
      </div>
      <div class="box-bottom">
        <span>松开手指，取消发送</span>
      </div>
      <div class="box-cancel" :class="{'box-cancel-actived':paramsIsActive}">
        <span>取消</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "x-voice-mask",
  props: ["paramsIsActive"],
  data() {
    return {
      lineWidth: ["8", "12", "16", "20", "24", "28", "32", "36"]
    };
  }
};
</script>

<style lang="scss">
.voiceview {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: $grayLevelOne;
  z-index: 1000;
  opacity: 0.9;
  .voicebox {
    width: 184px;
    background-color: $grayLevelTwo;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -92px;
    margin-top: -92px;
    z-index: 1000;
    border-radius: 8%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 13px;
    .box-top {
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      span.voice-icon {
        display: inline-block;
        width: 65px;
        height: 65px;
        border: 1px dashed $dashGray;
        margin-right: 5px;
      }
      div.voicelines {
        display: flex;
        flex-direction: column-reverse;
        span {
          display: block;
          height: 3px;
          background-color: $lightGrayLevFour;
          margin-bottom: 4px;
        }
      }
    }
    .box-center {
      margin-bottom: 15px;
      .timer {
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: $rootColor;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
    .box-bottom {
      font-size: 12px;
      color: #cdcdcd;
      margin-bottom: 25px;
    }
    .box-cancel {
      width: 90px;
      height: 90px;
      background-color: $grayLevelThree;
      color: #333;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all 0.2s linear;
    }
    .box-cancel-actived {
      background-color: $rootColor;
      color: $white;
    }
  }
}
</style>