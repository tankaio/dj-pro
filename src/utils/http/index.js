/*************************************************************
  API
**************************************************************/

/* jshint esversion: 6 */


import 'jquery'
import qs from 'qs';
import enc from './encrypt.js';
import constant from './constant.js';
import imgenc from './img'

import {
    Toast,
    Notify
} from 'vant'

let Http = {

    // 本地
    url_base: '',
    lastts: 0, // 最后的时间戳


    //***************************** 用于构建速度最快的url **************************************/
    urldict: {}, // url 构建列表
    echocount: 0, // url 测试回声返回数
    urlok: false, // url 是否已构建完毕
    tout: null, // 首次构建列表，当超过此时间，自动放弃后面的
    lastbuildtime: 0, // 上次构建url的时间
    session: false,


    socket: null,
    connected: false,
    ws_onConnected: null,
    ws_onClosed: null,
    lastecho: 0,
    echotimer: null,

    ws_connect(uri, onMsg, onConnect, onClose) {
        setTimeout(this._ws_connect(uri, onMsg, onConnect, onClose), 1);
    },
    ws_close() {
        setTimeout(this._ws_close(), 1);
    },
    ws_send(fname, param) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.log("socket 尚未连接");
        } else if (null == this.sid) {
            console.log('尚未交换秘钥生成会话');
        } else {
            // 获取时间戳
            let ts = (new Date()).valueOf();
            if (ts <= this.lastts) ts = this.lastts + 1;
            this.lastts = ts;
            param.ts = ts;

            // 发送数据
            let data = enc.encMe(JSON.stringify(param));
            this.socket.send(JSON.stringify({
                fname: fname,
                param: data
            }));
        }
    },

    //开始连接
    _ws_connect(uri, onMsg, onConnect, onClose) {

        if (0 == this.sid) {
            console.log("尚未初始化sid");
            return;
        }

        if (this.connected) return;
        if (null != this.echotimer) clearInterval(this.echotimer);
        this.lastecho = 0; // 初始化回声数据

        let that = this;
        that.socket = new WebSocket(uri);

        // 已连接
        that.ws_onConnected = () => {

            // 30秒发送一次回声
            that.echotimer = setInterval(() => {

                    // 检测上次的回声是否已及时返回
                    if (that.lastecho > 0) {
                        that.ws_onClosed();
                        return;
                    }

                    // 再次发送回声
                    that.lastecho = (new Date()).valueOf();
                    that._ws_echo();
                },
                30000);

            // 更新连接状态
            this.connected = true;

            // 提交sid
            this.socket.send(JSON.stringify({
                fname: 'conn',
                param: this.sid
            }));

            // 连线回调
            if (null != onConnect) onConnect();
        }

        // 已断开
        that.ws_onClosed = () => {

            // 清除回声探测
            try {
                if (null != that.echotimer) {
                    clearInterval(that.echotimer);
                    that.echotimer = null;
                    that.lastecho = 0;
                }
            } catch (e) {}

            // 更新连接状态
            this.connected = false;

            // 断线回调
            if (null != onClose) onClose();
        }

        that.socket.onopen = (event) => {
            that._ws_updateState();
        };
        that.socket.onclose = (event) => {
            that._ws_updateState();
        };
        that.socket.onerror = () => {
            that._ws_updateState()
        };

        // 收到消息
        that.socket.onmessage = (event) => {
            let msg = event.data;
            if ('echo' == msg) {
                // 回声探测清零
                that.lastecho = 0;
            } else {
                try {
                    // 解析出返回消息
                    let json = JSON.parse(msg);

                    // 有加密
                    if (json.enc) {
                        msg = enc.uncMe(json.msg);
                        json = JSON.parse(msg);
                    }
                    // 无加密
                    else {
                        json = JSON.parse(json.msg);
                    }

                    // 消息回调
                    if (null != onMsg) onMsg(json.type, json.data);
                } catch (e) {
                    console.log("收到无法解析的消息");
                }
            }
        };
    },
    //断开连接
    _ws_close() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.log("socket not connected");
        } else {
            try {
                if (null != this.echotimer) {
                    clearInterval(this.echotimer);
                    this.echotimer = null;
                }
            } catch (e) {}
            this.socket.close(1000, "Closing from client");
        }
    },
    //更新状态
    _ws_updateState() {
        if (!this.socket) {
            this.ws_onClosed();
        } else {
            switch (this.socket.readyState) {
                case WebSocket.CLOSED:
                    this.ws_onClosed();
                    break;
                case WebSocket.OPEN:
                    this.ws_onConnected();
                    break;
                    // case WebSocket.CLOSING:
                    //     stateLabel.innerHTML = "正在关闭...";
                    //     break;
                    // case WebSocket.CONNECTING:
                    //     stateLabel.innerHTML = "正在连接...";
                    //     break;
                default:
                    console.log("未知状态: " + this.socket.readyState);
                    this.ws_onClosed();
                    break;
            }
        }
    },
    _ws_echo() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.log("socket 尚未连接");
        } else if (null == this.sid) {
            console.log('尚未交换秘钥生成会话');
        } else {
            this.socket.send(JSON.stringify({
                fname: 'echo'
            }));
        }
    },



    // 开始构建
    buildurl() {
        // 30秒内不重新构建
        let deltaT = (new Date()).valueOf() - this.lastbuildtime;
        if (deltaT < 1000 * 30) return;

        this.urldict = {};
        this.echocount = 0;
        let len = constant.url_base.length;
        for (let i = 0; i < len; i++) {
            this.urldict[i.toString()] = {
                start: (new Date()).valueOf(),
                stop: 0
            };
            this.echo(i);
        }
        // 若5秒内仍未全部返回，反复提取5秒之内返回的线路
        this._preBuild();
    },
    // 若5秒内仍未全部返回，提取5秒之内返回的线路
    _preBuild() {
        this.tout = setTimeout(() => {
            this.tout = null;
            if (false == this.selRoute()) {
                this._preBuild();
            }
        }, 5000);
    },
    // 回声测试
    echo(ind) {
        var api = this;
        var callback = this.echoback;
        $.ajax({
            type: 'POST',
            url: constant.url_base[ind] + '/init/pl/echo',
            data: qs.stringify({
                param: ind.toString()
            }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'text',
            success: function (ret) {
                callback(ret, api);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                callback('e', api);
            }
        });
    },
    // 回声测试回调函数
    echoback(ret, api) {
        api.echocount++;
        if (null != api.urldict[ret]) {
            api.urldict[ret].stop = (new Date()).valueOf();
        }
        // 已全部返回
        if (api.echocount == constant.url_base.length) {

            api.selRoute();
            if (null != api.tout) {
                clearTimeout(api.tout);
                api.tout = null;
            }
        }
    },
    selRoute() {
        // 选出耗时最短的url
        let ind = -1;
        let min = -1;
        let len = constant.url_base.length;
        for (let i = 0; i < len; i++) {
            let node = this.urldict[i.toString()];
            if (null != node) {
                if (0 != node.stop) {
                    let delta = node.stop - node.start;
                    if (-1 == min || delta < min) {
                        ind = i;
                        min = delta;
                    }
                }
            }
        }
        if (-1 != ind) {
            this.url_base = constant.url_base[ind];
            this.urlok = true; // 已选出最佳线路
            this.lastbuildtime = (new Date()).valueOf(); // 记录最后一次选出最佳线路的时间 
            return true;
        }
        return false;
    },
    //***************************** 用于构建速度最快的url **************************************/

    // 初始化
    init() {
        this.buildurl();

        this.url_img = constant.static_base + 'img/';

        this.sid = sessionStorage.getItem('sid');
        enc.enckey = sessionStorage.getItem('enckey');
    },
    // 初始化会话
    getSession(callback) {
        if (false == this.urlok) {
            setTimeout(() => {
                this.getSession(callback);
            }, 1000);
        } else {
            this._getSession(callback);
        }
    },
    _getSession(callback) {
        let that = this;
        // 获取rsa公钥
        $.ajax({
            type: 'post',
            url: that.url_base + "/init/pl/GetRsa",
            data: $.param({
                param: constant.curver
            }), //　将版本号传为参数
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'json',
            success: function (ret) {
                try {

                    // 检测更新
                    if (ret.update) {
                        callback({
                            update: true
                        });
                        return;
                    }

                    // 创建临时key
                    let tmpkey = enc.getTmpKey(ret);
                    if (null == tmpkey) return;

                    // 获取session
                    $.ajax({
                        type: 'post',
                        url: that.url_base + "/init/pl/GetSession",
                        data: qs.stringify({
                            param: tmpkey.enc
                        }),
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        dataType: 'json',
                        success: function (ret) {
                            try {
                                // 解密会话编号和正式key
                                that.sid = ret.sid;
                                enc.enckey = enc.uncAes(ret.key, tmpkey.ori, '0000000000000000');
                                sessionStorage.setItem('sid', that.sid);
                                sessionStorage.setItem('enckey', enc.enckey);
                                that.session = true
                                callback();
                            } catch (e) {}
                        },
                        error: function (xhr, ajaxOptions, thrownError) {}
                    });
                } catch (e) {}
            },
            error: function (xhr, ajaxOptions, thrownError) {
                callback({
                    ok: false,
                    msg: '网络故障'
                });
            }
        });
    },

    _callapi(type, fname, param, callback) {

        // 获取时间戳
        let ts = (new Date()).valueOf();
        if (ts <= this.lastts) ts = this.lastts + 1;
        this.lastts = ts;

        // 将时间戳加入到参数中
        param.ts = ts;
        let data = enc.encMe(JSON.stringify(param));

        var xhr = $.ajax({
            type: 'POST',
            url: this.url_base + '/pl/' + type + '/' + fname + '/' + this.sid,
            data: $.param({
                param: data
            }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'json',
            success: function (ret) {
                try {
                    // 调用成功
                    if (ret.ok) {
                        // 消息加密
                        if (ret.enc) {
                            let str = enc.uncMe(ret.msg);
                            let obj = JSON.parse(str);
                            callback(true, obj);
                        }
                        // 消息未加密
                        else {
                            callback(true, ret.msg);
                        }
                    }
                    // 调用失败
                    else {
                        // 消息加密
                        if (ret.enc) {
                            callback(false, enc.uncMe(ret.msg));
                        }
                        // 消息未加密
                        else {
                            if ("e" == ret.msg) callback(false, "e"); // 会话丢失或非法调用
                            else callback(false, ret.msg);
                        }
                    }
                } catch (e) {
                    callback(false, "消息解析错误");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                callback(false, '网络故障');
            }
        });
        return xhr;
    },

    // post文件
    postfile(fname, param, filedata, ext, callback) {

        // 获取时间戳并加入到param
        let ts = (new Date()).valueOf();
        if (ts <= this.lastts) ts = this.lastts + 1;
        this.lastts = ts;
        param.ts = ts;

        // 将文件、扩展名和签名放入formdata
        let formdata = new FormData();
        formdata.append('ext', ext);
        formdata.append('data', filedata);
        formdata.append('sign', enc.getMd5(filedata + enc.enckey));

        // 发送
        var httprequest = new XMLHttpRequest();
        let url = this.url_base + '/pl/upload/' + fname + '/' + this.sid + "?" + $.param({
            param: enc.encMe(JSON.stringify(param))
        });
        httprequest.open('POST', url, true);
        httprequest.send(formdata);
        httprequest.onreadystatechange = () => {
            if (httprequest.status == 200 && httprequest.readyState == 4) {
                try {
                    // 调用成功
                    let ret = JSON.parse(httprequest.response);
                    if (ret.ok) {
                        // 消息加密
                        if (ret.enc) {
                            let str = enc.uncMe(ret.msg);
                            let obj = JSON.parse(str);
                            callback(true, obj);
                        }
                        // 消息未加密
                        else {
                            callback(true, ret.msg);
                        }
                    }
                    // 调用失败
                    else {
                        // 消息加密
                        if (ret.enc) {
                            callback(false, enc.uncMe(ret.msg));
                        }
                        // 消息未加密
                        else {
                            if ("e" == ret.msg) callback(false, "会话丢失或非法调用");
                            else callback(false, ret.msg);
                        }
                    }
                } catch (e) {
                    callback(false, "消息解析错误");
                }
            }
        };
    },

    postBigFile(fname, param, filedata, ext, processing, callback) {
        if (null != processing) processing(0);
        let that = this;
        setTimeout(() => {

            // 分包
            let len = filedata.length;
            that.sendind = 0;
            that.sendlist = [];
            for (let i = 0; i < len;) {
                let left = len - i;
                let datalen;
                if (left > 1024 * 512) {
                    datalen = 1024 * 512;
                } else {
                    datalen = left;
                }
                that.sendlist.push(filedata.slice(i, i + datalen));
                i += datalen;
            }

            if (0 == that.sendlist.length) return;
            if (null != processing) processing(that.sendind / that.sendlist.length); // 百分比展示

            // 分组传送
            if (1 == that.sendlist.length) {
                that.postfile(fname, param, that.sendlist[0], ext, callback);
            } else {
                that._postBigFile(fname, param, ext, processing, callback);
            }
        }, 10);
    },
    _postBigFile(fname, param, ext, processing, callback) {
        let that = this;
        if (that.sendind >= that.sendlist.length) return;

        if (0 == that.sendind) {
            param['...'] = 0;
        } else if (that.sendind < that.sendlist.length - 1) {
            param['...'] = 1;
        } else delete param['...'];

        that.postfile(fname, param, that.sendlist[that.sendind], ext, (ok, msg) => {
            if (false == ok) {
                callback(ok, msg);
            } else {
                that.sendind++;
                if (null != processing) processing(that.sendind / that.sendlist.length);
                setTimeout(() => {
                    if (that.sendind < that.sendlist.length) {
                        that._postBigFile(fname, param, ext, processing, callback);
                    } else {
                        callback(ok, msg);
                    }
                }, 10);
            }
        });
    },



    // 选择图片
    selPic(e, onload, width, height) {
        let localimg;
        let fileSize;
        let filetype;
        // var that = this;
        try {
            localimg = e.target.files[0];
            e.target.value = '';
            if (!localimg) {
                console.log("载入该图片失败");
                return;
            }

            let fileName = localimg.name;
            fileSize = localimg.size;
            filetype = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
            if (filetype != '.gif' && filetype != '.png' && filetype != '.jpg' && filetype != '.jpeg') {
                console.log("请选择图片文件");
                return;
            }

            let size = 10 * 1024 * 1024;
            if (fileSize >= size) {
                console.log("请选择10MB以内的图片");
                return;
            }
        } catch (e) {
            console.log("打开文件失败");
            return;
        }

        try {
            // gif直接发送
            let reader = new FileReader();
            if (".gif" == filetype) {
                reader.readAsDataURL(localimg);
                reader.onload = (e) => {
                    onload(e.target.result, ".gif");
                };
            }
            // 静态图压缩之后再发送
            else {
                imgenc.fileResizetoFile(localimg, 0.6, width, height, (ret) => {
                    reader.readAsDataURL(ret);
                    reader.onload = (e) => {
                        onload(e.target.result, ".jpg");
                    };
                });
            }
        } catch (e) {
            console.log("图片加载失败");
            return;
        }
    },




    // 登录成功后调用api
    /**
     * @description 为避免在获取到session之前的api调用被拒绝,将所有的api请求推到 session 之后
     */
    callapi(type, fname, param, cb = () => {}) {
        let that = this
        Toast.loading({
            message: '加载中...',
            forbidClick: true,
            loadingType: 'spinner'
        })
        return new Promise(reslove => {
            function check() {
                if (null == enc.enckey || null == that.sid) reslove();
                if (false == that.urlok) {
                    G.delay(check, 1000)
                } else {
                    if (that.session) {
                        that._callapi(type, fname, param, (ok, msg) => {
                            Toast.clear()
                            if (!ok) {
                                Notify(msg)
                                console.error(`${fname} [参数]:`, param);
                            } else {
                                console.log(`${fname} [返回值]`, msg);
                                cb(msg)
                            }
                            reslove({
                                ok,
                                msg
                            })
                        })
                    } else {
                        G.delay(check, 200)
                    }
                }
            }
            check()
        })
    },


    // 取消网络请求
    cancel(xhr) {
        if (null == xhr) return;
        try {
            xhr.abort();
        } catch (e) {}
    },
};

export default Http;