<template>
  <div class="page-roomInfo-root">
    <x-header :is-right="false" />
    <div class="members van-hairline--bottom">
      <div class="members-bar ">
        <x-member-avatar v-for="(item, index) in 20" :key="index" src="1.png" name="1feafea23" state="admin" />
      </div>
      <div class="moreMember" @click="$router.push('/chat/roomMembers')">
        <span>查看更多成员</span>
        <van-icon name="arrow" />
      </div>
    </div>
    <van-cell title="聊天室昵称" value="我是用户昵称" is-link to="/chat/changeRoomNick" />
    <van-cell title="私聊列表" is-link to="/chat/privateChatList">
      <van-tag round type="danger">99+</van-tag>
    </van-cell>
    <van-cell-group>
      <van-cell title="房间名称" value="我是房间名称" />
      <van-cell
        to="/chat/announcement"
        class="announcement"
        is-link
        title="房间公告"
        label="我是公告告内容xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      />
    </van-cell-group>
  </div>
</template>

<script>
import xHeader from 'cpt/x-header.vue'
import xMemberAvatar from 'cpt/x-member-avatar.vue'
export default {
  components: {
    xHeader,
    xMemberAvatar
  }
}
</script>

<style lang="scss">
.page-roomInfo-root {
  .members {
    padding: 0 27px 27px;
    .members-bar {
      display: flex;
      flex-wrap: wrap;
      .x-member-avatar {
        margin-top: 18.5px;
      }
      .x-member-avatar:not(:nth-child(5n)) {
        margin-right: 19.5px;
      }
    }
    .moreMember {
      font-size: 12px;
      color: $gray-66;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
    }
  }
  .announcement {
    align-items: center;
  }
}
</style>
