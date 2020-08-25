<template>
  <div class="page-DesignatedBookMarker-root">
    <x-header :is-right="false" />
    <x-fixed :offset-top="44" bar-height="54">
      <van-search v-model="value" placeholder="成员名" show-action @search="onSearch" @cancel="onCancel" />
    </x-fixed>
    <van-cell class="member">
      <template #icon>
        <x-img src="" class="avatar" dft />
      </template>
      <template #title>
        <span class="username">
          彭于晏
        </span>
        <van-tag type="danger">庄家</van-tag>
      </template>
      <van-button type="warning" size="small" @click="onDesignationBookmarker">
        设为庄家
      </van-button>
    </van-cell>

    <van-dialog
      get-container="#box" 
      v-model="show"
      title="权限设置"
      show-cancel-button
      @confirm="onAuthConfirm"
      :class="{ confirm_btn_disable: confirm_btn_disable }"
    >
      <van-field type="tel" v-model="bookmarker" label="当庄次数:" />
      <van-field type="tel" v-model="upper_bet_num" label="最高投注额:" />
      <van-field type="tel" v-model="max_red_num" label="最多红包个数:" />
    </van-dialog>
  </div>
</template>

<script>
import { SetNiuNiuBanker } from '@/api/chat'
import { mapGetters } from 'vuex'

import xHeader from 'cpt/x-header.vue'
import xFixed from 'cpt/x-fixed.vue'
import xImg from 'cpt/x-img.vue'

export default {
  components: {
    xHeader,
    xFixed,
    xImg
  },
  data() {
    return {
      value: '',
      show: false,
      bookmarker: '',
      upper_bet_num: '',
      max_red_num: '',
      sys_upper_bet_num: '', //后台设置最高投注额
      sys_max_red_num: '' // 后台配置最高红包数
    }
  },
  computed: {
    ...mapGetters(['getRid']),
    confirm_btn_disable() {
      if (this.bookmarker && this.upper_bet_num && this.max_red_num) {
        return false
      }
      return true
    }
  },
  methods: {
    onSearch() {},
    onCancel() {},
    onAuthConfirm() {
      // 判断钱包余额是否不少于X，X=弹框内输入的最高投注额x弹框内最多红包个数x该房间最高赔率
      // 余额不足
      G.$dialog.alert({
        title: '通知',
        message: `用户${''}余额不足以当庄`
      })
      // 余额充足判断是否在线

      // 在线
      // 设置庄家

      // 不在线,弹窗通知
      G.$dialog.alert({
        title: '通知',
        message: '该成员不在聊天室，无法指定为庄家'
      })
    },
    onDesignationBookmarker() {
      G.$dialog
        .confirm({
          title: '庄家设定',
          message: '确定设定该用户为庄家吗?'
        })
        .then(async () => {
          // 用户非管理员,弹出“权限设置”弹框
          if (true) {
            this.show = true
            return
          }

          let { ok, msg } = await SetNiuNiuBanker({
            banker: 'test111'
          })

          if (ok) {
            this.$notify({
              type: 'success',
              message: '设置庄家成功'
            })
            this.go(-1)
          }
        })
    }
  }
}
</script>

<style lang="scss">
.page-DesignatedBookMarker-root {
  .van-search {
    display: flex;
    padding-right: 12px;
  }
  .van-search__action {
    background-color: $rootColor;
    color: $white;
    border-radius: 2.5px;
    margin-left: 10px;
    overflow: hidden;
  }
  .member {
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
    .van-cell__title {
      display: flex;
      align-items: center;
      .username {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
    .van-cell__value {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .confirm_btn_disable {
    .van-dialog__confirm {
      opacity: 0.8;
      pointer-events: none;
    }
  }
}
</style>
