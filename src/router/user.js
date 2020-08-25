import {
    lazyload
} from './async'

const UserDetail = () => import("@/views/user/UserDetail.vue")
const BindPhone = () => import("@/views/user/BindPhone.vue")
const BindGender = () => import("@/views/user/BindGender.vue")
const BindCard = () => import("@/views/user/BindCard.vue")
const ChangePwd = () => import("@/views/user/ChangePwd.vue")
const Fans = () => import("@/views/user/Fans.vue")
const Follow = () => import("@/views/user/Follow.vue")
const Special = () => import("@/views/user/Special.vue")
const MakeMoney = () => import("@/views/user/MakeMoney.vue")
// const WelcCode = () => import("@/views/user/WelcCode.vue")
const GetIntegral = () => import("@/views/user/GetIntegral.vue")
const MyFriends = () => import("@/views/user/MyFriends.vue")
const Integral = () => import("@/views/user/Integral.vue")
const BankCharge = () => import("@/views/user/BankCharge.vue")
const WechatCharge = () => import("@/views/user/WechatCharge.vue")
const OfflineChargeSelect = () => import("@/views/user/OfflineChargeSelect.vue")
const OnlineCharge = () => import("@/views/user/OnlineCharge.vue")

const RedeemPoints = () => import("@/views/user/RedeemPoints.vue")
const Withdraw = () => import("@/views/user/Withdraw.vue")
const Bill = () => import("@/views/user/Bill/Bill.vue")

// import UserDetail from '@/views/user/UserDetail.vue'
// import BindPhone from '@/views/user/BindPhone.vue'
// import BindGender from '@/views/user/BindGender.vue'
// import BindCard from '@/views/user/BindCard.vue'
// import ChangePwd from '@/views/user/ChangePwd.vue'
// import Fans from '@/views/user/Fans.vue'
// import Follow from '@/views/user/Follow.vue'
// import Special from '@/views/user/Special.vue'
// import MakeMoney from '@/views/user/MakeMoney.vue'
// import WelcCode from '@/views/user/WelcCode.vue'
// import GetIntegral from '@/views/user/GetIntegral.vue'
// import MyFriends from '@/views/user/MyFriends.vue'
// import Integral from '@/views/user/Integral.vue'
// import BankCharge from '@/views/user/BankCharge.vue'
// import WechatCharge from '@/views/user/WechatCharge.vue'
// import OfflineChargeSelect from '@/views/user/OfflineChargeSelect.vue'
// import OnlineCharge from '@/views/user/OnlineCharge.vue'

// import RedeemPoints from '@/views/user/RedeemPoints.vue'
// import Withdraw from '@/views/user/Withdraw.vue'
// import Bill from '@/views/user/Bill/Bill.vue'

export default [{
        path: "/user/userDetail",
        component: lazyload(UserDetail),
        meta: {
            title: "个人信息"
        }
    }, {
        path: "/user/bindPhone",
        component: lazyload(BindPhone),
        meta: {
            title: "绑定手机号"
        }
    }, {
        path: "/user/bindGender",
        component: lazyload(BindGender),
        meta: {
            title: "设置性别"
        }
    }, {
        path: "/user/bindCard",
        component: lazyload(BindCard),
        meta: {
            title: "绑定银行卡"
        }
    }, {
        path: "/user/changePwd",
        component: lazyload(ChangePwd),
        meta: {
            title: "修改登陆密码"
        }
    }, {
        path: "/user/fans/:nick?",
        component: lazyload(Fans),
    }, {
        path: "/user/follow/:nick?",
        component: lazyload(Follow),
    }, {
        path: "/user/special",
        component: lazyload(Special),
        meta: {
            title: "专家介绍"
        }
    }, {
        path: "/user/makeMoney",
        component: lazyload(MakeMoney),
        meta: {
            title: "我要赚钱"
        }
    },
    //  {
    //     path: "/user/welcCode",
    //     component: lazyload(WelcCode),
    //     meta: {
    //         title: "我的邀请码"
    //     }
    // }, 
    {
        path: "/user/getIntegral",
        component: lazyload(GetIntegral),
        meta: {
            title: "领取积分"
        }
    }, {
        path: "/user/myFriends",
        component: lazyload(MyFriends),
        meta: {
            title: "我的助力伙伴"
        }
    }, {
        path: "/user/integral",
        component: lazyload(Integral),
        meta: {
            title: "积分充值/兑换"
        }
    }, {
        path: "/user/bankCharge",
        component: lazyload(BankCharge),
        meta: {
            title: "银行卡转账"
        }
    }, {
        path: "/user/wechatCharge",
        component: lazyload(WechatCharge),
        meta: {
            title: "微信转账"
        }
    }, {
        path: "/user/offlineChargeSelect",
        component: lazyload(OfflineChargeSelect),
        meta: {
            title: "线下存款"
        }
    }, {
        path: '/user/onlineCharge',
        component: lazyload(OnlineCharge),
        meta: {
            title: '线上充值'
        }
    }, {
        path: "/user/redeemPoints",
        component: lazyload(RedeemPoints),
        meta: {
            title: "兑换积分"
        }
    }, {
        path: "/user/withdraw",
        component: lazyload(Withdraw),
        meta: {
            title: "金币提现"
        }
    }, {
        path: "/user/bill",
        component: lazyload(Bill),
        meta: {
            title: "账户清单"
        }
    },
]