<script setup lang="ts">
import { RouterView } from 'vue-router';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { Back, CaretTop } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ref, watchEffect } from 'vue';
import { useWebConfigStore } from '~/store/webConfig'
const router = useRouter();
const goBack = () => router.back();
const asideVisible = ref(true);
watchEffect(() => {
  asideVisible.value = !useWebConfigStore().isHideAside && !useWebConfigStore().isWebFullScreen
  // console.log(asideVisible);
});
</script>

<template>
  <el-config-provider namespace="ep" :locale="zhCn">
    <el-container class="wzblog-home-container max-width max-height">
      <el-scrollbar wrap-class="wzblog-home-scroll">
        <el-header v-if="!useWebConfigStore().isWebFullScreen" class="max-width no-padding max-z-index">
          <BaseHeader />
        </el-header>
        <el-container>
          <!-- :width这个属性还不能定义成样式，不然无法自动计算展开和收缩 :width="65" -->
          <el-aside v-if="asideVisible" width="65" class="wzblog-aside high-z-index">
            <BaseSide />
          </el-aside>
          <el-main class="wzblog-main">
            <RouterView />
          </el-main>
        </el-container>
        <el-footer class="no-padding">
          <BaseFooter />
        </el-footer>
      </el-scrollbar>
    </el-container>
    <el-backtop @click="goBack" target=".wzblog-home-scroll" class="max-z-index" :right="90" :bottom="20">
      <el-tooltip content="后退" effect="light" placement="top">
        <el-icon>
          <Back />
        </el-icon>
      </el-tooltip>
    </el-backtop>
    <el-backtop :right="30" target=".wzblog-home-scroll" class="max-z-index" :bottom="20">
      <el-tooltip content="置顶" effect="light" placement="top">
        <el-icon>
          <CaretTop />
        </el-icon>
      </el-tooltip>
    </el-backtop>
  </el-config-provider>
</template>

<style>
a {
  text-decoration: none;
}

#app {
  color: var(--ep-text-color-primary);
}

.wzblog-home-container .ep-scrollbar__bar {
  z-index: 999;
}

.wzblog-main {
  padding: 0;
  width: calc(100vw - 65px);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
}

.no-padding {
  padding: 0;
}

.max-z-index {
  z-index: 999;
}

.max-width {
  width: 100vw;
}

.max-height {
  height: 100vh;
}

.high-z-index {
  z-index: 100;
}
</style>
