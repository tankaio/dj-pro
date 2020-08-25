<!--
    小表情分页
-->

<template>
  <div class="cont unsel">
    <table class="tab">
      <tr v-for="row in cells" :key="row.id">
        <td v-for="col in row.data" :key="col.id" @touchend="ontouch(col.id)">
          <img style="vertical-align:middle" :src="col.url" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    initid: Number, // 起始表情编号
    pmoved: Boolean // 父面板是否移动
  },
  data() {
    return {
      cells: []
    }
  },
  methods: {
    pad(num, n) {
      let y = '000000' + num
      return y.substr(y.length - n)
    },
    ontouch(id) {
      if (false == this.pmoved) this.$emit('emoji', id) // 父面板未移动则点击
    }
  },
  mounted() {
    this.$nextTick(() => {
      for (let i = 0; i < 3; i++) {
        let row = []
        for (let j = 0; j < 7; j++) {
          // 最后一个删除图
          if (2 == i && 6 == j) {
            row.push({
              id: 0,
              url: 'http://dtapi-aj.xy50test.com/img/' + 'wx000.png'
            })
          }
          // 前20个表情图
          else {
            let id = i * 7 + j + this.initid
            row.push({
              id: id,
              url: 'http://dtapi-aj.xy50test.com/img/' + 'wx' + this.pad(id, 3) + '.png'
            })
          }
        }
        this.cells.push({ id: i, data: row })
      }
    })
  }
}
</script>

<style scoped>
/* 总样式 */
.cont {
  position: absolute;
  width: 14.3%;
  overflow: hidden;
  border: none;
}
.tab {
  height: 188px;
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  border: none;
  display: flex;
  flex-direction: column;
}
.tab tr {
  flex: none;
  height: 40px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}
.tab tr td {
  font-size: 0;
}
</style>
