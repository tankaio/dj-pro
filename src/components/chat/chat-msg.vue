<template>
  <div class="chat-msg" :class="{ self: left }">
    <div class="chat-avatar-bar">
      <x-img :src="avatar" dft :lazy="false" />
    </div>
    <div class="chat-msg-content-bar">
      <div class="chat-msg-nick">
        {{ nick }}
      </div>
      <div class="chat-msg-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import xImg from 'cpt/x-img'
export default {
  name: 'chat-msg',
  components: { xImg },
  props: {
    left: Boolean,
    nick: String,
    avatar: {
      type: String,
      default: '0-0-0-ico.png'
    }
  }
}
</script>

<style lang="scss">
.chat-msg {
  min-width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  box-sizing: border-box;
  padding: 15px 12px 0;
  display: flex;
  &.self {
    flex-direction: row-reverse;
    .chat-msg-content-bar {
      padding: unset;
      padding-right: 12px;
      text-align: right;

      .chat-msg-nick {
        display: none;
      }
      .chat-msg-content {
        background-color: $roomMsgBg;
        text-align: left;
      }
      &::before {
        display: block;
        position: absolute;
        content: '';
        border-width: 6px;
        border-style: solid;
        border-color: transparent;
        border-left-color: $roomMsgBg;
        right: 0;
        left: unset;
        transform: translateX(0%);
        z-index: 5;
        top: 15px;
      }
    }
  }
  .chat-avatar-bar {
    width: 45px;
    height: 45px;
    font-size: 0;
    border-radius: 2.5px;
    overflow: hidden;
    > img {
      width: 45px;
      height: 45px;
    }
  }
  .chat-msg-content-bar {
    padding-left: 12px;
    max-width: 240px;
    position: relative;
    &::before {
      display: block;
      position: absolute;
      content: '';
      border-width: 6px;
      border-style: solid;
      border-color: transparent;
      border-right-color: $white;
      left: 0;
      transform: translateX(0%);
      z-index: 5;
      top: 25px;
    }
  }
  .chat-msg-nick {
    font-size: 12px;
    color: $txt;
    padding-bottom: 3.5px;
  }
  .chat-msg-content {
    background-color: $white;
    border-radius: 5px;
    overflow: hidden;
    padding: 12px;
    box-sizing: border-box;
    font-size: 15px;
    color: $txt;
    .x-img {
      pointer-events: unset;
    }
  }
}
</style>
