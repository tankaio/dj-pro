import {
    lazyload
} from './async'

// let Search = () => import('@/views/chat/Search.vue')
// let Room = () => import('@/views/chat/Room.vue')

// import DryingListDetails from '@/views/circle/DryingListDetails.vue'
// import DryingListRelease from '@/views/circle/DryingListRelease.vue'
// import CircleOwn from '@/views/circle/CircleOwn.vue'

// import CircleOther from '@/views/circle/CircleOther.vue'

// import CircleReport from '@/views/circle/CircleReport.vue'
// import CircleMessage from '@/views/circle/CircleMessage.vue'
// import CircleMessageComment from '@/views/circle/CircleMessageComment.vue'
// import CircleMessageReward from '@/views/circle/CircleMessageReward.vue'
// import CircleMessageThumbsUp from '@/views/circle/CircleMessageThumbsUp.vue'

// import ShareCircle from '@/views/circle/ShareCircle.vue'

const DryingListDetails = () => import('@/views/circle/DryingListDetails.vue')
const DryingListRelease = () => import('@/views/circle/DryingListRelease.vue')
// const CircleOwn = () => import('@/views/circle/CircleOwn.vue')
const CircleReport = () => import('@/views/circle/CircleReport.vue')
// const CircleMessage = () => import('@/views/circle/CircleMessage.vue')
const CircleMessageComment = () => import('@/views/circle/CircleMessageComment.vue')
const CircleMessageReward = () => import('@/views/circle/CircleMessageReward.vue')
const CircleMessageThumbsUp = () => import('@/views/circle/CircleMessageThumbsUp.vue')

export default [{
        path: "/circle/dryingListDetails/:id",
        component: lazyload(DryingListDetails),
        meta: {
            title: "晒单详情",
        }
    }, {
        path: "/circle/dryingrelease",
        component: lazyload(DryingListRelease),
        meta: {
            title: "晒单",
        }
    },
    // {
    //     path: "/circle/circleOwn/:id",
    //     component: lazyload(CircleOwn),
    //     meta: {
    //         title: "晒单圈个人",
    //     }
    // }, {
    //     path: "/userInfo/userInfoCircle?id=:id",
    //     component: lazyload(CircleOwn),
    //     meta: {
    //         title: "晒单圈他人",
    //     }
    // }, 
    {
        path: "/circle/circleReport",
        component: lazyload(CircleReport),
        meta: {
            title: "举报",
        }
    },
    // {
    //     path: "/circle/circleMessage",
    //     component: lazyload(CircleMessage),
    //     meta: {
    //         title: "消息",
    //     }
    // }, 
    {
        path: "/circle/circleMessageComment",
        component: lazyload(CircleMessageComment),
        meta: {
            title: "评论/回复",
        }
    }, {
        path: "/circle/circleMessageReward",
        component: lazyload(CircleMessageReward),
        meta: {
            title: "打赏",
        }
    }, {
        path: "/circle/circleMessageThumbsUp",
        component: lazyload(CircleMessageThumbsUp),
        meta: {
            title: "点赞",
        }
    },
    // {
    //     path: "/circle/shareCircle",
    //     component: lazyload(ShareCircle),
    //     meta: {
    //         title: "分享到晒单圈",
    //     }
    // }
]