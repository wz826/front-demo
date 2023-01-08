<script setup lang="ts">
import { useWebConfigStore } from '~/store/webConfig'
import Rect from './Rect.vue';
import Reward from './Reward.vue';
import Tank from './Tank.vue';
import tank90Icon from '~/assets/game/tank90/tank90_icon.png';
import tank90Bg from '~/assets/game/tank90/tank90_bg.png';
import './map/map'
import './map/map1-10'
import { Tank90Map as _ } from './map/map'
import { Standard, Config, getMap, convertMapToRects } from './map'
import { RewardType, RewardTypeEnmu, REWARD } from './defineReward'
import { KeyFirstPlayer, KeySecondPlayer } from './defineKey'
import { DirectionEnum, PlayerTank, createPlayerTank } from './tank/defineTank'
import { onBeforeUnmount, onMounted, reactive, ToRefs, toRefs, } from 'vue';
useWebConfigStore().isWebFullScreen = true;
// const RectTypeEnmu = Tank90Map.RectTypeEnmu;
// 战场面积均为13 X 13 * 4
const BaseTitle = import.meta.env.VITE_APP_NAME || "WzBlog";

const config: Config = reactive({
  zoomTime: 1.5,
  isGameOver: false,
});

const gameWidth = `${config.zoomTime * Standard.MAP_WIDTH}px`;
const gameHeight = `${config.zoomTime * Standard.MAP_HEIGHT}px`;
const zIndexRect: number = Standard.Z_INDEX;
const zIndexReward: number = REWARD.Z_INDEX;

const map: _.PointMap = getMap(2);
const refMap: ToRefs<_.PointMap> = toRefs(map);
const rects: _.RectType[] = convertMapToRects(map, config.zoomTime, config.isGameOver);

const rewardShip: RewardType = {
  zoomTime: config.zoomTime,
  type: RewardTypeEnmu.ship,
  top: 13,
  left: 13,
  disappearTime: 0
};

// TODO ts(2739)这个错误目前不影响运行和编译，暂时忽略
const p1Tank: PlayerTank = reactive(createPlayerTank(refMap, true));
const p2Tank: PlayerTank = reactive(createPlayerTank(refMap, false));

/** 加载完成时钩子 */
onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
  document.title = `90坦克 ${BaseTitle}`;
});

/** 卸载前钩子 */
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown);
});

/** 当键盘松开时 */
const onKeyDown = (e: KeyboardEvent) => {
  // console.log(e.code);
  // console.log(KeyFirstPlayer);
  // console.log('onKeyUp: key = ' + e?.key);
  // const keyUpper = e.key.toUpperCase();
  // console.log(KeyFirstPlayer.up === keyUpper);
  switch (e.code) {
    case KeyFirstPlayer.up: moveUp(p1Tank); break;
    case KeyFirstPlayer.left: moveLeft(p1Tank); break;
    case KeyFirstPlayer.down: moveDown(p1Tank); break;
    case KeyFirstPlayer.right: moveRight(p1Tank); break;
    case KeyFirstPlayer.fire: fire(p1Tank); break;
    case KeyFirstPlayer.pause: togglePause(); break;
    case KeySecondPlayer.up: moveUp(p2Tank); break;
    case KeySecondPlayer.left: moveLeft(p2Tank); break;
    case KeySecondPlayer.down: moveDown(p2Tank); break;
    case KeySecondPlayer.right: moveRight(p2Tank); break;
    case KeySecondPlayer.fire: fire(p2Tank); break;
    case KeySecondPlayer.pause: togglePause(); break;
    default: break;
  }
  // console.log(tank);
  // 防止方向键和空格键移动页面
  e.preventDefault();
};


const moveUp =
  (tank: PlayerTank) => {
    // rewardShip.zoomTime = 2;
    // console.log('moveUp');
    tank.move(DirectionEnum.up);
  }
const moveLeft =
  (tank: PlayerTank) => {
    // console.log('moveLeft');
    tank.move(DirectionEnum.left);
  }
const moveDown =
  (tank: PlayerTank) => {
    // console.log('moveDown');
    tank.move(DirectionEnum.down);
  }
const moveRight =
  (tank: PlayerTank) => {
    // console.log('moveRight');
    tank.move(DirectionEnum.right);
  }
const fire =
  (tank: PlayerTank) => {
    // console.log('fire');
    tank.shoot();
  }
const togglePause =
  () => {
    // console.log('pause');
  }


</script>

<template>
  <div class="wzblog-game-90tank-container">
    <div class="game-panel">
      <div class="game-body">
        <template v-for="rect in rects">
          <Rect :rect="rect" />
        </template>
        <div class="game-body-mask-reward">
          <Reward :reward="rewardShip" />
        </div>
        <div class="game-body-mask-tank">
          <Tank :config="config" :tank="p1Tank" />
          <Tank :config="config" :tank="p2Tank" />
        </div>
      </div> <!-- end div game-body -->
    </div> <!-- end div game-panel -->
    <div class="game-footer">抵制不良游戏 拒绝盗版游戏 注意自我保护 谨防受骗上当 适度游戏益脑 沉迷游戏伤身 合理安排时间 享受健康生活</div>
  </div>
  <el-image :src="tank90Bg" title="90坦克" />
  <el-image :src="tank90Icon" title="90坦克" />
</template>

<style scoped>
@media (min-width: 1024px) {
  .wzblog-game-90tank-container {
    width: 100vw;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .game-panel {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .game-body {
    position: relative;
    z-index: v-bind(zIndexRect);
    width: v-bind(gameWidth);
    height: v-bind(gameHeight);
    border: solid 1px var(--ep-menu-border-color);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: center;
  }

  .game-body-mask-reward {
    position: absolute;
    z-index: v-bind(zIndexReward);
    width: v-bind(gameWidth);
    height: v-bind(gameHeight);
    top: 0;
    left: 0;
  }

  .game-body-mask-tank {
    position: absolute;
    z-index: v-bind(zIndexReward);
    width: v-bind(gameWidth);
    height: v-bind(gameHeight);
    top: 0;
    left: 0;
  }

  .game-footer {
    width: 100%;
    height: 50px;
    color: grey;
    display: flex;
    align-self: flex-end;
    justify-content: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: center;
    align-items: flex-end;
  }

}
</style>