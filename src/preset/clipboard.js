import ClipboardJS from "clipboard";

const $clip = (selector, txt = '') => {
    return new Promise((reslove, reject) => {
        var clipboard = new ClipboardJS(selector, {
            text: function (trigger) {
                return txt
            }
        })
        clipboard.on('success', e => {
            reslove()
            clipboard.destroy()
        })
        clipboard.on("error", e => {
            // 不支持复制
            console.warn("该浏览器不支持自动复制");
            // 释放内存
            reject()
            clipboard.destroy();
        });
    })
}

export default $clip