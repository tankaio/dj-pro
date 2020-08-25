<template>
  <!-- <x-page isFooter active="3" closeBack rootClass="user"> </x-page> -->
  <x-layout modifier="user">
    <x-header :left-arrow="false" :is-right="false" slot="header" />
    <van-cell is-link class="userPanel" to="/user/userDetail">
      <div slot="icon" class="avatarBar" @click.stop="cameraCtr = true">
        <x-img :src="getAvatar" class="avatar" dft />
        <i class="camera-icon"></i>
      </div>
      <div slot="title" class="userInfo">
        <div class="userName">
          {{ userInfo.nick }}
          <span class="xIcon-specialist" v-if="userIdentity === 2"></span>
        </div>
        <div class="userFans">
          <span>粉丝{{ userInfo.fans }}</span>
          <span>关注{{ userInfo.follow }}</span>
        </div>
        <div class="userMoney">
          <span class="userMoneyItem">
            <span class="xIcon-integral-money"></span>
            <span>积分:{{ userInfo.balan_m }}</span>
          </span>
          <span class="userMoneyItem">
            <span class="xIcon-gold-money"></span>
            <span>金币:{{ userInfo.balan_c }}</span>
          </span>
        </div>
      </div>
    </van-cell>
    <van-cell-group>
      <van-cell is-link title="申请成为专家" v-if="userIdentity !== 2" to="/user/special">
        <span slot="icon" class="xIcon-export-cm"></span>
      </van-cell>
      <van-cell is-link title="我的发布" v-else to="/userInfo/userInfoPlan">
        <span slot="icon" class="xIcon-publish-cm"></span>
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell is-link title="我要赚钱" to="/user/makeMoney">
        <span slot="icon" class="xIcon-money-cm"> </span>
      </van-cell>
      <van-cell is-link title="积分充值/兑换" to="/user/integral">
        <span slot="icon" class="xIcon-integral-cm"></span>
      </van-cell>
      <van-cell is-link title="金币提现" @click="onGlobWithdraw">
        <span slot="icon" class="xIcon-gold-cm"></span>
      </van-cell>
      <van-cell is-link title="账户清单" to="/user/bill">
        <span slot="icon" class="xIcon-bill-cm"></span>
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell is-link title="我的关注" to="/user/follow">
        <span slot="icon" class="xIcon-follow-cm"></span>
        <x-img :src="item" class="avatar" v-for="(item, index) in getFollowHasplan" :key="index" />
      </van-cell>
      <van-cell is-link title="我的粉丝" to="/user/fans">
        <span slot="icon" class="xIcon-fans-cm"></span>
        <x-img :src="item" class="avatar" v-for="(item, index) in getFansHasplan" :key="index" />
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell is-link title="站内信" :class="{ newMsg: getNewMsg }" to="/messageList">
        <span slot="icon" class="xIcon-msg-cm"></span>
      </van-cell>
      <van-cell is-link title="更多" to="more">
        <span slot="icon" class="xIcon-more-cm"></span>
      </van-cell>
    </van-cell-group>
    <van-popup get-container="#box" class="uploadAvatarOptionPop" v-model="cameraCtr" position="bottom">
      <van-button class="uploadBtn">
        <input type="file" accept="image/*;" class="upload" @change="onChange" ref="file1" capture="camera" />
        拍照
      </van-button>
      <van-button class="uploadBtn">
        <input type="file" accept="image/*" class="upload" @change="onChange" ref="file2" />
        从手机相册选择
      </van-button>
      <van-button class="uploadBtn cancelBtn" @click="cameraCtr = false">
        取消
      </van-button>
    </van-popup>
    <van-popup get-container="#box" class="cropperBar" v-model="cropCtr">
      <vueCropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="true"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixedBox="option.fixedBox"
        id="vue-cropper"
        centerBox
        @imgLoad="imgLoad"
      >
      </vueCropper>
      <div class="btnBar">
        <van-button type="danger" size="small" @click="cropperFirm">确定</van-button>
        <van-button size="small" @click="cropperCancel">取消</van-button>
      </div>
    </van-popup>
  </x-layout>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { uploadAvatar, getMyInfo } from '@/api/user'
import { mapGetters, mapMutations } from 'vuex'

import xPage from 'cpt/x-page.vue'
import xImg from 'cpt/x-img.vue'

