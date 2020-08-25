module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  //unambiguous 如果存在import/ export语句，则将文件视为“模块” ，否则将其视为“脚本”。
  sourceType: 'unambiguous'
}