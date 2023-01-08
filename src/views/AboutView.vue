<script setup lang="ts">
import { useMediaControls } from '@vueuse/core'
import { ElNotification as notify } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { Back, List, CircleCheck, CircleCheckFilled } from '@element-plus/icons-vue';
import "element-plus/theme-chalk/src/notification.scss";
const props = defineProps<{ id: string }>();
const route = useRoute();
const test = ref(route.params.test);
// console.log(test.value);
const env = import.meta.env
// console.log(env)
const router = useRouter();

const baseUrl = import.meta.env.VITE_BASE_URL;
const bgAudio = ref<HTMLAudioElement>();
const { playing: audioBgPlaying, currentTime: audioBgCurrentTime,
  muted: audioBgMuted, volume: audioBgVolume } = useMediaControls(bgAudio, {
    src: `${baseUrl}audio/game/tetris/background.mp3`,
  });

const audioMutedToggle = () => {
  audioBgMuted.value = !audioBgMuted.value;
};

const bgAudioPlay = () => {
  audioBgPlaying.value = true;
  audioBgCurrentTime.value = 0;
  audioBgVolume.value = 0.3;
};

const playBg = async () => {
  bgAudioPlay();
  // 只用首次触发点击开始即可，然后移除事件
  window.removeEventListener("click", playBg);
};

onMounted(() => {
  window.addEventListener("click", playBg);
});


onUnmounted(() => {
  audioMutedToggle();
});

const goBack = () => {
  // console.log(router);
  router.back();
};

const onBack = () => {
  notify('Back')
}
</script>

<template>
  <el-page-header :icon="Back" @back="onBack">
    <!-- Line 1 -->
    <template #breadcrumb>
      <breadcrumb />
    </template>
    <!-- Line 2 -->
    <template #icon />
    <template #title />
    <template #content>
      <div class="flex items-center">
        <el-avatar class="mr-3" :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <span class="text-large font-600 mr-3"> 关于 </span>
        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
          关于
        </span>
        <el-tag>Aboud</el-tag>
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
      <el-card class="box-card form-card">
        <template #header>
          <div class="card-header">
            <span>关于</span>
            <el-button type="primary" :icon="Back" round @click="goBack" class="button btn-back">返回</el-button>
          </div>
        </template>
        <el-card body-style="padding: 1.3rem 0.3rem;">
          <template #header>
            <el-icon>
              <List />
            </el-icon>
            <span>To Do List</span>
          </template>
          <el-row :gutter="20" class="form-row">
            <el-col>
              <el-icon>
                <CircleCheck />
              </el-icon>
              <span>凭据前端加密编码切片保存在其它网站</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="form-row">
            <el-col>
              <el-icon>
                <CircleCheck />
              </el-icon>
              <span>Make To Do List</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="form-row">
            <el-col>
              <el-icon>
                <CircleCheck />
              </el-icon>
              <span>详情表格高亮当前行</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="form-row">
            <el-col>
              <el-icon>
                <CircleCheck />
              </el-icon>
              <span>
                图标和文字对齐
                .cell-item {
                display: flex;
                align-items: center;
                }
              </span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="form-row">
            <el-col>
              <el-icon>
                <CircleCheckFilled />
              </el-icon>
              <span>Apifox 是接口管理、开发、测试全流程集成工具，使用受众为整个研发技术团队，主要使用者为前端开发、后端开发和测试人员。</span>
            </el-col>
          </el-row>
        </el-card>
      </el-card>
    </template>
  </el-page-header>
  <audio ref="bgAudio" loop />
</template>

<style scoped>
@media (min-width: 1024px) {

  .form-card {
    margin-top: 10px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-row {
    margin: 1rem 0 !important;
  }

  .btn-back {
    width: 100px;
  }
}
</style>
