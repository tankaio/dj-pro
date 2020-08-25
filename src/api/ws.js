import Http from '@/utils/http'
import WsDispose from './ws_dispose'

const HTTP_REG = /^http(|s)\:\/\//

let connect = () => new Promise((reslove, reject) => {
    
    function ws_connect() {

        let url_base = 'http://dtapi-aj.xy50test.com' || Http.url_base

        // 如果 url_base 不存在则推迟 ws 连接
        if (!url_base) {
            return G.delay(ws_connect, 500)
        }

        let ws_url = 'ws://ws-' + url_base.replace(HTTP_REG, '') + '/ws'

        Http.ws_connect(ws_url, (type, body) => {
            WsDispose.follow(type, body)
        }, connect => {
            reslove(connect)
        }, close => {
            reject(close)
        })

    }

    ws_connect()

})

let send = (fname, data = {}) => {
    Http.ws_send(fname, data)
}

let close = () => Http.ws_close()

export default {
    connect,
    send,
    close
}