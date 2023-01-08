<script setup lang="ts">
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import contraLogo from '~/assets/game/contra/contra.png';
</script>

<template>
  <div class="wzblog-game-index-container">
    <breadcrumb />
    <el-card class="games-container">
      <template #header>
        <font-awesome-icon :icon="faGamepad" class="icon"></font-awesome-icon>
        <span style="margin-left: 10px;">游戏列表</span>
      </template>
      <div class="games-container-body">
        <el-card class="game-card-panel">
          <div class="game-logo-panel">
            <el-image class="game-logo-image" :src="contraLogo" title="魂斗罗" fit="scale-down" />
          </div>
          <div class="game-link-panel">
            <el-button text class="game-link-button">魂斗罗</el-button>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .wzblog-game-index-container {
    width: calc(100% - 6px);
    padding: 3px;
  }

  .games-container {
    margin-top: 10px;
    margin-left: 10px;
    width: calc(100% - 30px);
  }

  .games-container-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .game-card-panel {
    margin-left: 20px;
    width: 100px;
  }

  .game-card-panel:first {
    margin-left: 0;
  }

  :deep(.game-card-panel .ep-card__body) {
    padding: 0;
  }

  .game-logo-panel {
    width: 100px;
    height: 80px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .game-logo-image {
    width: 80px;
    height: 80px;
  }

  .game-link-panel {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .game-link-button {
    padding: 0;
    min-height: auto;
  }
}
</style>