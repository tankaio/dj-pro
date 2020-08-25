<template>
    <div class="games-header" ref="gamesheader">
        <div class="games-top">
            <div class="lottery-records">
                <div @click="lotteryrecords" class="btn">
                    <i class="xIcon-lottery-record"></i>
                    <p class="lottery-record-txt">历史</p>
                </div>
            </div>
            <div class="lottery-now">
                <div class="lottery-top">
                    <div class="fl">{{lastterm}}期</div>
                    <div class="fr">[{{lasttermhezhi}}]</div>
                </div>
                <div class="lottery-info">
                    <div
                        v-for="(item, index) in LotteryBalls"
                        :key="index"
                        class="balls-info"
                    >
                        <div v-if="index < 6">
                            <div
                                :class="item | circleClassFilter"
                                class="balls"
                            >
                                <div class="core">
                                    {{ item }}
                                </div>
                            </div>
                            <div>
                                {{
                                    shengxiaos[
                                        (LotteryBalls[index] + nowyear - 1) % 12
                                    ]
                                }}
                            </div>
                        </div>
                        <div v-else>
                            <div class="numpua">
                                +
                            </div>
                            <div class="fl">
                                <div
                                    :class="item | circleClassFilter"
                                    class="balls"
                                >
                                    <div class="core">
                                        {{ item}}
                                    </div>
                                </div>
                                <div>
                                    {{
                                        shengxiaos[
                                            (LotteryBalls[index] +
                                                nowyear -
                                                1) %
                                                12
                                        ]
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="games-next">
            <div class="games-txt fl">{{ nextterm }}期</div>
            <div class="next_info fl">
                距离封盘：<!--<span>{{time}}</span> -->
                <span>
                    <!-- {{
                    days?daysString+'天':''
                    }}                     -->
                    {{
                    hour
                        ? hourString + ":" + minuteString + ":" + secondString
                        : minuteString + ":" + secondString
                }}</span>
            </div>
            <div class="chakan" @click="getBettingRemark">
                <!-- <van-icon name="question-o" class="van-nav-bar__arrow games-question-o" /> -->
                <i class="xIcon-games-chakan"></i>
            </div>
        </div> 
    </div>
    
</template>
<script>
import { mapGetters} from "vuex";
import { leaveGame } from "@/api/games"; 
import { enterGame } from "@/api/games";
import { getBettingRemark } from "@/api/games";
import wsDispose from "@/api/ws_dispose";
// import {  setChatInfo } from "@/api/chat";

export default {
    name: "x-games-header",
    props: {
        val: String,
        bol: Boolean
    },
    data() {
        return {
            // days:'',
            hour: 0,
            minute:0,
            second: 0,
            promiseTimer: "",
            remainTime:null,
            /*********************** */
            lastterm: "000000001", //上一期-期数
            nextterm: "000000002", //下一期-期数
            LotteryBalls: [1, 21, 30, 40, 15, 0, 0], //开奖号码--倒计时结束进入最新一期
            flag: false, // true-为开盘 / false-为封盘
            // nowyear: null, //当年生肖-0-11
            shengxiaos: [
                "鼠",
                "牛",
                "虎",
                "兔",
                "龙",
                "蛇",
                "马",
                "羊",
                "猴",
                "鸡",
                "狗",
                "猪"
            ],
        };
    },
    created() {
        //获取-(当前期数+时间开始到结束时间)，(上一期期数+开奖号码)，。
        this.enterGame();
        
        wsDispose.listen_msg("draw", body => {
            this.LotteryBalls=JSON.parse(body).nums
            this.lastterm=JSON.parse(body).round
        });
        wsDispose.listen_msg("gamestate", body => {
            this.flag=body.canbet
            this.remainTime=body.leftsec
            this.nextterm=body.round
            //this.$emit('nowround',this.nextterm,this.flag)
        });
    },

    computed: {
        ...mapGetters(["getChatInfo","getCuryear"]),  
        nowyear(){
            // this.nowyear
            return this.shengxiaos.indexOf(this.getCuryear)
        },      
        
        // daysString() {
        //     return this.formatNum(this.days);
        // },
        hourString() {
            return this.formatNum(this.hour);
        },
        minuteString() {
            return this.formatNum(this.minute);
        },
        secondString() {
            return this.formatNum(this.second);
        },
        //号码球和值
        lasttermhezhi(){
            function sum(arr) {
                return eval(arr.join("+"));
            };
            return '和值：'+ sum(this.LotteryBalls) + (sum(this.LotteryBalls)>174?'/大':'/小')+(sum(this.LotteryBalls)%2?'/单':"/双")
        }
    },
    watch:{
        flag(){
            if (this.flag) {
                this.showtime(this.remainTime)
            }else{
                this.hour = 0;
                this.minute = 0;
                this.second = 0;
            }
            this.$emit("countDowmEnd", this.flag);
        }
    },
    destroyed: function () {
        this.leaveGame()
    },
    methods: {
        //获取游戏时间/期数/开奖数据
        async enterGame() {
            let par = { game: this.$route.params.name };
            let { ok, msg } = await enterGame(par);

            if (ok) {
                // console.log(msg);
                this.nextterm = msg.state.round;
                // this.remainTime = 5;
                this.remainTime = msg.state.leftsec;
                this.flag = msg.state.canbet;
                this.lastterm = msg.road[0].round
                this.LotteryBalls = msg.road[0].nums
                let roadArrs = msg.road
                this.$emit('nowround',this.nextterm,roadArrs,msg.todaywin,msg.balan_m)
                //余额和今日中奖
                // this.$emit('balanM',msg.balan_m)
                // this.$emit('todayWin',msg.todaywin)
                // console.log(roadArrs);
                
                // this.$emit('nowround',this.nextterm)
                this.showtime();
            } else {
                console.log(msg);
            }
        },
        async leaveGame() {
            let par = { game:this.$route.params.name};
            let { ok, msg } = await leaveGame(par);

            if (ok) {
                console.log(msg);
                
            } else {
                console.log(msg);
            }
        },
        showtime() {
            clearInterval(this.promiseTimer);
            if (this.remainTime > 0) {
                // this.days = Math.floor((this.remainTime / (3600*24)));
                // console.log(this.days);
                
                this.hour = Math.floor((this.remainTime / 3600));
                this.minute = Math.floor((this.remainTime / 60) % 60);
                this.second = Math.floor(this.remainTime % 60);
                this.countDowm();
            }else{
                this.$emit("countDowmEnd", false);
            }
        },
        /***********倒计时*********** */
        countDowm() {
            var self = this;
            clearInterval(this.promiseTimer);
            this.promiseTimer = setInterval(function() {
                if (self.hour === 0) {
                    if (self.minute !== 0 && self.second === 0) {
                        self.second = 59;
                        self.minute -= 1;
                    } else if (self.minute === 0 && self.second === 0) {
                        self.second = 0;
                        // console.log('daoshile');
                        this.flag = false;
                        clearInterval(self.promiseTimer);
                    } else {
                        self.second -= 1;
                    }
                } else {
                    if (self.minute !== 0 && self.second === 0) {
                        self.second = 59;
                        self.minute -= 1;
                    } else if (self.minute === 0 && self.second === 0) {
                        self.hour -= 1;
                        self.minute = 59;
                        self.second = 59;
                    } else {
                        self.second -= 1;
                    }
                }
            }, 1000);
        },
        formatNum(num) {
            return num < 10 ? "0" + num : "" + num;
        },
        /*************************************************************************************************** */
        //玩法介绍
        async getBettingRemark() {
            let par = { 
                game: this.$route.params.name,
                grp:this.val
            };
            let { ok, msg } = await getBettingRemark(par);

            if (ok) {
                console.log(msg);
                let e=msg
                this.$emit("showWanfa",e);
                // G.$dialog.alert({
                //     title: "玩法介绍",
                //     message:this.wanfatitles
                // });
            } else {
                console.log(msg);
            }
        },
        lotteryrecords() {
            console.log(this.$props.bol);            
            if (this.$props.bol) {
                this.$emit("showCentent", false);
            }else{
                this.$emit("showCentent", true);
            }
        }
       
    }
};
</script>

<style lang="scss">
.games-header {
    // padding-bottom: 50px;
    width: 100%;
    // height: 110px;
    font-size: 14px;
    background-color: $white;
    flex: 1;
    position: fixed;
    top: 44px;
    .dialog-wanfa{
        position: fixed;
    }
    .c-0{background: #ededed}
    .games-top {
        height: 80px;
        border-bottom: 1px solid $baseBgColor;
        .lottery-records {
            float: left;
            height: 100%;
            width: 50px;
            .btn {
                width: 100%;
                height: 60px;
                margin-top: 10px;
                border-right: 1px solid $baseBgColor;
                text-align: center;
                line-height: 60px;
                position: relative;
                i {
                    display: inline-block;
                    height: 20px;
                    width: 20px;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .lottery-record-txt{
                    width: 100%;
                    position: absolute;
                    left: 0;
                    float: left;
                    height: 0.2rem;
                    top: 0.2rem;
                    text-align: center;
                    color: #999;
                }
            }
        }
        .lottery-now {
            width: 319px;
            float: right;
            text-align: center;
            .lottery-top {
                height: 28px;
                line-height: 28px;
                padding: 0 10px;
            }
            .lottery-info {
                // width: 100%;
                margin: 0 auto;
                display: inline-block;
                text-align: center;
                .balls-info {
                    margin: 0 5px;
                    float: left;
                    text-align: center;
                    .numpua {
                        height: 45px;
                        line-height: 45px;
                        float: left;
                        display: block;
                        width: 20px;
                        font-size: 24px;
                        color: #999;
                        margin-right: 5px;
                    }
                    .balls {
                        $var: 3px;
                        position: relative;
                        height: 28px;
                        width: 28px;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        overflow: hidden;
                        margin-bottom: 3px;
                        .core {
                            position: relative;
                            height: 20px;
                            width: 20px;
                            line-height: 20px;
                            border-radius: 50%;
                            background-color: $white;
                        }
                    }
                }
            }
        }
    }
    .games-next {
        height: 39px;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #999;
        .games-txt {
            line-height: 39px;
            color: #000;
            padding: 0 10px;
        }
        .next_info {
            color: #000;
            width: auto;
            line-height: 39px;
            span {
                color: red;
            }
        }
        .chakan {
            width: 39px;
            height: 39px;
            text-align: center;
            line-height: 39px;
            float: right;

            i{
                display: inline-block;
                vertical-align: middle;
                height: 20px;
                font-size: 20px;
                color: #999;
                margin: auto;
                width: 20px;
                background-size: contain;
                background-repeat: no-repeat;
            }
        }
    }
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
}
</style>
