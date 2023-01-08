<script setup lang="ts">
import { faVcard } from "@fortawesome/free-regular-svg-icons";
import { faGamepad, faOutdent, faIndent } from "@fortawesome/free-solid-svg-icons";
import { Ref, ref, watchEffect } from 'vue';
import { Notebook, Stamp, } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter();
const activeIndex: Ref<string> = ref<string>('');

const isCollapse = ref(true);
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const menu = ["/resume", "/geDianZiXing", "/credential", "/notepad", "/game"];

watchEffect(() => {
  const curr = currentRoute.value.path;
  activeIndex.value = menu.find(it => curr.startsWith(it)) || '';
  // console.log(activeIndex.value);
});
</script>

<template>
  <el-menu :collapse="isCollapse" router :collapse-transition="false" :default-active="activeIndex"
    class="wzblog-aside el-menu-vertical-demo">
    <el-menu-item class="toggle-collapse-wzblog">
      <div @click.stop="toggleCollapse" class="toggle-collapse-wzblog-div">
        <el-icon>
          <font-awesome-icon :icon="isCollapse ? faIndent : faOutdent" class="icon"></font-awesome-icon>
        </el-icon>
        <span v-if="!isCollapse">收起</span>
      </div>
      <template v-if="isCollapse" #title>展开</template>
    </el-menu-item>
    <el-menu-item index="/resume">
      <el-icon>
        <font-awesome-icon :icon="faVcard" class="icon"></font-awesome-icon>
      </el-icon>
      <template #title>简历</template>
    </el-menu-item>
    <el-menu-item index="/credential">
      <el-icon>
        <Stamp />
      </el-icon>
      <template #title>凭据管理</template>
    </el-menu-item>
    <el-menu-item index="/notepad">
      <el-icon>
        <Notebook />
      </el-icon>
      <template #title>笔记本</template>
    </el-menu-item>
    <el-menu-item index="/game">
      <el-icon>
        <font-awesome-icon :icon="faGamepad" class="icon"></font-awesome-icon>
      </el-icon>
      <template #title>游戏</template>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.wzblog-aside {
  min-height: 500px;
  height: calc(100%);
}

.el-menu-vertical-demo:is(.el-menu--collapse) {
  width: 120px;
}

.toggle-collapse-wzblog {
  padding: 0 !important;
}

:deep(.toggle-collapse-wzblog .ep-menu-tooltip__trigger) {
  padding: 0;
}

.toggle-collapse-wzblog-div {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: start;
}
</style>

