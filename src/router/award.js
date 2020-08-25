
import {
    lazyload
} from './async'

const awardInfo = () => import('@/views/award/AwardInfo.vue')
const awardDetail = () => import('@/views/award/AwardDetail.vue')

// import awardInfo from '@/views/award/AwardInfo.vue'
// import awardDetail from '@/views/award/AwardDetail.vue'
export default [{
    path: "/awardInfo",
    component: lazyload(awardInfo),
    meta: {
        title: "开奖信息",
    }
}, {
    path: "/awardInfo/awardDetail/:id",
    component: lazyload(awardDetail),
    meta: {
        title: "单期详情"
    }
}, ]