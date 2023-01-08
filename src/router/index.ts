import { createRouter, createWebHistory } from "vue-router";
import routes from "./first";
// typings.d.ts or router.ts
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 标题
     */
    title: string;
  }
}

// console.log(import.meta.env.BASE_URL);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // scrollBehavior(to, from, savedPosition) {
  //   if (to.hash) {
  //     return {
  //       el: to.hash,
  //       behavior: "smooth", // 平滑过渡
  //       block: "start", // 上边框与视窗顶部平齐。默认值
  //     };
  //   } else if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { top: 0 };
  //   }
  // },
  routes,
});

router.beforeEach((to, from) => {
  // console.log(to);
  // console.log(from);
  // if (from.path === to.path && from.hash !== to.hash) {
  //   console.log(to.hash);
  //   console.log(from.hash);
  // TODO 无法在全局导航守卫中区别push和replace
  // next({ ...to, replace: true });
  // }
  // next();
  // 有next的时候，方法不可以为async
  // 当无next的时候，返回 false 以取消导航
  // return false
});

router.afterEach(async (to, from, failure) => {
  if (failure) {
    // 导航出错调试信息
    console.log(to);
    console.log(from);
    console.log(failure);
  }
});

export default router;
