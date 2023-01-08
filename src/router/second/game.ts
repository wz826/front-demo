export default {
  path: "game",
  meta: { title: "游戏" },
  children: [
    {
      path: "", // 上级导航默认显示
      component: () => import("~/views/game/Index.vue"),
    },
    {
      path: "tetris",
      component: () => import("~/views/game/tetris/Tetris.vue"),
      meta: { title: "俄罗斯方块" },
    },
    {
      path: "tank90",
      component: () => import("~/views/game/tank90/Index.vue"),
      meta: { title: "90坦克" },
    },
    {
      path: "contra",
      component: () => import("~/views/game/contra/Index.vue"),
      meta: { title: "魂斗罗" },
    },
    {
      path: "mario",
      component: () => import("~/views/game/mario/Index.vue"),
      meta: { title: "超级马力欧" },
    },
  ],
}; // end /game children
