import {
    lazyload
} from './async'

// import UserInfo from "@/views/other/userInfo/userInfoPlan.vue"
// import PlanDetail from "@/views/other/PlanDetail.vue"
// import Publish from "@/views/other/Publish.vue"
// import OrderDetail from "@/views/other/OrderDetail.vue"
// import MessageList from "@/views/other/MessageList.vue"
// import Message from "@/views/other/Message.vue"
// import More from "@/views/other/More.vue"
// import Help from "@/views/other/Help.vue"
// import About from "@/views/other/About.vue"
// import FeedBack from "@/views/other/FeedBack.vue"
// import FeedBackDetail from "@/views/other/FeedBackDetail.vue"
// import Service from "@/views/other/Service.vue"
// import Share from "@/views/other/Share.vue"

// import OpenPlay from "@/views/plan/OpenPlay.vue"
// import OneDouble from "@/views/plan/OneDouble.vue"
// import ColorBo from "@/views/plan/ColorBo.vue"
// import Numbers from "@/views/plan/Numbers.vue"
// import Zodiac from "@/views/plan/Zodiac.vue"
// import Mantissa from "@/views/plan/Mantissa.vue"
// import Size from "@/views/plan/Size.vue"

// import ShareToCircle from "@/views/other/ShareToCircle.vue"

const UserInfo = () => import('@/views/other/UserInfo.vue')
const PlanDetail = () => import('@/views/other/PlanDetail.vue')
const Publish = () => import('@/views/other/Publish.vue')
const OrderDetail = () => import('@/views/other/OrderDetail.vue')
const MessageList = () => import('@/views/other/MessageList.vue')
const Message = () => import('@/views/other/Message.vue')
const More = () => import('@/views/other/More.vue')
const Help = () => import('@/views/other/Help.vue')
const About = () => import('@/views/other/About.vue')
const FeedBack = () => import('@/views/other/FeedBack.vue')
const FeedBackDetail = () => import('@/views/other/FeedBackDetail.vue')
const Service = () => import('@/views/other/Service.vue')
const Share = () => import('@/views/other/Share.vue')
const ShareToCircle = () => import('@/views/other/ShareToCircle.vue')

const OpenPlay = () => import('@/views/plan/OpenPlay.vue')
const OneDouble = () => import('@/views/plan/OneDouble.vue')
const ColorBo = () => import('@/views/plan/ColorBo.vue')
const Numbers = () => import('@/views/plan/Numbers.vue')
const Zodiac = () => import('@/views/plan/Zodiac.vue')
const Mantissa = () => import('@/views/plan/Mantissa.vue')
const Size = () => import('@/views/plan/Size.vue')

const UserInfoPlan = () => import('@/views/other/UserInfo/UserInfoPlan.vue')
const UserInfoCircle = () => import('@/views/other/UserInfo/UserInfoCircle.vue')
const UserInfoLiuHe = () => import('@/views/other/UserInfo/UserInfoLiuHe.vue')
const UserInfoPicture = () => import('@/views/other/UserInfo/UserInfoPicture.vue')

export default [{
        path: "/userInfo",
        component: lazyload(UserInfo),
        children: [{
            path: '/userInfo/userInfoPlan',
            component: lazyload(UserInfoPlan),
        }, {
            path: '/userInfo/userInfoCircle',
            component: lazyload(UserInfoCircle)
        }, {
            path: '/userInfo/userInfoLiuHe',
            component: lazyload(UserInfoLiuHe)
        }, {
            path: '/userInfo/userInfoPicture',
            component: lazyload(UserInfoPicture)
        }, ]
    },
    {
        path: "/planDetail/:id",
        component: lazyload(PlanDetail),
        meta: {
            title: "计划详情"
        }
    }, {
        path: "/publish",
        component: lazyload(Publish),
        children: [{
            path: "/publish",
            component: lazyload(OpenPlay),
            meta: {
                title: '发布计划',
            },
        }, {
            path: "/publish/oneDouble/:type?",
            component: lazyload(OneDouble),
            meta: {
                title: '发布计划',
            },
        }, {
            path: '/publish/colorBo/:type?',
            component: lazyload(ColorBo),
            meta: {
                title: '发布计划',
            },
        }, {
            path: '/publish/numbers/:type?',
            component: lazyload(Numbers),
            meta: {
                title: '发布计划',
            },
        }, {
            path: '/publish/zodiac/:type?',
            component: lazyload(Zodiac),
            meta: {
                title: '发布计划',
            },
        }, {
            path: '/publish/mantissa/:type?',
            component: lazyload(Mantissa),
            meta: {
                title: '发布计划',
            },
        }, {
            path: "/publish/size/:type?",
            component: lazyload(Size),
            meta: {
                title: '发布计划',
            },
        }, {
            path: '/publish/hezodiac/:type?',
            component: lazyload(Zodiac),
            meta: {
                title: '发布计划',
            },
        }, {
            path: '/publish/jointMark/:type?',
            component: lazyload(Numbers),
            meta: {
                title: '发布计划',
            },
        }, {
            path: '/publish/positiveSpecialCode/:type?',
            component: lazyload(Numbers),
            meta: {
                title: '发布计划',
            },
        }, {
            path: '/publish/selfSelection/:type?',
            component: lazyload(Numbers),
            meta: {
                title: '发布计划',
            },
        }]

    }, {
        path: "/orderDetail/:type/:id",
        component: lazyload(OrderDetail),
        meta: {
            title: "计划详情"
        }
    }, {
        path: "/messageList",
        component: lazyload(MessageList),
        meta: {
            title: "站内信"
        }
    }, {
        path: "/message/:id",
        component: lazyload(Message),
        meta: {
            title: "站内信标题"
        }
    }, {
        path: "/more",
        component: lazyload(More),
        meta: {
            title: "更多"
        }
    }, {
        path: "/help",
        component: lazyload(Help),
        meta: {
            title: "帮助中心"
        }
    }, {
        path: "/about",
        component: lazyload(About),
        meta: {
            title: "关于本站"
        }
    }, {
        path: "/feedBack/:list?",
        component: lazyload(FeedBack),
        meta: {
            title: "意见反馈"
        }
    }, {
        path: "/feedBackDetail/:id/:state",
        component: lazyload(FeedBackDetail),
        meta: {
            title: "我的反馈"
        }
    }, {
        path: "/service",
        component: lazyload(Service),
        meta: {
            title: "在线客服"
        }
    }, {
        path: "/share",
        component: lazyload(Share),
        meta: {
            title: "分享本站"
        }
    }, {
        path: "/shareToCircle",
        component: lazyload(ShareToCircle),
        meta: {
            title: "分享到晒单圈"
        }
    },
]