<template>
  <!-- <x-bind-page rootClass="card" tip="温馨提示：请使用本人银行卡号以便顺利出款" :center-text="centerText"></x-bind-page> -->
  <x-layout :main-top="78" modifier="card">
    <template #header>
      <x-header :left-arrow="false">
        <template slot="left">取消</template>
      </x-header>
      <div class="tip">温馨提示：请使用本人银行卡号以便顺利出款</div>
    </template>

    <van-field
      disabled
      is-link
      clearable
      arrow-direction="down"
      label="提款银行"
      placeholder="请选择提款银行"
      v-model="bank"
      @click="bankShow = true"
    >
      <template slot="right-icon">
        <!-- <van-icon name="arrow-down" /> -->
      </template>
    </van-field>
    <van-field clearable label="账户姓名" placeholder="请输入本人真实姓名绑定后无法修改" v-model="accountName" :disabled="getBkInfo.owner" />
    <van-field type="tel" clearable label="银行账号" placeholder="请输入银行卡账号" v-model="bankId"></van-field>
    <van-field
      disabled
      is-link
      clearable
      arrow-direction="down"
      label="开户省市"
      placeholder="请选择（省、直辖市）"
      v-model="city"
      @click="cityShow = true"
    ></van-field>
    <van-field clearable label="开户网点" placeholder="请输入开户网点" v-model="pointer"></van-field>

    <div class="btn">
      <van-button type="danger" v-if="!bkInfo" @click="BindBkCard">绑定</van-button>
      <van-button type="danger" v-if="bkInfo" @click="BindBkCard">确认修改</van-button>
      <van-button type="danger" v-if="bkInfo" @click="unBindBkCard">解绑银行卡</van-button>
    </div>

    <van-popup get-container="#box" v-model="bankShow" position="bottom">
      <van-picker :columns="columns" @change="onChange" title="开户银行" show-toolbar @cancel="bankPickerCancel" @confirm="bankPickerConfirm" />
    </van-popup>
    <van-popup get-container="#box" v-model="cityShow" position="bottom">
      <van-area :area-list="areaList" @change="onCityChange" @cancel="cityPickerCancel" @confirm="cityPickerConfirm" />
    </van-popup>
  </x-layout>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { BindBkCard, UnbindBkCard } from '@/api/user'
import { accountName, verifyBankID, verifyOpenActAddress } from '@/utils/verify.util.js'
import xBindPage from 'cpt/x-bind-page.vue'
export default {
  components: {
    xBindPage
  },
  data() {
    return {
      bank: '',
      accountName: '',
      bankId: '',
      city: '',
      pointer: '',
      centerText: '',
      columns: ['中国工商银行', '中国农业银行', '中国银行', '中国建设银行','交通银行'],
      bankShow: false,
      cityShow: false,
      areaList: []
    }
  },
  methods: {
    ...mapMutations(['setBkInfo']),
    onChange(vm, picker) {
      this.bank = picker
    },
    bankPickerCancel() {
      this.bank = ''
      this.bankShow = false
    },
    onCityChange(vm, item) {
      let [province, city, distruct] = item
      this.city = `${province.name}/${city.name}/${distruct.name}`
    },
    bankPickerConfirm(vm, item) {
      this.bank = this.columns[item]
      this.bankShow = false
    },
    cityPickerCancel() {
      this.city = ''
      this.cityShow = false
    },
    cityPickerConfirm(item) {
      let [province, city, distruct] = item
      this.city = `${province.name}/${city.name}/${distruct.name}`
      this.cityShow = false
    },
    async BindBkCard() {
      if (this.bank == '') {
        this.$notify('请选择提款银行')
      }
      if (this.accountName == '') {
        this.$notify('请输入账户姓名')
      }
      if (this.bankId == '') {
        this.$notify('请输入银行账号')
      }
      if (this.city == '') {
        this.$notify('请选择开户省市')
      }
      if (this.pointer == '') {
        this.$notify('请输入开户网点')
      }
      if (accountName(this.accountName) && verifyBankID(this.bankId) && verifyOpenActAddress(this.pointer)) {
        G.$dialog
          .confirm({
            title: '请确认绑定信息',
            message: `
            账户姓名：${this.accountName.replace(/^[\w\W]/, '*')}
            提款银行：${this.bank}
            银行账号：${this.bankId}
            开户省市：${this.city}
            开户网点：${this.pointer}
          `,
            className: 'table'
          })
          .then(() => {
            let bank_info = {
              bkname: this.bank,
              bknum: this.bankId,
              owner: this.accountName,
              region: this.city,
              openbk: this.pointer
            }
            BindBkCard({
              bkinfo: JSON.stringify(bank_info)
            }).then(({ ok, msg }) => {
              if (ok) {
                this.$notify({
                  type: 'success',
                  message: '绑定成功！！'
                })
                this.setBkInfo(bank_info)
                this.go(-1)
              }
            })
          })
          .catch(() => {})
      }
    },
    unBindBkCard() {
      G.$dialog
        .confirm({
          title: '提醒',
          message: '银行卡账号解除绑定后将无法提款，是否继续解除绑定？'
        })
        .then(() => {
          UnbindBkCard().then(() => {
            this.$notify({
              type: 'success',
              message: '成功解绑银行卡！'
            })
            this.go(-1)
          })
        })
        .catch(() => {})
    }
  },
  computed: {
    ...mapGetters(['getBkInfo']),
    bkInfo() {
      this.bank = this.getBkInfo.bkname
      this.accountName = this.getBkInfo.owner
      this.bankId = this.getBkInfo.bknum
      this.city = this.getBkInfo.region
      this.pointer = this.getBkInfo.openbk
      return !!this.getBkInfo.bkname
    }
  },
  created() {
    let that = this
    import('@/vendor/cityData.js').then(res => {
      that.areaList = res.default
    })
  }
}
</script>

<style lang="scss">
.page-card-root {
  background-color: $white;
  .van-field__control:disabled {
    color: $txt;
    -webkit-text-fill-color: $txt;
    &::placeholder {
      color: #d7d7d7;
      -webkit-text-fill-color: #d7d7d7;
    }
  }
  .tip {
    height: 34px;
    line-height: 34px;
    text-align: center;
    background-color: $baseBgColor;
    font-size: 12px;
    color: $txt;
  }
  .btn {
    text-align: center;
    .van-button {
      width: 290px;
      margin-top: 40px;
      border-radius: 5px;
    }
  }
}
</style>
