<template>
  <div class="x-manito-item" :class="type" @click="url ? $router.push(url) : ''">
    <van-cell>
      <span v-if="crown !== undefined && crown < 4" slot="icon" :class="`xIcon-crown${crown - 1}-cm`" class="crown">
        <!-- {{ [1, 2, 3].includes(crown) ? "" : crown }} -->
      </span>
      <div slot="title" class="center">
        <!-- 冠军榜 -->
        <div v-if="(type == 'champion' || type == 'winrate') && modeType" class="tag-bar">
          <div class="tag" :class="modeType | playColor">
            <span class="container">{{ modeType }}</span>
          </div>
        </div>
        <!-- 大神榜 -->
        <div class="avatar-bar">
          <x-img v-if="avatar !== undefined" :src="avatar" class="avatar" dft />
        </div>
        <div class="infos">
          <div class="top">
            <template v-if="type === 'search'">
              <span class="user-name search" v-html="searchUserName"></span>
            </template>
            <span class="user-name" v-else>{{ username }}</span>
            <span :class="gender | Gander('icon')"></span>
            <span class="professor">
              <span class="xIcon-specialist" v-if="professor" />
            </span>
            <template v-if="type !== 'search'">
              <span class="fans" v-if="fans !== undefined">粉丝{{ fans }}</span>
              <span class="follow" v-if="follow !== undefined">关注{{ follow }}</span>
            </template>
          </div>
          <div class="bottom">
            <template v-if="type === 'search'">
              <span class="fans" v-if="fans !== undefined">粉丝{{ fans }}</span>
              <span class="follow" v-if="follow !== undefined">关注{{ follow }}</span>
            </template>
            <template v-else>
              <span class="all">总:{{ all }}</span>
              <span class="sf">
                胜/负:
                <i class="special-s">{{ s }}</i> /
                <i class="special-f">{{ all - s }}</i>
              </span>
              <!-- 只有大神榜这里才有胜率 -->
              <span class="percentage" v-if="type === 'manito' || type === 'professor'">
                {{ s | percentage(all) }}
              </span>
              <span class="combo" v-if="combo !== undefined">最近连胜:{{ combo }}次</span>
              <!-- 我的粉丝,右侧关注按钮 -->
              <div v-if="type === 'professor'" @click.stop="$emit('follow')">
                <van-button size="mini" type="danger" v-if="followRelation === 1">+关注</van-button>
                <van-button size="mini" type="danger" v-else-if="followRelation === 2">互相关注</van-button
                ><van-button size="mini" type="danger" v-else-if="followRelation === 3">取消关注</van-button>
              </div>
            </template>
          </div>
        </div>
        <div class="sufpercentage" v-if="type == 'winrate' || type == 'champion'">
          {{ s | percentage(all) }}
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script>
import xImg from 'cpt/x-img.vue'
export default {
  components: {
    xImg
  },
  name: 'x-manito-item',
  props: [
    'crown', // 皇冠
    'avatar',
    'username',
    'gender',
    'fans', // 粉丝
    'follow', // 关注
    'all',
    's', // 胜
    'combo', // 连胜
    'type', // winrate:胜率榜 champion:管军榜 professor:粉丝,关注列表 search:搜索列表
    'modeType', // 冠军榜标签类型
    'professor', // 是否专家
    'followRelation', // 当前用户与列表中用户的关注关系 , 1:未关注,2:被她关注,3:已经关注对方
    'url',
    'search'
  ],
  computed: {
    searchUserName() {
      return this.username.replace(this.search, `<i class="search">${this.search}</i>`)
    }
  }
}
</script>

<style lang="scss">
.x-manito-item {
  background-color: $baseBgColor;
  padding-top: 5px;
  .van-cell {
    background-color: $white;
    align-items: center;
    padding: 5px 10px;
  }
  .crown {
    margin-right: 5px;
    text-align: center;
    line-height: 20px;
  }
  .avatar-bar {
    overflow: hidden;
    display: flex;
    align-items: center;
    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .center {
    display: flex;
    align-items: center;
    // padding-left: 10px;
  }
  .infos {
    flex: 1;
    padding-left: 10px;
    font-size: 12px;
  }
  .top,
  .bottom {
    display: flex;
    align-items: center;
  }
  .top > .professor {
    flex: 1;
    display: flex;
    align-items: center;
    // > span {
    //   box-sizing: border-box;
    //   color: $white;
    //   background-color: $rootColor;
    //   padding: 1px;
    //   margin-right: 11px;
    //   font-size: 10px;
    //   height: 13px;
    //   width: 13px;
    //   text-align: center;
    //   border-radius: 2.5px;
    // }
  }
  .bottom {
    justify-content: space-between;
  }
  .user-name {
    font-size: 14px;
    color: $txt;
    font-weight: 600;
    margin-right: 8px;
    .search {
      color: $green;
    }
  }
  .fans,
  .follow {
    margin-left: 8px;
    color: $gray-66;
  }
  .all,
  .sf,
  .percentage,
  .combo {
    font-size: 13px;
    color: $txt;
  }
  .special-s {
    color: $rootColor;
  }
  .special-f {
    color: $green;
  }
  .percentage {
    color: $rootColor;
  }
  .sufpercentage {
    color: $rootColor;
    font-size: 15px;
    margin-left: 10px;
  }
  .tag-bar {
    padding-right: 10px;
    .tag {
      color: $white;
      width: 24px;
      height: 70px;
      border-radius: 3px;
      position: relative;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      &::after {
        display: block;
        content: '';
        position: absolute;
        background-color: $white;
        height: 24px;
        width: 24px;
        bottom: 0;
        left: 0;
        right: 0;
        transform: translateY(80%) rotateZ(45deg);
      }
      .container {
        writing-mode: vertical-rl;
        transform: scale(0.8);
        margin-bottom: 10px;
      }
    }
  }
  &.professor,
  &.search {
    padding-top: 0;
    position: relative;
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid $gray-f5;
      transform: rotateX(45deg);
    }
  }
  &.professor {
    .van-button__text {
      font-size: 12px;
    }
    .van-button--mini {
      padding: 0 5px;
    }
  }
  &.search {
    .bottom {
      justify-content: left;
      .fans,
      .follow {
        margin-left: 0;
        margin-right: 10px;
      }
    }
  }
}
</style>
