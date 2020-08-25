<template>
  <div class="x-chart">
    <canvas id="chart-hd"></canvas>
    <canvas id="chart-cvs"></canvas>
  </div>
</template>

<script>
import { init } from "./x-chart.core";

let zodiac_map = [
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
];
export default {
  name: "x-chart",
  props: {
    type: String,
    chart_data: Array,
    theyear: String,
    min_playfun_active: String
  },
  computed: {
    nowyear() {
      return zodiac_map.indexOf(this.theyear);
    },
    newarrs() {
      return this.chart_data.reverse();
    }
  },
  methods: {
    init() {
      let coordinateyData = [];
      // let coordinateyData = [
      //   {
      //     issue: "001",
      //     val: 9
      //   },
      // ];
      // let {draws}=data
      let coordinateyDataZodiac = [];
      //   {
      //     issue: "001",
      //     val: 0,
      //     pointer_txt: "鼠"
      //   },
      // ];
      let coordinateyTableDataSize = [];
      //  [
      //   {
      //     issue: "001",
      //     val: ["大", "小", "大", "小", "大", "小", "大"]
      //   }
      // ];
      let coordinateyTableData = [];
      // [
      //   {
      //     issue: "011",
      //     val: ["双", "单", "双", "单", "双", "单", "双"]
      //   }
      // ];
      let coordinateyTableDataHunhe = [];

      let activenum = 6;
      switch (this.min_playfun_active) {
        case "码一":
          activenum = 0;
          break;
        case "码二":
          activenum = 1;
          break;
        case "码三":
          activenum = 2;
          break;
        case "码四":
          activenum = 3;
          break;
        case "码五":
          activenum = 4;
          break;
        case "码六":
          activenum = 5;
          break;
        default:
          activenum = 6;
          break;
      }
      this.newarrs.map((item, index) => {
        let sizearr = [];
        item.nums.map(e => {
          switch (e) {
            case 49:
              e = "和";
              break;
            default:
              e = e >= 25 ? "大" : "小";
              break;
          }
          sizearr.push(e);
        });
        let oddevenarr = [];
        item.nums.map(e => {
          switch (e) {
            case 49:
              e = "和";
              break;
            default:
              e = e % 2 ? "单" : "双";
              break;
          }
          oddevenarr.push(e);
        });
        let hunhearr = [];
        function sum(arr) {
          return eval(arr.join("+"));
        }
        hunhearr.push(
          sum(item.nums) > 174 ? "总大" : "总小",
          sum(item.nums) % 2 ? "总单" : "总双",
          sum(item.nums)
        );

        coordinateyData.push({
          issue: item.round.slice(-3),
          val: item.nums[activenum]
        });
        coordinateyDataZodiac.push({
          issue: item.round.slice(-3),
          val: (item.nums[activenum] + this.nowyear - 1) % 12,
          pointer_txt:
            zodiac_map[(item.nums[activenum] + this.nowyear - 1) % 12]
        });
        coordinateyTableDataSize.push({
          issue: item.round.slice(-3),
          val: sizearr
        });
        coordinateyTableData.push({
          issue: item.round.slice(-3),
          val: oddevenarr
        });
        coordinateyTableDataHunhe.push({
          issue: item.round.slice(-3),
          val: hunhearr
        });
      });
      // console.log(coordinateyData);

      switch (this.type) {
        case "coom":
          // for (let index = 0; index < 100; index++) {
          //   coordinateyData.push({
          //     issue: index,
          //     val: Math.floor(Math.random() * 49) + 1
          //   });
          // }
          init("#chart-cvs", coordinateyData, "coom");
          break;
        case "zodiac":
          // for (let index = 0; index < 100; index++) {
          //   let val = Math.floor(Math.random() * 12);
          //   coordinateyDataZodiac.push({
          //     issue: index,
          //     val,
          //     pointer_txt: zodiac_map[val]
          //   });
          // }
          init("#chart-cvs", coordinateyDataZodiac, "zodiac", {
            padding_y: 100
          });
          break;
        case "size":
          // for (let index = 0; index < 100; index++) {
          //   let arr = [];
          //   for (let index2 = 0; index2 < 7; index2++) {
          //     arr.push(Math.random() > 0.5 ? "大" : "小");
          //   }
          //   coordinateyTableDataSize.push({
          //     issue: index,
          //     val: arr
          //   });
          // }
          init("#chart-cvs", coordinateyTableDataSize, "size", {
            chart_type: "table"
          });
          break;
        case "oddeven":
          init("#chart-cvs", coordinateyTableData, "oddeven", {
            chart_type: "table"
          });
          break;
        case "hunhe":
          init("#chart-cvs", coordinateyTableDataHunhe, "hunhe", {
            chart_type: "table"
          });
          break;
        default:
          break;
      }
    },
    refresh() {
      init.refresh();
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    type() {
      this.init();
    },
    min_playfun_active() {
      this.init();
    }
  }
};
</script>

<style lang="scss">
.x-chart {
  width: 100vw;
  font-size: 13px;
  #chart-hd {
    width: 100vw;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba($color: #000000, $alpha: 0.2);
  }
  #chart-cvs {
    width: 100vw;
    height: 50vw;
  }
}
</style>
