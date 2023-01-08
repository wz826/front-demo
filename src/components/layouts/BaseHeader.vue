<script lang="ts" setup>
import { faEye, faEyeSlash, } from "@fortawesome/free-regular-svg-icons";
import { faLink, faUnlink, faCheck, faHome, faInfoCircle, } from "@fortawesome/free-solid-svg-icons";
import { DocumentAdd, Setting, Stamp, } from '@element-plus/icons-vue';
import { toggleDark } from '~/composables';
import { useWebConfigStore } from '~/store/webConfig';
import { Ref, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter();
const activeIndex: Ref<string> = ref<string>('');
const asideVisible = ref(true);
const menu = ["/notepad/add", "/credential/add", "/todo", "/about", "/settings"];
watchEffect(() => {
  asideVisible.value = !useWebConfigStore().isHideAside;
  // console.log(asideVisible);
  const curr = currentRoute.value.path;
  // console.log(curr);
  // console.log(menu.find(it => curr.startsWith(it)));
  activeIndex.value = curr === '/' ? '/' : menu.find(it => curr.startsWith(it)) || '';
  // console.log(activeIndex.value);
});
</script>

<template>
  <el-menu router mode="horizontal" :ellipsis="false" :default-active="activeIndex" class="wzblog-header max-z-index">
    <el-menu-item index="/">
      <template #title>
        <el-icon>
          <font-awesome-icon :icon="faHome" class="icon"> </font-awesome-icon>
        </el-icon>
      </template>
    </el-menu-item>
    <el-menu-item index="/notepad/add">
      <el-icon>
        <DocumentAdd />
      </el-icon>
      <template #title>写笔记</template>
    </el-menu-item>
    <el-menu-item index="/credential/add">
      <el-icon>
        <Stamp />
      </el-icon>
      <template #title>新凭据</template>
    </el-menu-item>
    <el-menu-item index="/todo">
      <el-icon>
        <font-awesome-icon :icon="faCheck" class="icon"> </font-awesome-icon>
      </el-icon>
      <template #title>ToDo</template>
    </el-menu-item>
    <el-menu-item index="/about/PathVariable?QueryString=Param">
      <el-icon>
        <font-awesome-icon :icon="faInfoCircle" class="icon"> </font-awesome-icon>
      </el-icon>
      <template #title>关于</template>
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item class="wzblog-btn-menu">
      <div @click.stop="" class="wzblog-btn-panel">
        <time-now :is-two-lines="true" :is-show-seconds="false" />
      </div>
    </el-menu-item>
    <el-menu-item class="wzblog-btn-menu">
      <div @click.stop="" class="wzblog-btn-panel">
        <div class="wzblog-btn-body" @click.stop="useWebConfigStore().toggleAside()"
          :class="useWebConfigStore().isHideAside ? 'wzblog-switch-off' : 'wzblog-switch-on'">
          <el-icon v-if="useWebConfigStore().isHideAside">
            <font-awesome-icon :icon="faEyeSlash" class="icon"> </font-awesome-icon>
          </el-icon>
          <span>侧边</span>
          <el-icon v-if="!useWebConfigStore().isHideAside">
            <font-awesome-icon :icon="faEye" class="icon"> </font-awesome-icon>
          </el-icon>
        </div>
      </div>
    </el-menu-item>
    <el-menu-item class="wzblog-btn-menu">
      <div @click.stop="" class="wzblog-btn-panel">
        <div class="wzblog-btn-body" @click.stop="useWebConfigStore().toggleOfflineMode()"
          :class="useWebConfigStore().isOfflineMode ? 'wzblog-switch-off' : 'wzblog-switch-on'">
          <el-icon v-if="useWebConfigStore().isOfflineMode">
            <font-awesome-icon :icon="faUnlink" class="icon"></font-awesome-icon>
          </el-icon>
          <span v-text="useWebConfigStore().isOfflineMode ? '离线' : '在线'"></span>
          <el-icon v-if="!useWebConfigStore().isOfflineMode">
            <font-awesome-icon :icon="faLink" class="icon"></font-awesome-icon>
          </el-icon>
        </div>
      </div>
    </el-menu-item>
    <el-menu-item class="wzblog-btn-menu">
      <div @click.stop="" class="wzblog-btn-panel">
        <div class="wzblog-btn-body" @click.stop="toggleDark()">
          <i inline-flex i="dark:ep-moon ep-sunny" style="width: 24px; height:18px;" />
        </div>
      </div>
    </el-menu-item>
    <el-menu-item index="/settings" style="padding: 0; width: 60px;">
      <el-icon>
        <setting />
      </el-icon>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.wzblog-header {
  height: 60px;
}

.dark-btn-wzblog {
  height: 100%;
  padding: 0;
}

.dark-btn-wzblog i {
  width: 18px;
  height: 18px;
}

.max-z-index {
  z-index: 999;
}

:deep(.aside-switch-btn .is-text) {
  color: white;
}

.wzblog-btn-menu {
  margin: 0;
  border: 0;
  padding: 0;
  cursor: auto;
}

.wzblog-btn-panel {
  padding: 0 10px;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.wzblog-btn-body {
  padding: 3px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.wzblog-btn-body span {
  line-height: 20px;
}

.wzblog-btn-body i {
  margin: 0;
}

.wzblog-switch-on {
  background-color: darkgreen;
  color: white;
}

.wzblog-switch-off {
  background-color: darkslategrey;
  color: white;
}
</style>