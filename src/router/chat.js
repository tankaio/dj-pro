
import {
    lazyload
} from './async'

// let Search = () => import('@/views/chat/Search.vue')
// let Room = () => import('@/views/chat/Room.vue')

// import Search from '@/views/chat/Search.vue'
// import RedRoom from '@/views/chat/RedRoom.vue'
// import LotteryRoom from '@/views/chat/LotteryRoom.vue'
// import ChangLongAssistant from '@/views/chat/ChangLongAssistant.vue'
// import ChangLongDesc from '@/views/chat/ChangLongDesc.vue'
// import RoomInfo from '@/views/chat/RoomInfo.vue'
// import ChangeRoomNick from '@/views/chat/ChangeRoomNick.vue'
// import RoomMembers from '@/views/chat/RoomMembers.vue'
// import PrivateChatList from '@/views/chat/PrivateChatList.vue'
// import ChangeRoomName from '@/views/chat/ChangeRoomName.vue'
// import MemberInfo from '@/views/chat/MemberInfo.vue'
// import Announcement from '@/views/chat/Announcement.vue'
// import SearchMore from '@/views/chat/SearchMore.vue'
// import RedBagNiuNiu from '@/views/chat/RedBagNiuNiu.vue'
// import RedDetial from '@/views/chat/RedDetial.vue'
// import GameWallet from '@/views/chat/GameWallet.vue'
// import GameWalletPut from '@/views/chat/GameWalletPut.vue'
// import WalletInstructions from '@/views/chat/WalletInstructions.vue'
// import DesignatedBookMarker from '@/views/chat/DesignatedBookMarker.vue'
// import IntroToPlay from '@/views/chat/IntroToPlay.vue'
// import SolitairePlay from '@/views/chat/SolitairePlay.vue'
// import SweepPlay from '@/views/chat/SweepPlay.vue'
// import RedDetialList from '@/views/chat/RedDetialList.vue'

const Search = () => import('@/views/chat/Search.vue')
const RedRoom = () => import('@/views/chat/RedRoom.vue')
// const ChatRoom = () => import('@/views/chat/ChatRoom.vue')
const CreateRoom = () => import('@/views/chat/CreateRoom.vue')
const LotteryRoom = () => import('@/views/chat/LotteryRoom.vue')
const ChangLongAssistant = () => import('@/views/chat/ChangLongAssistant.vue')
const ChangLongDesc = () => import('@/views/chat/ChangLongDesc.vue')
const RoomInfo = () => import('@/views/chat/RoomInfo.vue')
const ChangeRoomNick = () => import('@/views/chat/ChangeRoomNick.vue')
const RoomMembers = () => import('@/views/chat/RoomMembers.vue')
const PrivateChatList = () => import('@/views/chat/PrivateChatList.vue')
const ChangeRoomName = () => import('@/views/chat/ChangeRoomName.vue')
const MemberInfo = () => import('@/views/chat/MemberInfo.vue')
const Announcement = () => import('@/views/chat/Announcement.vue')
const SearchMore = () => import('@/views/chat/SearchMore.vue')
const RedBagNiuNiu = () => import('@/views/chat/RedBagNiuNiu.vue')
const RedDetial = () => import('@/views/chat/RedDetial.vue')
const GameWallet = () => import('@/views/chat/GameWallet.vue')
const GameWalletPut = () => import('@/views/chat/GameWalletPut.vue')
const WalletInstructions = () => import('@/views/chat/WalletInstructions.vue')
const DesignatedBookMarker = () => import('@/views/chat/DesignatedBookMarker.vue')
const IntroToPlay = () => import('@/views/chat/IntroToPlay.vue')
const SolitairePlay = () => import('@/views/chat/SolitairePlay.vue')
const SweepPlay = () => import('@/views/chat/SweepPlay.vue')
const RedDetialList = () => import('@/views/chat/RedDetialList.vue')


const Lhc = () => import('@/views/games/Lhc.vue')
const Betrecord = () => import('@/views/games/betRecord.vue')
const BetDetails = () => import('@/views/games/BetDetails.vue')
const RunChart = () => import('@/views/games/RunChart.vue')
const HowPlay = () => import('@/views/games/HowPlay.vue')

