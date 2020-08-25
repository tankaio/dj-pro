const Login = () => import("@/views/auth/Login.vue")
const Sign = () => import("@/views/auth/Sign.vue")
// const Home = () => import("@/views/home/Home.vue")
const page404 = () => import("@/views/Page404.vue")
// const User = () => import("@/views/user/User.vue")
// const Chat = () => import("@/views/chat/Chat.vue")
// const Circle = () => import("@/views/circle/Circle.vue")
// const Activity = () => import("@/views/activity/Activity.vue")
// const Start = () => import("@/views/auth/Start.vue")

// import Login from "@/views/auth/Login.vue"
// import Sign from "@/views/auth/Sign.vue"
import Home from "@/views/home/Home.vue"
// import page404 from "@/views/Page404.vue"
import User from "@/views/user/User.vue"
import Chat from "@/views/chat/Chat.vue"
import Circle from "@/views/circle/Circle.vue"
import Activity from "@/views/activity/Activity.vue"
// import Start from "@/views/auth/Start.vue"


import userRouter from './user'
import awardRouter from './award'
import otherRouter from './other'
import chatRouter from './chat'
import homeRouter from './home'
import circleRouter from './circle'
import toutiaoRouter from './toutiao'

export default [{
        path: "",
        redirect: '/home'
        // component: Start,
        // meta: {
        //     animate: false
        // }
    }, {
        path: "/home",
        component: Home,
        meta: {
            title: "***计划站",
            animate: false,
            tabbar: '0',
        }
    },
    {
        path: "/login",
        component: Login,
        meta: {
            title: "注册",
        }
    },
    {
        path: "/sign",
        component: Sign,
        meta: {
            title: "登录"
        }
    },
    {
        path: "/user",
        component: User,
        meta: {
            title: "个人中心",
            animate: false,
            tabbar: '3'
        }
    },
    {
        path: "/chat",
        component: Chat,
        meta: {
            title: "聊天室",
            animate: false,
            tabbar: '2'
        }
    },
    {
        path: "/circle",
        component: Circle,
        meta: {
            title: "晒单圈",
            animate: false,
            tabbar: '1'
        }
    },
    {
        path: "/activity",
        component: Activity,
        meta: {
            title: "活动",
            animate: false,
            tabbar: '4'
        }
    },
    ...userRouter,
    ...awardRouter,
    ...otherRouter,
    ...chatRouter,
    ...homeRouter,
    ...circleRouter,
    ...toutiaoRouter,
    {
        path: '*',
        component: page404
    }
]