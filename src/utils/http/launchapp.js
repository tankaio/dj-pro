
/*****************************************
    启动app
*****************************************/


let launch = {
    runAppIos(url) {
        var state = null;
        try {
            state = window.open(url, '_self');
        } 
        catch (e) {
            return state;
        }
    },

    runAppAnd(url) {
        var ifr = document.createElement('iframe');
        ifr.src = url;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        // 点击后延时触发清除iframe，并跳转页面
        setTimeout(function () {
            document.body.removeChild(ifr);
        }, 200);
    },
}

export default launch;