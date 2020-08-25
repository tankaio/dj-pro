<template>
  <div class="page-ToutiaoDetial-root">
    <x-header @click-right="isShowReport = true">
      <van-icon name="warn-o" />
    </x-header>

    <!-- 六合奖期展示 -->
    <transition>
      <div class="lotteryBar van-hairline--bottom" :class="{ sticky: isLotteryFold }">
        <x-lottery
          :url="`/awardInfo/awardDetail/${getNowIssue.round}`"
          :period="`${getNowIssue.date}第${getNowIssue.round}期`"
          :nums="[1, 2, 3, 4, 5, 6, 7]"
          pure
          isLotteryNum
          :right-arrow="false"
          :class="{ fold: isLotteryFold }"
        />
        <div class="ctrBtn" @click="toggleLotteryFold"></div>
      </div>
    </transition>

    <!-- 发帖人信息展示 -->
    <!-- 这里有吸附效果 -->
    <x-sticky ref="sticky">
      <div class="authorInfo van-hairline--bottom">
        <x-img class="avatar" dft></x-img>
        <div class="info">
          <div class="authorName">美术生</div>
          <div class="publishTime">2019.11.28 17:01</div>
        </div>
        <div class="authorFans">粉丝:123</div>
        <van-button size="small" type="danger" plain round>+关注</van-button>
      </div>
    </x-sticky>

    <!-- 正文部分 -->
    <div class="textMain">
      <!-- 开放内容 -->
      <h2 class="textTitle">
        知乎是什么？
      </h2>
      <div class="text">
        知乎是一家创立于2011年1月26日的中国大陆社会化问答网 站，产品形态与美国同类网站Quora类似。[5]“知乎”在文言
        文中意为“知道吗”。[6]2012年2月底，知乎使用“发现更大 的世界”作为其宣传口号。截至2017年9月20日，知乎注册 用户数超1亿
        ，日活跃用户量达2600万，人均日访问时长1 小时，月浏览量180亿。[7]截至2016年5月，知乎累计产生
        了1000万个提问、3400万个回答和3500万个赞同。
      </div>
      <div class="textAlbum">
        <div class="albumBar" v-for="(item, index) in 5" :key="index" @click="onOpenAlbum(['', '', '', '', ''], index)">
          <x-img class="album" dft />
        </div>
      </div>

      <!-- 条件内容 -->
      <div class="conditionText" v-if="isAcheiveConditionC">
        <div class="text">
          知乎是一家创立于2011年1月26日的中国大陆社会化问答网 站，产品形态与美国同类网站Quora类似。[5]“知乎”在文言
          文中意为“知道吗”。[6]2012年2月底，知乎使用“发现更大 的世界”作为其宣传口号。截至2017年9月20日，知乎注册 用户数超1亿
          ，日活跃用户量达2600万，人均日访问时长1 小时，月浏览量180亿。[7]截至2016年5月，知乎累计产生
          了1000万个提问、3400万个回答和3500万个赞同。
        </div>
        <div class="textAlbum">
          <div class="albumBar" v-for="(item, index) in 5" :key="index">
            <x-img class="album" dft />
          </div>
        </div>
      </div>
    </div>

    <!-- 限制条件 -->
    <div class="condition" v-if="viewStatus && !isAcheiveConditionC">
      <i> {{ viewStatus === 1 ? '回复' : '打赏' }}</i>
      20积分可查看隐藏内容
    </div>

    <!-- 打赏操作,展示区,分享 -->
    <div class="funs">
      <div class="center">
        <div class="shang" @click="isShowAward = true">赏</div>
        <div class="desc">已有5人打赏200积分</div>
        <div class="sponsors">
          <x-img dft class="sponsor" v-for="(item, index) in 5" :key="index" />
        </div>
      </div>
      <div class="share">
        <van-icon name="share" />
        <div>晒单圈</div>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="textComments">
      <div class="title van-hairline--bottom">全部评论</div>
      <div class="textComment van-hairline--bottom">
        <x-img dft class="userAvatar" />
        <div class="comment">
          <div class="userNick">Design360</div>
          <div class="text">
            我是评论内容最多最多我是评论内容最多最多我是评 论内容最多最多我是评论内容最多最多我是评论内容 最多最多200个字
          </div>
          <div class="time">2019.12.12 14:48:15</div>
          <!-- 中奖状态图 -->
          <div class="win-bg" v-if="isActivity" />
        </div>
      </div>
    </div>

    <!-- footer区 -->
    <div class="footer van-hairline--top">
      <!-- 非活动帖 -->
      <van-field v-if="!isActivity" placeholder="写评论..." disabled @click="isShowCommentPut = true">
        <van-icon slot="left-icon" name="edit" />
      </van-field>
      <span><van-icon name="comment-o" />99+</span>

      <!-- 参与活动按钮 -->
      <van-button
        @click="onJoinActivity"
        class="activityBtn"
        size="small"
        :disabled="!!activityStatus"
        plain
        round
        :type="activityStatus ? 'default' : 'danger'"
        v-if="isActivity"
      >
        {{ activityBtnStatusText[activityStatus] }}
      </van-button>

      <span><van-icon name="good-job-o" />999+</span>
    </div>

    <!-- 评论输入框 -->
    <van-popup get-container="#box"  v-model="isShowCommentPut" position="bottom" close-on-popstate>
      <div class="commentPanel">
        <div class="header">
          <x-img dft class="userAvatar" />
          <span class="userNick">Design360</span>
          <van-button :type="msgModel ? 'danger' : 'default'" size="small" plain round @click="onSendComment">发送</van-button>
        </div>
        <van-field type="textarea" v-model="msgModel" placeholder="写评论..." />
      </div>
    </van-popup>

    <!-- 打赏积分窗口 -->
    <van-popup get-container="#box"  v-model="isShowAward" :close-on-click-overlay="false" close-on-popstate>
      <div class="awardPop">
        <div class="awardPanel">
          <div class="closeBtn close-circle" @click="isShowAward = false" />
          <div class="userInfo">
            <x-img dft class="userAvatar" />
            <span class="userNick">美术生的那些事</span>
            <span :class="1 | Gander('icon')"></span>
            <span class="xIcon-specialist"></span>
          </div>
          <div class="awardOptions">
            <div class="awardBtnGroup">
              <van-button type="default" size="small" plain v-for="(item, index) in awardBtns" :key="index" @click="awardModel = item">
                {{ item }}积分
              </van-button>
              <van-field type="number" placeholder="输入打赏积分(填写范围1-9999)" v-model="awardModel" />
              <van-button
                class="awardBtn"
                :disabled="awardModel === ''"
                :type="awardModel ? 'danger' : 'default'"
                size="small"
                plain
                round
                @click="onAward"
              >
                打赏ta
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 参与活动弹窗 -->
    <van-popup get-container="#box"  v-model="isShowActivity" close-on-popstate>
      <div class="activityPop">
        <div class="tit van-hairline--bottom">参与活动</div>
        <div class="main">
          <div class="item">
            <div class="label">活动期号：</div>
            <div class="value">134期</div>
          </div>
          <div class="item">
            <div class="label">活动玩法：</div>
            <div class="value">
              <div class="select" tabindex="0" @blur="isShowActivitySelectOptions = false" @click="isShowActivitySelectOptions = true">
                {{ activityFns[activityFn] }}
                <transition enter-active-class="fadeIn animated faster" leave-active-class="fadeOut animated faster">
                  <div
                    class="options"
                    v-if="isShowActivitySelectOptions"
                    @click.stop="isShowActivitySelectOptions = false"
                    @touchmove.stop="isShowActivitySelectOptions = false"
                    @touchstart.stop="isShowActivitySelectOptions = false"
                  >
                    <div class="van-hairline--bottom" @click="activityFn = 0">特码直选</div>
                    <div class="van-hairline--bottom" @click="activityFn = 1">特码大小</div>
                    <div class="van-hairline--bottom" @click="activityFn = 2">特码单双</div>
                    <div class="van-hairline--bottom" @click="activityFn = 3">特码色波</div>
                    <div class="van-hairline--bottom" @click="activityFn = 4">特码生肖</div>
                  </div>
                </transition>
              </div>
              <!-- {{ activityFns[activityFn] }} -->
            </div>
          </div>
          <div class="item">
            <div class="label">中奖金额：</div>
            <div class="value">888积分</div>
          </div>
          <div class="item" :class="{ ignore: activityFn === 4 }">
            <div class="label">竞猜号码：</div>
            <div class="value">
              <!-- 特码直选 -->
              <template v-if="activityFn === 0">
                <van-field class="tmzx" v-model="activityModel" type="number" placeholder="输入号码" />
              </template>
              <!-- 特码大小 -->
              <template v-if="activityFn === 1">
                <van-radio-group v-model="activityModel">
                  <van-radio name="大" checked-color="#FF0000">大</van-radio>
                  <van-radio name="小" checked-color="#FF0000">小</van-radio>
                </van-radio-group>
              </template>
              <!-- 特码单双 -->
              <template v-if="activityFn === 2">
                <van-radio-group v-model="activityModel">
                  <van-radio name="单" checked-color="#FF0000">单</van-radio>
                  <van-radio name="双" checked-color="#FF0000">双</van-radio>
                </van-radio-group>
              </template>
              <!-- 特码色波 -->
              <template v-if="activityFn === 3">
                <van-radio-group v-model="activityModel">
                  <van-radio name="红" checked-color="#FF0000">红</van-radio>
                  <van-radio name="绿" checked-color="#FF0000">绿</van-radio>
                  <van-radio name="蓝" checked-color="#FF0000">蓝</van-radio>
                </van-radio-group>
              </template>
              <!-- 特码生肖 -->
              <template v-if="activityFn === 4">
                <van-checkbox-group v-model="zadic">
                  <van-checkbox :name="item" v-for="(item, index) in zadicMap" :key="index">
                    <template slot="icon">
                      {{ item }}
                    </template>
                    <!-- <span slot="icon" slot-scope="props" :class="{ active: props.checked }">{{ item }}</span> -->
                  </van-checkbox>
                </van-checkbox-group>
              </template>
            </div>
          </div>
          <div class="item ignore">
            <div class="label">说点什么：</div>
            <div class="value">
              <van-field type="textarea" class="activityMsg" v-model="activityMsgModel" />
            </div>
          </div>
        </div>
        <van-button
          class="activityPost"
          size="small"
          :disabled="!canIPostActivity"
          :type="canIPostActivity ? 'danger' : 'default'"
          plain
          round
          @click="onActivityPost"
        >
          点击提交
        </van-button>
      </div>
    </van-popup>

    <!-- 举报弹窗 -->
    <van-popup get-container="#box"  v-model="isShowReport">
      <div class="reportPanel">
        <div class="tit van-hairline--bottom">
          举报
        </div>
        <div class="main">
          <div class="label">
            举报类型
          </div>
          <van-checkbox-group v-model="reportModel">
            <van-checkbox name="广告信息" shape="square" checked-color="#FF0000">广告信息</van-checkbox>
            <van-checkbox name="欺诈信息" shape="square" checked-color="#FF0000">欺诈信息</van-checkbox>
            <van-checkbox name="违规信息" shape="square" checked-color="#FF0000">违规信息</van-checkbox>
            <van-checkbox name="无效内容" shape="square" checked-color="#FF0000">无效内容</van-checkbox>
          </van-checkbox-group>
          <van-field type="textarea" placeholder="请填写具体举报原因，感谢您的支持 和帮助" v-model="reportMsgModel" />
        </div>
        <van-button
          class="reportPostBtn"
          :disabled="!reportModel.length"
          size="small"
          :type="!reportModel.length ? 'default' : 'danger'"
          plain
          round
          @click="onPostReport"
        >
          点击提交
        </van-button>
      </div>
    </van-popup>

    <!-- 查看大图 -->
    <x-img-view ref="xiv" :is-footer="false" :idx="albumIndex" :picture="albumPicture" @close="albumPicture = []" />
  </div>
