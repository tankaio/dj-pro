<template>
  <div class="page-MemberInfo-root">
    <x-header :is-right="false" />
    <div class="userInfo">
      <x-member-avatar
        v-bind="{
          src: '1.png',
          state: 'admin'
        }"
      />
      <div class="right">
        <div class="top">
          昵称：test001
          <van-tag type="danger">管理员</van-tag>
        </div>
        <div class="bottom">用户名：Test001</div>
      </div>
    </div>
    <van-cell title="设置备注" value="我是备注信息..." is-link to="/chat/changeRoomName" />
    <van-cell class="swithBar" title="禁言">
      <van-switch v-model="checked" size="24px" />
    </van-cell>
    <div class="gray-8">
      <div><van-icon name="chat-o" />私聊</div>
    </div>
    <div class="gray-8">
      <div>拉黑并删除消息</div>
    </div>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
import xMemberAvatar from 'cpt/x-member-avatar.vue'
export default {
  components: {
    xHeader,
    xMemberAvatar
  },
  data() {
    return {
      checked: true
    }
  }
}
</script>

<style lang="scss">
.page-MemberInfo-root {
  background-color: $baseBgColor;
  flex: 1;
  .userInfo {
    padding: 15px;
    display: flex;
    background-color: $white;
    .right {
      display: flex;
      flex-direction: column;
      padding-left: 10px;
      > * {
        flex: 1;
        line-height: 24px;
      }
      .top {
        font-size: 12px;
      }
      .bottom {
        font-size: 15px;
      }
    }
  }
  .van-switch--on {
    background-color: $green;
  }
  .gray-8 div {
    font-size: 15px;
    color: $txt;
    line-height: 54px;
    height: 54px;
    text-align: center;
    background-color: $white;
  }
  .swithBar .van-cell__value {
    height: 26px;
  }
}
</style>
