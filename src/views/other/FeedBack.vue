<template>
  <!-- <div class="page-feedBack-root"></div> -->
  <x-layout modifier="feedBack">
    <x-header :is-right="false" slot="header"></x-header>
    <template v-if="all_suggestion">
      <div class="feedBackList">
        <x-list v-model="loading" :finished="finished" :error.sync="error" @load="GetMySuggestions">
          <van-cell
            v-for="(item, index) in list"
            :key="index"
            :class="item.state | suggesState"
            :title="item.title"
            :value="item.state | suggesState(true)"
            is-link
            :to="`/feedBackDetail/${item.id}/${item.state}`"
          />
        </x-list>
      </div>
      <div class="footer" @click="all_suggestion = false">提交新的反馈</div>
    </template>
    <template v-else>
      <van-cell title="我的反馈" @click="all_suggestion = true">
        <span class="xIcon-select-cm" slot="right-icon"></span>
      </van-cell>
      <van-cell-group>
        <van-cell class="picker" title="选择反馈类型" is-link arrow-direction="down">
          <van-dropdown-menu>
            <van-dropdown-item v-model="value" @change="onChangeType" :options="option" />
          </van-dropdown-menu>
        </van-cell>
      </van-cell-group>
      <van-cell-group>
        <van-field type="textarea" class="textarea" v-model="suggess" maxlength="100"></van-field>
        <div class="tit">
          联系方式
          <i class="special">(请至少填写一种联系方式)</i>
        </div>
        <van-field placeholder="请输入手机号" type="tel" clearable v-model="phone"></van-field>
        <van-field placeholder="请输入QQ号码" type="tel" clearable v-model="qq"></van-field>
        <van-field placeholder="请输入邮箱地址" type="email" clearable v-model="email"></van-field>
      </van-cell-group>
      <div class="btnBar">
        <van-button type="danger" @click="MakeSuggestion">提交</van-button>
      </div>
    </template>
  </x-layout>
</template>

<script>
import { GetMySuggestions, MakeSuggestion } from "@/api/other";
import {
  verifyPhone,
  verifyQQ,
  verifyEmail,
  verifySugges
} from "@/utils/verify.util.js";

import xHeader from "cpt/x-header.vue";
import xList from "cpt/x-list/x-list.vue";

export default {
  components: {
    xHeader,
    xList
  },
  data() {
    return {
      all_suggestion: false,

      loading: false,
      finished: false,
      error: false,
      startind: 0,
      list: [],

      suggess: "",
      phone: "",
      qq: "",
      text: "",
      email: "",
      value: 0,

      type: "",
      contacttype: "",
      contanct: "",
      option: [
        { text: "选择反馈类型", value: 0 },
        { text: "问题反馈", value: 1 },
        { text: "优化建议", value: 2 },
        { text: "商务合作", value: 3 },
        { text: "其他", value: 4 }
      ]
    };
  },
  methods: {
    async GetMySuggestions() {
      let { ok, msg } = await GetMySuggestions({
        startind: this.list.length
      });
      if (ok) {
        this.list.push.apply(this.list, msg);
        this.loading = false;
        // this.startind++;
        if (!msg.length) this.finished = true;
      } else {
        this.error = true;
      }
    },
    async MakeSuggestion() {
      if (this.phone) {
        if (!verifyPhone(this.phone)) return;
        this.contacttype = 1;
        this.contanct = this.phone;
      } else if (this.qq) {
        if (!verifyQQ(this.qq)) return;
        this.contacttype = 2;
        this.contanct = this.qq;
      } else if (this.emali) {
        if (!verifyEmail(this.email)) return;
        this.contacttype = 3;
        this.contanct = this.email;
      } else {
        return this.$notify("请至少填写一种联系方式");
      }
      if (!this.type) {
        return this.$notify("请选择反馈类型");
      }
      if (!verifySugges(this.suggess)) {
        return;
      }

      let { ok, msg } = await MakeSuggestion({
        suggestion: this.suggess,
        type: this.type,
        contacttype: this.contacttype,
        contanct: this.contanct
      });
      // contacttype=1/2/3//联系方式，手机，qq，邮箱
      if (ok) {
        this.$notify({
          type: "success",
          message: `反馈成功,您的反馈单号为${msg}`
        });
        this.go(-1);
      }
    },
    onChangeType(index) {
      if (index) {
        this.type = this.option[index].text;
      }
    }
  },
  created() {
    this.GetMySuggestions();
  },
  filters: {
    suggesState(val, mix) {
      if (mix) {
        switch (val) {
          case 0:
            return "待回复";
          case 1:
            return "已回复";
          case 2:
            return "已解决";
          default:
            break;
        }
      } else {
        switch (val) {
          case 0:
            return "wait";
          case 1:
            return "msging";
          case 2:
            return "done";
          default:
            break;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.page-feedBack-root {
  // //padding-top: 44px;
  background-color: $white;
  padding-bottom: 44px;
  .feedBackList {
    .wait .van-cell__value {
      color: $gray-66;
    }
    .msging .van-cell__value {
      color: $rootColor;
    }
    .done .van-cell__value {
      color: $male;
    }
  }
  .tit {
    font-size: 15px;
    color: $txt;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    background-color: $white;
    display: flex;
    align-items: center;
    position: relative;
    .special {
      font-size: 12px;
      color: $gray-66;
      margin-left: 10px;
    }
    &::after {
      display: block;
      position: absolute;
      content: "";
      left: 0;
      bottom: 0;
      right: 0;
      border-bottom: 1px solid $gray-f5;
      transform: rotateX(45deg);
    }
  }
  .btnBar {
    padding-top: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-button {
      width: 290px;
      border-radius: 5px;
    }
  }
  .textarea .van-field__body {
    width: 330px;
    height: 150px;
    border: 1px solid $gray-d7;
    .van-field__control {
      height: 100%;
      padding: 5px;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $rootColor;
    text-align: center;
    color: $white;
    height: 44px;
    line-height: 44px;
  }

  .picker {
    position: relative;
    .van-cell__value {
      position: unset;
    }
    .van-dropdown-menu__item {
      justify-content: flex-start;
      padding-left: 10px;
    }
    .van-dropdown-menu__title::after {
      display: none;
    }
  }
  .van-dropdown-menu {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 44px;
  }
}
</style>
