import Vue from 'vue'
import store from '@/store'
import eventBus from '@/utils/eventBus.js'

let mvvm

let isMouted = false

import ChatRoom from '@/views/chat/ChatRoom.vue'

Vue.prototype.$eventBus = eventBus;

mvvm = new Vue({
    store,
    data() {
        return {
            open: true,
        }
    },
    render: h => h(ChatRoom),
    created() {
        this.$eventBus.$on('bridge:open-room', () => this.open = true)
        this.$eventBus.$on('bridge:close-room', () => this.open = false)
    },

})

export function mouted() {
    if (isMouted) return
    isMouted = true
    mvvm.$mount('#room')
}

export function setState(change) {}

export function render() {}

export default mvvm