</template>

<script>
import xHeader from 'cpt/x-header'
import xImg from 'cpt/x-img'
import xLottery from 'cpt/x-lottery/x-lottery'
import xImgView from 'cpt/x-img-view'
import xSticky from 'cpt/x-sticky'

import { mapGetters } from 'vuex'
export default {
  components: { xHeader, xLottery, xImg, xImgView, xSticky },
  data() {
    return {
      albumIndex: 0, // 相册当前下标
      albumPicture: [], // 大图相册
      isShowCommentPut: false, // 留言回复弹窗
      isShowAward: false, // 打赏弹窗
      isShowActivity: false, // 活动弹窗
      isShowReport: false, // 举报弹窗
      isActivity: false, // 是否活动帖
      isLotteryFold: false, // 是否折叠奖期
      isAcheiveCondition: false, // 是否达到观看条件
      viewStatus: 1, // 帖子的可见状态 0 公开 1 回复可见 2 打赏可见
      activityStatus: 0, // 活动状态 0 未参加 1 已参加 2 活动结束了
      activityBtnStatusText: ['参与活动', '已参与', '活动已结束'], // 按钮状态
      awardBtns: [1, 5, 10, 20, 50],
      isShowActivitySelectOptions: false,
      activityFn: 0, // 活动玩法
      activityFns: ['特码直选', '特码大小', '特码单双', '特码色波', '特码生肖'],
      msgModel: '', // 留言内容
      awardModel: '', // 打赏
      activityModel: '', // 特码直选
      activityMsgModel: '', // 参与活动留言
      reportMsgModel: '', // 举报留言信息
      reportModel: [], // 举报选项信息
      zadic: [],
      zadicMap: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    }
  },
  computed: {
    ...mapGetters(['getNowIssue']),
    // 我能提交活动么?
    canIPostActivity() {
      if (this.activityFn === 4) {
        return !!this.zadic.length
      } else {
        return this.activityModel !== ''
      }
    },
    isAcheiveConditionC() {
      if (this.isAcheiveCondition && this.viewStatus) {
        return true
      }
      if (!this.viewStatus) {
        return true
      }
      return false
    }
  },
  methods: {
    onSendComment() {
      this.isShowCommentPut = false
      this.$notify({
        message: '评论成功！'
      })
      if (this.viewStatus === 1) this.isAcheiveCondition = true
    },
    onAward() {
      if (this.awardModel === '') return
      this.isShowAward = false
      if (Math.random() > 0.5) {
        this.$notify({
          message: '打赏成功！感谢你的支持。'
        })
        if (this.viewStatus === 2) this.isAcheiveCondition = true
      } else {
        G.$dialog
          .confirm({
            message: '您的剩余积分不足，请先充值后 再来打赏吧！',
            confirmButtonText: '去充值'
          })
          .then(() => {})
          .catch(() => {})
      }
    },
    onJoinActivity() {
      this.isShowActivity = true
    },
    onActivityPost() {
      this.isShowActivity = false
      this.activityStatus = 1
      this.$notify({
        message: '参与成功！'
      })
    },
    onPostReport() {
      this.isShowReport = false
      this.$notify({
        message: '举报已发送！'
      })
    },
    onOpenAlbum(picture, idx) {
      this.albumIndex = idx
      this.albumPicture = picture
      this.$refs.xiv.onClickImg(idx)
    },
    toggleLotteryFold() {
      this.isLotteryFold = !this.isLotteryFold
      G.delay(() => this.$refs.sticky.stickyJudge(), 100)
    }
  }
}
</script>

