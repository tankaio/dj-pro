<template>
  <div class="voicesmallbox">
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
      <span>上滑取消</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "x-voice-dialog",
  data(){
    return {
      lineWidth: ["8","12","16","20","24","28","32","36"]
    }
  }
};
</script>

<style lang="scss">
.voicesmallbox {
  width: 184px;
  height: 184px;
  background-color: $grayLevelTwo;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
  margin-left: -92px;
  margin-top: -92px;
  border-radius: 8%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: $white;
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
    div.voicelines{
      display: flex;
      flex-direction: column-reverse;
      span{
        display: block;
        height: 3px;
        background-color: $lightGrayLevFour;
        margin-bottom: 4px;
      }
    }
  }
  .box-center {
    margin-bottom: 5px;
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
  }
}
</style>