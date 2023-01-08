<script lang="ts" setup>
import { reactive } from 'vue';
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import { urlHelper } from '~/utils/urlHelper'

const router = useRouter();
const route = useRoute();
const home: RouteRecordRaw = router.options.routes[0];
const baseTitle = import.meta.env.VITE_APP_NAME || "WzBlog";


/**
 * 面包屑数据
 */
interface Breadcrumb {
  /**
   * 路径
   */
  path: string;
  /**
   * 标题
   */
  title: string;
  isLast: boolean;
};

const isHome = (route: RouteRecordRaw): boolean => {
  if (route && home) {
    return route.path === home.path;
  } else {
    return false;
  }
};

const getBreadcrumb = (): Breadcrumb[] => {
  const breadList: Breadcrumb[] = [];
  const matched = router.currentRoute.value.matched;
  // console.log(matched);
  const hasPathParams = Object.keys(route.params).length;
  const hasQueryParams = Object.keys(route.query).length;
  //如果不是首页
  if (!isHome(matched[0])) {
    breadList.push({
      path: home.path,
      title: home.meta?.title || home.name?.toString() || 'Home',
      isLast: false,
    });
  }
  let lastPath: string;
  matched.forEach((val) => {
    if (!val.meta) return;
    let path: string = val.path;
    if (lastPath && path === lastPath) return;
    // console.log(path);
    lastPath = path;
    if (hasPathParams) {
      path = urlHelper.urlFillPathObject(path, route.params);
    }
    if (hasQueryParams) {
      path = urlHelper.urlAppendObject(path, route.query);
    }
    breadList.push({
      path,
      title: val.meta?.title || val.name?.toString() || val.path,
      isLast: false,
    });
  });
  const lastTitle = 1 < breadList.length ? breadList.slice(-1).pop()!.title : "";
  // console.log(lastTitle);
  document.title = `${baseTitle} ${lastTitle}`;
  // console.log(breadList);
  breadList.slice(-1).shift()!.isLast = true;
  return breadList;
}

// 路由集合
const breadList: Breadcrumb[] = reactive(getBreadcrumb());

</script>

<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="index" :replace="item.isLast"
      :to="item.isLast ? '#last' : item.path">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>