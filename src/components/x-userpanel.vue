<template>
  <div class="x-userpanel gray-8">
    <!-- FIXME 存在问题,未解决,个人中心查询参数一部分使用nick一部分使用 id -->
    <div class="xu-middle" @click="$router.push(`/userInfo/userInfoPlan/?nick=${username}`)">
      <div class="left" :class="{ news: newplan }">
        <template v-if="$slots.left">
          <slot name="left"></slot>
        </template>
        <x-img :src="avatar" class="xp-avatar" v-else dft />
      </div>
      <div class="center">
        <template v-if="$slots.center">
          <slot name="center"></slot>
        </template>
        <div class="xp-user-info">
          <div class="xp-top">
            <span class="xp-user-name">{{ username }}</span>
            <span v-if="gender !== -1" :class="`xIcon-${gender === 1 ? 'male' : 'female'}-gender`"></span>
            <span v-if="expert" class="xIcon-specialist"></span>
            <span v-if="fans" class="fans">粉丝{{ fans }}</span>
            <span v-if="follow" class="follow">关注{{ follow }}</span>
          </div>
          <div class="xp-bottom">
            <template v-if="$slots.btm">
              <slot name="btm"></slot>
            </template>
            <div class="planname" v-else-if="planname">{{ planname }}</div>
          </div>
        </div>
      </div>
      <div class="right">
        <template v-if="$slots.right">
          <slot name="right"></slot>
        </template>
        <div class="xp-right"></div>
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
  name: 'x-userpanel',
  props: ['username', 'gender', 'expert', 'planname', 'fans', 'follow', 'newplan', 'avatar']
}
</script>

<style lang="scss">
.x-userpanel {
  .xu-middle {
    display: flex;
    padding: 15px 20px;
  }
  .center {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .xp-user-info {
    padding-left: 12px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: space-around;
  }
  .xp-top,
  .xp-bottom {
    flex: 1;
  }
  .xp-top,
  .xp-bottom {
    display: flex;
    align-items: center;
    > * {
      margin-right: 5px;
    }
  }
  .planname {
    font-size: 15px;
    color: $txt;
  }
  .xp-user-name {
    font-size: 13px;
    color: $txt;
  }
  .xp-expert {
    box-sizing: border-box;
    height: 13px;
    width: 13px;
    background-color: $rootColor;
    color: $white;
    font-size: 10px;
    text-align: center;
    line-height: 13px;
    padding: 1px;
    transform: scale(0.9);
  }
  .left {
    position: relative;
    &.news::after {
      display: block;
      content: '';
      position: absolute;
      height: 5px;
      width: 5px;
      border: 1px solid $white;
      border-radius: 50%;
      background-color: $rootColor;
      right: 12%;
      bottom: 12%;
    }
  }
  .xp-avatar {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    background-color: $baseBgColor;
    overflow: hidden;
  }
  .fans,
  .follow {
    font-size: 13px;
    color: $txt;
  }
}
</style>
