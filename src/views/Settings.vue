<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { MoreFilled, Back, List, CircleCheck, CircleCheckFilled } from '@element-plus/icons-vue';

const route = useRoute();
const test = ref(route.params.test);
//  console.log(test.value);
const env = import.meta.env
//  console.log(env)
const wzSteps = [
  {
    title: 'WzBlog',
    description: '2022-10-24',
    icon: List,
    status: 'wait',
  },
  {
    title: 'Nacos',
    description: '2022-07-15',
    icon: MoreFilled,
    status: 'process',
  },
  {
    title: 'ElementPlus',
    description: '2022-04-13',
    icon: CircleCheck,
    status: 'finish',
  },
  {
    title: 'Vuex',
    description: '2021-05-13',
    icon: Back,
    status: 'error',
  },
  {
    title: 'Vue',
    description: '2020-01-01',
    icon: CircleCheckFilled,
    status: 'success',
  },
];
wzSteps.reverse();

const router = useRouter();

const goBack = () => {
  // console.log(router);
  router.back();
};
</script>


<template>
  <el-page-header :icon="Back" @back="goBack" class="wzblog-settings-page">
    <!-- Line 1 -->
    <template #breadcrumb>
      <breadcrumb />
    </template>
    <!-- Line 2 -->
    <template #icon />
    <template #title>
      返回
    </template>
    <template #content>
      <div class="flex items-center">
        <el-avatar class="mr-3" :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <span class="text-large font-600 mr-3"> 设置 </span>
        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
          设置
        </span>
        <el-tag>Settings</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>Print</el-button>
        <el-button type="primary" class="ml-2">Edit</el-button>
      </div>
    </template>
    <!-- Lines after 2 -->
    <template #default>
      <el-aside class="home-affix-container">
        <el-affix target=".home-affix-container" :offset="130">
          <el-steps>
            <el-step v-for="step in wzSteps" :title="step.title" :description="step.description" :icon="step.icon"
              :status="step.status" />
          </el-steps>
          <div class="tetris-rects"></div>
        </el-affix>
      </el-aside>
    </template>
  </el-page-header>
</template>

<style scoped>
@media (min-width: 1024px) {

  .wzblog-settings-page {
    padding: 5px;
  }

  .home-affix-container {
    margin-top: 20px;
    width: calc(100vw - 500px);
  }

  /** 子节点样式 */
  :deep(#affix_timeline .ep-card__body > .ep-timeline > .ep-timeline-item:last-child) {
    padding: 0;
  }

  .tetris-rects {
    margin-top: 10px;
    width: 128px;
    height: 352px;
    background:
      url(~/assets/game/tetris/0.png) no-repeat top 0 left,
      url(~/assets/game/tetris/1.png) no-repeat top 32px left,
      url(~/assets/game/tetris/2.png) no-repeat top 96px left,
      url(~/assets/game/tetris/3.png) no-repeat top 128px left,
      url(~/assets/game/tetris/4.png) no-repeat top 192px left,
      url(~/assets/game/tetris/5.png) no-repeat top 256px left,
      url(~/assets/game/tetris/6.png) no-repeat top 288px left;
  }
}
</style>