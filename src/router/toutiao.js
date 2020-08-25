import {
    lazyload
} from './async'

const ToutiaoIndex = () => import('@/views/toutiao/ToutiaoIndex.vue')
const ToutiaoEdit = () => import('@/views/toutiao/ToutiaoEdit.vue')
const ToutiaoDetial = () => import('@/views/toutiao/ToutiaoDetial.vue')

export default [{
    path: '/toutiao',
    component: lazyload(ToutiaoIndex),
    meta: {
        title: '六合头条'
    }

}, {
    path: '/toutiaoEdit',
    component: lazyload(ToutiaoEdit),
    meta: {
        title: '编辑头条'
    }
}, {
    path: '/toutiaoDetial',
    component: lazyload(ToutiaoDetial),
    meta: {
        title: '头条详情'
    }
}]