// import Lhc from '@/views/games/Lhc.vue'
// import Betrecord from '@/views/games/betRecord.vue'
// import BetDetails from '@/views/games/BetDetails.vue'
// import RunChart from '@/views/games/RunChart.vue'
// import HowPlay from '@/views/games/HowPlay.vue'

export default [{
        path: "/chat/search",
        component: lazyload(Search),
        meta: {
            title: "活动",
        }
    }, {
        path: "/chat/room/red/:id",
        component: lazyload(RedRoom),
        meta: {
            title: "红包聊天室",
            animate: false,
        }
    }, {
        path: "/chat/room/lottery/:id",
        component: lazyload(CreateRoom),
        meta: {
            title: "购彩聊天室",
            animate: false,
        }
    }, {
        path: "/chat/changLongAssistant",
        component: lazyload(ChangLongAssistant),
    }, {
        path: "/chat/changLongDesc",
        component: lazyload(ChangLongDesc),
        meta: {
            title: '长龙助手说明'
        }
    }, {
        path: "/chat/roomInfo/:id",
        component: lazyload(RoomInfo),
        meta: {
            title: '房间信息'
        }
    }, {
        path: "/chat/changeRoomNick",
        component: lazyload(ChangeRoomNick),
    },
    {
        path: "/chat/roomMembers",
        component: lazyload(RoomMembers),
    }, {
        path: "/chat/privateChatList",
        component: lazyload(PrivateChatList),
        meta: {
            title: "私聊列表"
        }
    }, {
        path: "/chat/changeRoomName",
        component: lazyload(ChangeRoomName),
        meta: {
            title: "设置备注"
        }
    }, {
        path: "/chat/memberInfo",
        component: lazyload(MemberInfo),
        meta: {
            title: "成员信息"
        }
    }, {
        path: "/chat/announcement",
        component: lazyload(Announcement),
        meta: {
            title: "房间公告"
        }
    },
    {
        path: "/chat/searchMore/:type/:search",
        component: lazyload(SearchMore),
    },
    {
        path: "/chat/redBagNiuNiu",
        component: lazyload(RedBagNiuNiu),
        meta: {
            title: "牛牛红包"
        }
    }, {
        path: "/chat/redDetial/:id",
        component: lazyload(RedDetial),
        meta: {
            title: "红包详情"
        }
    }, {
        path: "/chat/gameWallet",
        component: lazyload(GameWallet),
        meta: {
            title: "游戏钱包"
        }
    }, {
        path: "/chat/gameWalletPut",
        component: lazyload(GameWalletPut),
        meta: {
            title: "钱包余额转出"
        }
    }, {
        path: "/chat/designatedBookMarker",
        component: lazyload(DesignatedBookMarker),
        meta: {
            title: "指定庄家"
        }
    }, {
        path: "/chat/walletInstructions",
        component: lazyload(WalletInstructions),
        meta: {
            title: "钱包说明"
        }
    }, {
        path: "/chat/introToPlay",
        component: lazyload(IntroToPlay),
        meta: {
            title: "红包牛牛"
        }
    }, {
        path: "/chat/solitairePlay",
        component: lazyload(SolitairePlay),
        meta: {
            title: "红包接龙"
        }
    }, {
        path: "/chat/sweepPlay",
        component: lazyload(SweepPlay),
        meta: {
            title: "红包扫雷"
        }
    }, {
        path: "/chat/redDetialList",
        component: lazyload(RedDetialList),
        meta: {
            title: "红包扫雷"
        }
    }, {
        path: "/games/lhc/:name",
        component: lazyload(Lhc),
        meta: {
            title: "六合彩",
        }
    }, {
        path: "/games/betrecord",
        component: lazyload(Betrecord),
        meta: {
            title: "投注记录",
        }
    }, {
        path: "/games/runChart",
        component: lazyload(RunChart),
    }, {
        path: "/games/betDetails",
        component: lazyload(BetDetails),
        meta: {
            title: "注单详情",
        }
    }, {
        path: "/games/howplay",
        component: lazyload(HowPlay),
        meta: {
            title: "玩法介绍",
        }
    }
]