export default {
  name: 'user',
  components: {
    VueCropper,
    xPage,
    xImg
  },
  data() {
    return {
      avatar: '',
      specialist: true,
      cameraCtr: false,
      cropCtr: false,
      img: '',
      option: {
        img: '',
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 128,
        autoCropHeight: 128,
        fixedBox: true
      }
    }
  },
  methods: {
    ...mapMutations([]),
    async onChange(e) {
      let localimg = e.target.files[0]
      let reader = new FileReader()
      reader.onload = e => {
        this.cameraCtr = false
        this.cropCtr = true
        this.option.img = e.target.result
      }
      reader.readAsDataURL(localimg)
    },
    imgLoad(res) {
      if (res !== 'success') {
        this.$notify('图片打开失败!!')
      }
    },
    cropperCancel() {
      this.cropCtr = false
      this.$refs.cropper.clearCrop()
    },
    cropperFirm() {
      this.cropCtr = false
      this.$refs.cropper.getCropData(data => {
        uploadAvatar(data).then(res => {
          this.$refs.file1.value = ''
          this.$refs.file2.value = ''
          this.avatar = data
        })
      })
    },
    onGlobWithdraw() {
      if (!this.getBkInfo.bknum) {
        G.$dialog
          .confirm({
            title: '绑定银行卡',
            message: '您还没绑定银行卡，请先进行绑定',
            confirmButtonText: '绑定银行卡'
          })
          .then(() => {
            this.$router.push('/user/bindCard')
          })
          .catch(() => {})
      } else if (!this.userInfo.phone) {
        G.$dialog
          .confirm({
            title: '绑定手机号',
            message: '您还没绑定手机号，请先进行绑定',
            confirmButtonText: '绑定手机号'
          })
          .then(() => {
            this.$router.push('/user/bindPhone')
          })
          .catch(() => {})
      } else {
        this.$router.push('/user/withdraw')
      }
    },
    async getMyInfo() {
      let { ok, msg } = await getMyInfo()
      if (ok) {
        let get_data = G.curry(G.get)(msg)
        this.newMsg = get_data('newmsg')
      }
    }
  },
  computed: {
    ...mapGetters(['getAvatar', 'userIdentity', 'userInfo', 'getFansHasplan', 'getFollowHasplan', 'getNewMsg', 'getBkInfo'])
  },
  created() {
    this.getMyInfo()
  }
}
</script>

<style lang="scss">
.page-user-root {
  background-color: $white;
  .userPanel {
    padding: 27px 16px;
    &::after {
      display: none;
    }
    .avatarBar {
      position: relative;
      height: 60px;
      width: 60px;
      background-color: $avatarFill;
      border-radius: 50%;
      // overflow: hidden;
      .avatar {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        overflow: hidden;
      }
      .camera-icon {
        bottom: 4px;
        right: 4px;
      }
    }
    .userInfo {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding-left: 13px;
      > * {
        flex: 1;
      }
      .userName {
        font-size: 15px;
        font-weight: 600;
        color: $txt;
        display: flex;
        align-items: center;
        .xIcon-specialist {
          margin-left: 5px;
        }
      }
      .userFans {
        line-height: 1;
        > * {
          margin-right: 10px;
        }
      }
      .userFans {
        font-size: 12px;
        color: $txt;
      }
      .userMoney {
        font-size: 11px;
        color: $gray-66;
        display: flex;
        .userMoneyItem {
          line-height: 1;
          flex: 1;
          display: flex;
          align-items: center;
          > * {
            white-space: nowrap;
          }
          > span:nth-child(1) {
            margin-right: 5px;
          }
        }
      }
    }
    .van-icon {
      line-height: 60px;
      color: $gray-99;
    }
  }
  .van-cell-group {
    .van-cell {
      align-items: center;
      &.newMsg .van-cell__title ::after {
        content: '';
        display: inline-block;
        position: relative;
        border-radius: 50%;
        height: 8px;
        width: 8px;
        background-color: $rootColor;
        vertical-align: top;
        margin-left: 5px;
      }
    }
    .van-cell__title {
      font-size: 15px;
      color: $txt;
      margin-left: 16px;
    }
    .van-cell__value {
      height: 25px;
      overflow: hidden;
      .avatar {
        display: inline-block;
        height: 25px;
        width: 25px;
        border-radius: 50%;
        background-color: $baseBgColor;
        overflow: hidden;
        &:not(:nth-child(1)) {
          margin-left: -5px;
        }
      }
    }
  }
}
.van-popup.uploadAvatarOptionPop {
  display: flex;
  flex-direction: column;
  background-color: transparent;

  .uploadBtn {
    position: relative;
    border: none;
    border-radius: unset;
    &:nth-child(1) {
      border-bottom: 1px solid $gray-f5;
    }
    &.cancelBtn {
      margin-top: 8px;
    }
    .upload {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      opacity: 0;
    }
  }
}
.van-popup.cropperBar {
  background-color: transparent;
  #vue-cropper,
  .vue-cropper {
    width: 100vw;
    height: 50vh;
  }
  .btnBar {
    padding-top: 20px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
