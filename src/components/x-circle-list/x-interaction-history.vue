<template>
  <div class="x-interaction-history">
    <div class="xi-middle">
      <x-user-item :info="info">
        <slot name="info"></slot>
      </x-user-item>
      <div class="xi__msg">
        <slot></slot>
      </div>
      <!-- 回复单条消息 -->
      <div class="xi__target" v-if="info.replymsgid">
        <div class="xi__target--top">
          <div class="xi__target-name">@ {{ userInfo.nick }}</div>
          <div class="xi__target-time">
            {{ info.replytime | time }}
          </div>
        </div>
        <div class="xi__target--bottom">
          <div class="xi__msg--body">
            {{ info.replytext }}
          </div>
        </div>
      </div>
      <!-- 普通晒单 -->
      <div class="xi__target" v-if="!target.plan && !info.replymsgid">
        <div class="xi__target--top">
          <div class="xi__target-name">@ {{ target.nick }}</div>
          <div class="xi__target-time">
            {{ target.time | time }}
          </div>
        </div>
        <div class="xi__target--bottom">
          <div class="xi__msg-img--bar" v-if="target.picture">
            <x-img class="xi__target-img" :src="target.picture.split(',')[0]" />
          </div>
          <div class="xi__msg--body">
            {{ target.text }}
          </div>
        </div>
      </div>
      <!-- 计划 -->
      <div class="xi__target" v-if="target.plan">
        <x-issue-item
          v-bind="{
            state: true,
            ad: target.plan.rgn0,
            planname: target.plan.title,
            type: 'grade',
            tag: target.plan.rgn1,
            integral: target.plan.cost,
            looks: target.plan.viewer,
            sum: target.plan.totalround,
            s: target.plan.totalwin,
            f: Number(target.plan.totalround) - Number(target.plan.totalwin),
            wintimes: target.plan.streak
          }"
        >
          <div class="xi__winrate">
            {{
              Number(target.plan.totalround)
                ? parseFloat((Number(target.plan.totalwin) / Number(target.plan.totalround)) * 100).toFixed(2) + '%'
                : '0%'
            }}
          </div>
        </x-issue-item>
      </div>
    </div>
  </div>
</template>

<script>
import xUserItem from 'cpt/x-circle-list/x-user-item.vue'
import xImg from 'cpt/x-img.vue'
import xIssueItem from 'cpt/x-issue-item.vue'

import { ymd } from '@/utils/formant.util.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    xUserItem,
    xImg,
    xIssueItem
  },
  name: 'x-interaction-history',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    type: String,
    target: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  filters: {
    time(val) {
      let [year, month, day] = ymd(new Date(val)).split('-')
      return `${year}年${month}月${day}日`
    }
  }
}
</script>

<style lang="scss">
.x-interaction-history {
  background-color: #f5f5f5;
  padding-bottom: 5px;
  .xi-middle {
    padding: 10px 15px;
    background-color: $white;
  }
  .x-user-item .xu__center--bottom {
    margin-top: 5px;
    color: #999999;
    font-size: 11px;
  }
  .xi__msg {
    padding: 10px 0;
    font-size: 15px;
  }
  .xi__target {
    background-color: #ededed;
    padding: 5px 8px;
  }
  .xi__target--top {
    display: flex;
    align-items: center;
  }
  .xi__target-name {
    font-size: 15px;
    color: $txt;
    margin-right: 26px;
  }
  .xi__target-time {
    font-size: 12px;
    color: $txt;
  }
  .xi__target--bottom {
    display: flex;
    // align-items: center;
    padding: 10px 0;
  }
  .xi__msg-img--bar {
    display: inline-block;
    position: relative;
    flex: none;
    width: 25%;
    padding-bottom: 25%;
  }
  .xi__target-img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .xi__msg--body {
    display: inline-block;
    padding-left: 5px;
    font-size: 13px;
    color: $txt;
  }
  .x-issue-item {
    padding: 0;
    background-color: #eeeeee;
    .grade {
      position: relative;
      &::after {
        position: absolute;
        display: block;
        content: '';
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 1px solid #d7d7d7;
        transform: rotateX(45deg);
      }
      > span {
        margin-right: 5px;
        &:first-child {
          flex: 1;
        }
        &:last-child {
          display: none;
        }
      }
    }
    .cont {
      padding: 5px 0;
    }
    .bar {
      background-color: #eeeeee;
    }
    .grade-plan .tag-bar .tag::after {
      background-color: #eee;
    }
    &:last-child {
      padding: 0;
    }
    .xi__winrate {
      font-size: 15px;
      color: $rootColor;
    }
  }
}
</style>