<style lang="scss">
.page-ToutiaoDetial-root {
  padding-bottom: 49px;
  .van-icon {
    color: $white;
  }
  .lotteryBar {
    position: relative;
    .period-bar {
      overflow: hidden;
    }
    &.sticky {
      position: fixed;
      top: 44px;
      z-index: 5;
      width: 100%;
    }
    &.van-hairline--bottom::after {
      z-index: 5;
    }

    .x-lottery {
      z-index: 4;
      position: relative;
      background-color: $white;
      overflow: hidden;
      &.fold {
        height: 0;
      }
    }
    .ctrBtn {
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 94px;
      height: 48px;
      border-radius: 12px;
      transform-origin: 50% 50%;
      transform: translateX(-50%) scale(0.5) translateY(100%);
      box-shadow: 0 0 3px 0 rgba($color: #000000, $alpha: 0.2);
      background-image: linear-gradient(0deg, #d2cfd2, #fffeff 40%);
      z-index: 3;
      &:after {
        display: block;
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-top: 3px solid #000;
        border-right: 3px solid #000;
        left: 50%;
        top: 60%;
        transform: translateX(-50%) rotateY(0deg) rotateX(45deg) rotateZ(-45deg);
      }
    }
  }
  .authorInfo {
    display: flex;
    height: 50px;
    align-items: center;
    padding: 0 15px;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
    .info {
      margin-left: 10px;
      flex: 1;
      .authorName {
        font-size: 14px;
        color: $txt;
      }
      .publishTime {
        margin-top: 5px;
        font-size: 11px;
        color: $gray-66;
      }
    }
    .authorFans {
      font-size: 13px;
      color: $gray-66;
    }
    .van-button {
      margin-left: 27px;
      height: 22px;
      line-height: 22px;
    }
  }
  .textMain {
    background-color: $white;
    padding: 0 15px;
    .textTitle {
      color: $txt;
      font-size: 15px;
      font-weight: 600;
      padding: 16px 0;
    }
    .text {
      font-size: 13px;
      color: $txt;
      line-height: 20px;
      letter-spacing: 1px;
      padding: 4px 0;
    }
  }
  .condition {
    margin-top: 20px;
    background-color: $cyan-f;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 13px;
    color: $txt;
    > i {
      color: $blue-07f;
      text-decoration: underline;
    }
  }
  .funs {
    height: 134px;
    position: relative;
    .center {
      width: 60%;
      margin: 0 auto;
      height: 134px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .shang {
        background-color: $yellow-fc1;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        text-align: center;
        line-height: 40px;
        color: $white;
        font-size: 18px;
        font-weight: 600;
      }
      .desc {
        font-size: 13px;
        color: $txt;
        text-align: center;
        margin-top: 15px;
      }
      .sponsors {
        margin-top: 6px;
        display: flex;
        .sponsor {
          width: 30px;
          height: 30px;
          box-sizing: border-box;
          border-radius: 50%;
          overflow: hidden;
          &:not(:nth-child(1)) {
            margin-left: -15px;
          }
        }
      }
    }
    .share {
      width: 20%;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      height: 134px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: $txt;
      .van-icon {
        font-size: 28px;
        color: $green-0b6;
        margin-bottom: 5px;
      }
    }
  }
  .textAlbum {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0 10px;
    .albumBar {
      width: 32%;
      padding-bottom: 32%;
      position: relative;
      margin-top: 2%;
      margin-right: 2%;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .album {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        pointer-events: unset;
      }
    }
  }
  .textComments {
    .title {
      position: relative;
      height: 35px;
      line-height: 35px;
      color: $txt;
      font-size: 13px;
      padding-left: 25px;
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: 4px;
        height: 16px;
        background-color: $rootColor;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .textComment {
      padding: 10px 15px 0;
      display: flex;
      .userAvatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        overflow: hidden;
      }
      .comment {
        flex: 1;
        margin-left: 5px;
        position: relative;
        .win-bg {
          position: absolute;
          top: 5px;
          right: 0;
          z-index: 10;
        }
        .userNick {
          height: 35px;
          line-height: 35px;
          font-size: 13px;
          color: $txt;
          font-weight: 600;
        }
        .text {
          font-size: 13px;
          color: $txt;
          line-height: 18px;
        }
        .time {
          height: 20px;
          line-height: 20px;
          color: $gray-99;
          font-size: 11px;
          text-align: right;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 49px;
    background-color: $white;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-evenly;
    box-sizing: border-box;
    z-index: 10;
    .van-field {
      background-color: $gray-f5;
      height: 30px;
      padding: 3px 5px;
      border-radius: 15px;
      width: 200px;
    }
    .van-icon {
      color: $gray-66;
    }
    .activityBtn {
      height: 26px;
      line-height: 26px;
      width: 155px;
    }
    > span {
      display: flex;
      align-items: center;
      color: $gray-66;
      font-size: 13px;
      .van-icon {
        margin-right: 3px;
      }
    }
  }
  .commentPanel {
    height: 110px;
    padding: 10px 15px;
    background-color: $white;
    .header {
      display: flex;
      align-items: center;
      .userAvatar {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        overflow: hidden;
      }
      .userNick {
        font-size: 11px;
        color: $txt;
        margin-left: 10px;
        flex: 1;
      }
      .van-button {
        height: 25px;
        line-height: 25px;
        color: $rootColor;
        &.van-button--default {
          color: $gray-99;
        }
      }
    }
  }
  .van-popup {
    background-color: transparent;
  }
  .awardPop {
    padding-top: 30px;
    position: relative;
    .awardPanel {
      border-radius: 5px;
      overflow: hidden;
      width: 275px;

      .closeBtn {
        border-color: $white;
        position: absolute;
        top: 0;
        right: 0;
        &::after,
        &::before {
          border-color: $white;
        }
      }
      .userInfo {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $gray-e6;
        height: 81px;
        > * {
          margin-right: 10px;
        }
        .userAvatar {
          overflow: hidden;
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
        .userNick {
          font-size: 14px;
          font-weight: 600;
          color: $txt;
        }
      }
      .awardOptions {
        height: 250px;
        background-color: $white;
        padding: 20px;
        box-sizing: border-box;
        .van-button {
          margin-right: 20px;
          margin-bottom: 20px;
          &:nth-child(3n) {
            margin-right: 0;
          }
        }
        .van-field {
          padding: 2px 10px;
          border-radius: 5px;
          border: 1px solid $gray-d6;
        }
        .awardBtn {
          height: 30px;
          line-height: 30px;
          width: 100px;
          display: block;
          margin: 30px auto;
          &.van-button--default {
            color: $gray-99;
          }
        }
      }
    }
  }
  .activityPop {
    width: 275px;
    border-radius: 5px;
    background-color: $white;
    padding-bottom: 15px;
    .tit {
      text-align: center;
      line-height: 42px;
      height: 42px;
      font-size: 15px;
      color: $txt;
      font-weight: 600;
    }
    .main {
      padding: 0 20px;
      font-size: 13px;
      .item {
        margin-top: 16px;
        display: flex;
        align-items: center;
        &.ignore {
          align-items: unset;
        }
        .label {
          color: $txt;
          padding: 2px 0;
        }
        .value {
          flex: 1;
          text-align: right;
          .van-field {
            border: 1px solid $gray-d7;
          }
          .tmzx {
            padding: 0 10px;
          }
          .activityMsg {
            padding: 5px;
          }
          .van-radio-group {
            display: flex;
            justify-content: space-evenly;
          }
          .van-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            .van-checkbox__icon {
              width: 20px;
              height: 20px;
              box-sizing: border-box;
              border-radius: 50%;
              border: 1px solid $gray-99;
              text-align: center;
              line-height: 20px;
              font-size: 11px;
              color: $txt;
              margin-right: 8px;
              margin-bottom: 8px;
              &:nth-child(6n) {
                margin-right: 0;
              }
              &.van-checkbox__icon--checked {
                color: $white;
                background-color: $rootColor;
                border: none;
              }
            }
          }
          .select {
            display: inline-block;
            position: relative;
            height: 25px;
            width: 80px;
            max-width: 80px;
            line-height: 25px;
            text-align: center;
            border-radius: 2px;
            border: 1px solid $gray-99;
            box-sizing: border-box;
            font-size: 12px;
            outline: none;
            .options {
              position: absolute;
              box-sizing: border-box;
              top: 100%;
              width: 80px;
              left: -1px;
              z-index: 1;
              background-color: $white;
              border: 1px solid $gray-99;
              border-top: none;
              border-radius: 2px;
              box-shadow: 0 1px 8px 0 rgba($color: #000000, $alpha: 0.1);
            }
          }
        }
      }
    }
    .activityPost {
      height: 27px;
      line-height: 27px;
      width: 118px;
      display: block;
      margin: 15px auto 0;
    }
  }
  .reportPanel {
    background-color: $white;
    border-radius: 5px;
    overflow: hidden;
    width: 275px;
    .tit {
      text-align: center;
      height: 42px;
      line-height: 42px;
      font-size: 15px;
      color: $txt;
      font-weight: 600;
    }
    .main {
      padding: 20px;
      .label {
        font-size: 13px;
        color: $txt;
      }
      .van-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        .van-checkbox {
          width: 50%;
          margin-top: 15px;
        }
      }
      .van-field {
        border: 1px solid $gray-d7;
        border-radius: 2px;
        padding: 5px;
        margin-top: 15px;
      }
    }
    .reportPostBtn {
      width: 118px;
      height: 27px;
      line-height: 27px;
      display: block;
      margin: 15px auto;
    }
  }
}
</style>
