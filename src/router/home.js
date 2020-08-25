// import Manito from "@/views/home/Manito.vue"
// import Combo from "@/views/home/Combo.vue"
// import WinRate from "@/views/home/WinRate.vue"
// import Champion from "@/views/home/Champion.vue"

import {
    lazyload
} from './async'

const Manito = () => import('@/views/home/Manito.vue');
const Combo = () => import('@/views/home/Combo.vue');
const WinRate = () => import('@/views/home/WinRate.vue');
const Champion = () => import('@/views/home/Champion.vue');

export default [{
    path: "/Manito",
    component: lazyload(Manito),
    meta: {
        title: "大神榜",
    },
}, {
    path: "/combo",
    component: lazyload(Combo),
    meta: {
        title: "连胜榜",
    }
}, {
    path: "/winRate",
    component: lazyload(WinRate),
    meta: {
        title: "胜率榜",
    }
}, {
    path: "/champion",
    component: lazyload(Champion),
    meta: {
        title: "往期冠军",
    }
}, ]