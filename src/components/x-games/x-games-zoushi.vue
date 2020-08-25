<template>
  <div class="games-zoushi">
    <div class="zoushi-head-con">
      <div class="zoushi-quxiao" @click="zoushiback">取消</div>
      {{gamesname}}
      <div class="zoushi-zoushitu" @click="$router.push('/games/runChart')">走势图</div>
    </div>
    <div v-for="(item, index) in roads" :key="index" class="menu-list">
      <div class="zoushi-title">
        <div class="qihao">第{{qishus[index]}}期</div>
        <div class="tit">[{{tit[index]}}]</div>
      </div>
      <div class="zoushi-box">
        <div v-for="(v, k) in roads[index]" :key="k" class="balls-info">
          <div v-if="k < 6">
            <div class="ball" :class="v | circleClassFilter">{{v}}</div>
            <div>
              {{
              shengxiaos[
              (roads[index][k] +
              nowyear -
              1) %
              12
              ]
              }}
            </div>
          </div>
          <div v-else>
            <div class="numpua">+</div>
            <div class="ball" :class=" v | circleClassFilter ">{{v}}</div>
            <div>
              {{
              shengxiaos[
              (roads[index][k] +
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
    <div class="zoushiback ios-bt">
        <div class="btn" @click="zoushiback">立即投注</div>
    </div>
    
  </div>
</template>
<script>
import { mapGetters} from "vuex";
export default {
  name: "x-games-zoushi",
  props:{
    roadArrs:Array,
    gamesname:String
  },
  data() {
    return {
      zoushibol:false,
      // nowyear: 11, //当年生肖-0-11
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
      ]
    };
  },
  computed:{
    ...mapGetters(["getCuryear"]),  
    nowyear(){
        // this.nowyear
        return this.shengxiaos.indexOf(this.getCuryear)
    },
    roads(){
      let roads=[]
      this.roadArrs.map((e)=>{ 
          roads.push(e.nums)
      })
      return roads
    },
    qishus(){
      let qishus=[]
      this.roadArrs.map((e)=>{ 
          qishus.push(e.round)
      })
      return qishus
    },
    tit(){
      let tits=[]
      this.roadArrs.map((e)=>{ 
         function sum(arr) {
            return eval(arr.join("+"));
        };
        tits.push('特肖:'+this.shengxiaos[(e.nums[6] +this.nowyear -1) %12]+' 和值:'+ sum(e.nums) + (sum(e.nums)>174?'/大':'/小')+(sum(e.nums)%2?'/单':"/双"))
      })
      return tits
    }
  },
  methods: {
      zoushiback(){
        this.$emit("showCentent", false)
      }
  },
};
</script>
<style lang="scss">
.games-zoushi {
  background: #fff;
  padding-bottom: 45px;
  padding-top: 44px;
  .zoushi-head-con{
    height: 44px;
    width: 100%;
    background: $rootColor;
    position: fixed;
    left: 0;
    top: 0;
    line-height: 44px;
    text-align: center;
    color: #fff;
    font-size: 17px;
    .zoushi-quxiao{
      width:auto;
      height: 44px;
      line-height: 44px;
      position:fixed;
      font-size: 14px;
      left: 0;
      top: 0;
      display:inline-block;
      padding: 0 15px;
    }
    .zoushi-zoushitu{
      width:auto;
      height: 44px;
      line-height: 44px;
      position:fixed;
      font-size: 14px;
      right: 0;
      top: 0;
      display:inline-block;
      padding: 0 15px;
    }
  }
    .zoushiback{
        width: 100%;
        position:fixed;
        bottom: 0;
        left: 0;
        background: #f5f5f5;
        border-top: 1px solid #d7d7d7;
        text-align: center;
        .btn{
            width: 100%;
            background: $rootColor;
            line-height: 38px;
            color: #fff;
            text-align: center;
        }
    }
  .menu-list {
    line-height: 30px;
    border-bottom: 1px solid#f5f5f5;
    .zoushi-title {
      width: 100%;
      display: inline-block;
      line-height: 30px;
      font-size: 14px;
      .qihao {
        float: left;
        margin-left: 10px;
      }
      .tit {
        float: right;
        margin-right: 10px;
      }
    }
    .zoushi-box {
      width: 100%;
      display: inline-block;
      .balls-info {
        margin: 0 5px;
        float: left;
        text-align: center;
        .numpua {
          height: 45px;
          line-height: 45px;
          float: left;
          display: block;
          width: 28px;
          margin-right: 5px;
          font-size: 24px;
        }
        .ball {
          margin: 0 5px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          text-align: center;
          line-height: 28px;
          color: #333;
          float: left;
        }
      }
    }
  }
}
</style>
