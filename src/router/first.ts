import credential from "./second/credential";
import notepad from "./second/notepad";
import game from "./second/game";
import resume from "./second/resume";

export default [{
  path: "/",
  meta: { title: "首页" },
  children: [
    {
      path: "", // 上级导航默认显示
      component: () => import("~/views/Home.vue"),
    },
    {
      path: "todo",
      component: () => import("~/views/ToDo.vue"),
      meta: { title: "待办" },
    },
    {
      path: "about/:id",
      component: () => import("~/views/AboutView.vue"),
      props: true,
      meta: { title: "关于" },
    },
    {
      path: "settings",
      component: () => import("~/views/Settings.vue"),
      meta: { title: "设置" },
    },
    resume,
    credential,
    notepad,
    game,
  ], // end / children
},];
