<template>
  <!-- <div class="page-feedBackDetail-root"></div> -->
  <x-layout modifier="feedBackDetail">
    <x-header :is-right="false" slot="header"></x-header>
    <x-service-msg
      v-for="(item, index) in list"
      :key="index"
      v-bind="{
        self: item.id == userInfo.id,
        avatar: item.ico,
        msg: item.chat,
        time: item.time
      }"
    />
    <div class="tip">
      <template v-if="done">问题已解决</template>
      <template v-else>
        若问题已经解决，请点击
        <i class="special" @click="CloseSuggestion">已解决</i>
      </template>
    </div>
    <div class="footer">
      <van-field placeholder="请输入你要反馈的内容" v-model="msg"></van-field>
      <van-button type="danger" @click="SendMySuggestion">发送</van-button>
    </div>
  </x-layout>
</template>

<script>
import {
  GetSuggestionChat,
  CloseSuggestion,
  SendMySuggestion
} from "@/api/other";
import { getTime } from "@/utils/formant.util.js";
import { mapGetters } from "vuex";

import xHeader from "cpt/x-header.vue";
import xServiceMsg from "cpt/x-service-msg.vue";

export default {
  components: {
    xHeader,
    xServiceMsg
  },
  data() {
    return {
      msg: "",
      done: false,
      list: [],
      startind: 0,
      id: "",
      state: ""
    };
  },
  methods: {
    async GetSuggestionChat() {
      let { ok, msg } = await GetSuggestionChat({
        startind: this.startind,
        id: this.id
      });
      if (ok) {
        this.list.push.apply(this.list, msg);
      }
    },
    async CloseSuggestion() {
      let { ok, msg } = await CloseSuggestion({
        id: this.id
      });
      if (ok) {
        this.done = true;
      }
    },
    async SendMySuggestion() {
      let { ok, msg } = await SendMySuggestion({
        content: this.msg
      });
      if (ok) {
        let [ymd, hms] = getTime();
        this.list.push({
          chat: this.msg,
          id: this.userInfo.id,
          nick: this.userInfo.nick,
          ico: this.userInfo.ico,
          time: `${ymd} ${hms}`
        });
        this.msg = "";
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    // ...
    next(vm => {
      vm.id = to.params.id;
      let state = (vm.state = to.params.state);
      if (state == 2) {
        vm.done = true;
      }
      vm.GetSuggestionChat();
    });
  }
};
</script>

<style lang="scss">
.page-feedBackDetail-root {
  // //padding-top: 44px;
  padding-bottom: 60px;
  .x-header {
    z-index: 10;
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    z-index: 10;
    background-color: $white;
    box-shadow: 0 -1px 2px 0 rgba($color: #000000, $alpha: 0.2);
    .van-button {
      width: 60px;
      .van-button__text {
        white-space: nowrap;
      }
    }
    .van-field {
      width: 275px;
      border-radius: 2.5px;
      border: 1px solid $gray-d7;
    }
  }
  .tip {
    text-align: center;
    font-size: 15px;
    color: $gray-99;
    .special {
      color: $male;
    }
  }
}
</style>
