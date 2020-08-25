<template>
  <div
    class="x-video-wapper"
    @touchstart="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="xvw-stack" ref="xstack">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { init } from "./core";
let handle;
export default {
  name: "x-video-wapper",
  props: ["desc", "publish_time", "nums", "video_time", "url", "auth"],
  data() {
    return {};
  },
  methods: {
    onTouchStart: e => handle.start(e),
    onTouchMove: e => {
      handle.flushMove(e);
    },
    onTouchEnd: e => handle.end(e)
  },
  created() {},
  mounted() {
    handle = init(this.$refs.xstack, this.$vw);
  }
};
</script>

<style lang="scss">
.x-video-wapper {
  widows: 100vw;
  overflow: hidden;
  .xvw-stack {
    display: flex;
  }
  .xvw-item {
    position: relative;
    min-width: 300px;
    min-height: 150px;
    background-color: $white;
  }
  .xvw-item-content {
    position: absolute;
    left: 5px;
    right: 5px;
    top: 0;
    bottom: 0;
    border-radius: 2.5px;
  }
  .xvw-img {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    font-size: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  .xvw-auth {
    position: absolute;
    display: inline-block;
    font-size: 9px;
    color: $white;
    border-radius: 2.5px;
    height: 12px;
    background-color: #efba2c;
    padding: 2px;
    top: 6px;
    right: 6px;
  }
  .xvw-footer {
    position: absolute;
    color: $white;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 10px;
  }
  .xvw-desc {
    font-size: 14px;
  }
  .xvw-info-bar {
    font-size: 11px;
    display: flex;
    padding: 5px 0;
  }
  .xvw-time {
    flex: 1;
  }
  .xvw-play {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid $white;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    &::after {
      display: block;
      position: absolute;
      content: "";
      border-left-width: 15px;
      border-bottom-width: 10px;
      border-top-width: 10px;
      border-style: solid;
      border-color: transparent;
      border-left-color: $white;
      left: 50%;
      top: 50%;
      transform: translateX(-25%) translateY(-50%);
    }
  }
}
</style>
