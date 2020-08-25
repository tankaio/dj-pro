<template>
    <div class="games-menu">
        <div class="menu-list" @click="$router.push('/user')">个人中心</div>
        <div class="menu-list" @click="$router.push('/user/integral')">充值/兑换</div>
        <div class="menu-list" @click="$router.push('/user/bill')">账户清单</div>
        <div class="menu-list" @click="$router.push('/games/betrecord')">投注记录</div>
        <div class="menu-list red">
            <p>今日中奖</p>
            <p>{{ tw }}</p>
        </div>
        <div class="menu-list red">
            <p>账户余额</p>
            <p>{{ tm }}</p>
        </div>
        <div v-if="menubol" class="games-menu-bg" @click="off"></div>
    </div>
</template>
<script>
export default {
    name: "x-games-menu",
    props:{
        menubol:Boolean,
        tw:Number,
        tm:Number
    },
    methods:{
        off(){
            this.$emit("changeright",false)
            // this.menubol=!this.menubol
        }
    }
};
</script>

<style lang="scss">
.games-menu {
    width: 120px;
    background: #fff;
    position: absolute;
    z-index: 9998;
    right: 0px;
    top: 0;
    text-align: center;
    display: none;
    .games-menu-bg {
        background: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
        display: block;
        position: fixed;
        left: 0;
        top: 44px;
        z-index: -1;
    }
    .red {
        color: $rootColor;
    }
    .menu-list {
        line-height: 36px;
        background: #fff;
        border-bottom: 1px solid $gray-d7;
    }
}
</style>
