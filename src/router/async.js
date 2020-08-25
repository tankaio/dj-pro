import {
    Toast,
    Dialog
} from 'vant';

let isDone = false;
let timer
export const lazyload = (component) => {

    return () => new Promise((reslove, reject) => {

        function loadComponent() {

            isDone = false
            clearTimeout(timer);

            setTimeout(() => {
                // 未在300ms 内加载完毕则展示 Toast
                if (!isDone) {
                    Toast.loading({
                        duration: 0,
                        forbidClick: true,
                        message: "页面加载中"
                    })
                    isDone = true
                } else {
                    // 加载完毕则清除延时 重置状态
                    isDone = false
                    Toast.clear()
                    clearTimeout(timer)
                }
            }, 300)


            component().then(res => {
                isDone = true
                Toast.clear()
                clearTimeout(timer)
                reslove(res)
            }).catch(res => {

                isDone = true
                Toast.clear()
                clearTimeout(timer)

                Dialog.confirm({
                    title: '警告',
                    message: "当前页面加载失败,是否重新加载?",
                }).then(() => {
                    loadComponent()
                }).catch(() => {
                    console.log('取消重新加载')
                })

            })
        }

        loadComponent()

    })
}