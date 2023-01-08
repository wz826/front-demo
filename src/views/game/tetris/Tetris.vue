<script setup lang="ts">
import { useFullscreen, useTimeoutFn } from '@vueuse/core'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { Picture, SwitchButton, User, FullScreen } from '@element-plus/icons-vue';
import {
  PointClassType, PointClassEnmu, RectType, KeyDefine, tickTime,
  TetrisStatistics, calcScoreAndLevelAndTime, resetTetrisStatistics
} from './TetrisDefine';
import { useMusic, MusicType } from './TetrisMusic';
import { useTetrisUtil, TetrisUtilType } from './TetrisUtil';
import db, { Top10 } from "~/store/indexdb/game/db";
import { useWebConfigStore } from '~/store/webConfig'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale(useWebConfigStore().webConfig.lang.toLowerCase())
useWebConfigStore().isWebFullScreen = true;

// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
const FullScreenElement = ref<HTMLElement | null>(null)
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen(FullScreenElement);
const BaseTitle = import.meta.env.VITE_APP_NAME || "WzBlog";
const ShadowConfig = reactive({
  width: '0',
  left: '0',
  visible: true,
});
let currRect: RectType;
const NextRects: RectType[] = [];
let music: MusicType;
const TetrisMap: PointClassType[][] = reactive([]);
const RectNextMaps: PointClassType[][][] = reactive([]);
const Player = ref("");
const Top10DialogFormVisible = ref(false);
const FailDialogFormVisible = ref(false);
const TetrisUtil: TetrisUtilType = useTetrisUtil(TetrisMap, RectNextMaps, NextRects);
let bgNumIdx = 0;
const BgNumLen = 12;
const IsUseBg = ref(true);
const BgImage = ref(TetrisUtil.getBgImage(IsUseBg.value, bgNumIdx));
const IsStart = ref(false);
const IsPause = ref(false);
const IsSilent = ref(false);

/**
 * 下张背景图
 */
const nextBg = () => {
  if (!IsUseBg.value) return false;
  bgNumIdx = ++bgNumIdx % BgNumLen;
  BgImage.value = TetrisUtil.getBgImage(IsUseBg.value, bgNumIdx);
};

/**
 * 禁用或启用背景
 * 
 */
const toggleUseBg = (isUseBgNew?: boolean) => {
  // console.log(typeof isUseBgNew);
  if (typeof isUseBgNew === 'boolean') {
    IsUseBg.value = isUseBgNew as boolean;
  } else {
    IsUseBg.value = !IsUseBg.value;
  }
  BgImage.value = TetrisUtil.getBgImage(IsUseBg.value, bgNumIdx);
};

/**
 * 禁用或启用声音
 *  
 */
const toggleSilent = () => {
  // console.log(val);
  IsSilent.value = !IsSilent.value;
  music.mute(IsSilent.value);
};

watch(() => TetrisStatistics.level, nextBg);

/** 当前十模态窗口提交时 */
const onTop10SaveBtnClick = async () => {
  Top10DialogFormVisible.value = false;
  const name = Player.value || '佚名';
  const dbCurr = await db.top10.where('name').equalsIgnoreCase(name).first();
  // console.log(dbCurr);
  const score = TetrisStatistics.score;
  if (dbCurr && dbCurr.score > score) return;
  const id = dbCurr?.id;
  const now = dayjs().toDate();
  const top10: Top10 = { id, name, score, ctime: now };
  // console.log(obj);
  db.top10.put(top10);
  // 删除500名以后的数据，主要是防止数据占用空间太大
  db.top10.orderBy('score').reverse().offset(500).delete();
  TetrisUtil.setTop10(TetrisStatistics);
};

/** 打开前十或结束模态窗口 */
const openTop10Dialog = async () => {
  const top10s = TetrisStatistics.top10;
  const currScore = TetrisStatistics.score;
  const isInTop10 = currScore > 0 && (top10s.length < 10
    || top10s.findIndex(top10 => top10.score <= currScore) > -1);
  // 二选一弹出    
  FailDialogFormVisible.value = !isInTop10;
  Top10DialogFormVisible.value = isInTop10;
  isInTop10 ? music.top10Play() : music.gameOverPlay();
  // 彩蛋
  console.log(isInTop10 ? "恭喜你，榜上有名！" : "再接再厉！");
};

/** 当键盘按下时 */
const onKeyDown = (e: KeyboardEvent) => {
  // console.log('onKeyDown: key = ' + e?.key);
  const keyUpper = e.key.toUpperCase();
  switch (keyUpper) {
    case KeyDefine.left: moveLeftRect(); break;
    case KeyDefine.right: moveRightRect(); break;
    case KeyDefine.down: moveDownRect(); break;
    default: break;
  }
  // 防止方向键和空格键移动页面
  e.preventDefault();
};

/** 当键盘松开时 */
const onKeyUp = (e: KeyboardEvent) => {
  // console.log('onKeyUp: key = ' + e?.key);
  const keyUpper = e.key.toUpperCase();
  switch (keyUpper) {
    case KeyDefine.bgNext: nextBg(); break;
    case KeyDefine.bg: toggleUseBg(); break;
    case KeyDefine.full: toggleFullScreen(); break;
    case KeyDefine.silent: toggleSilent(); break;
    case KeyDefine.start: startGame(); break;
    case KeyDefine.pause: togglePause(); break;
    case KeyDefine.roundLeft: roundRectLeft(); break;
    case KeyDefine.roundRight: roundRectRight(); break;
    case KeyDefine.fall: fallRectBottom(); break;
    case KeyDefine.shadow: toggleShadowRect(); break;
    default: break;
  }
  // 防止方向键和空格键移动页面
  e.preventDefault();
};

/** 播放背景音乐 */
const initMusicAndPlayBgAtOnce = async () => {
  const audioContext = new AudioContext();
  music = await useMusic(audioContext);
  // 只用首次触发点击开始即可，然后移除事件
  window.removeEventListener("click", initMusicAndPlayBgAtOnce);
};

/** 加载完成时钩子 */
onMounted(() => {
  window.addEventListener("click", initMusicAndPlayBgAtOnce);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.title = `俄罗斯方块 ${BaseTitle}`;
  TetrisUtil.setTop10(TetrisStatistics);
});

/** 卸载前钩子 */
onBeforeUnmount(() => {
  window.removeEventListener("click", initMusicAndPlayBgAtOnce);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
});

/**
 * 一次性下落到底
 */
const fallRectBottom = () => {
  // 未启动或暂停状态不能移动方块
  if (!IsStart.value || IsPause.value) return;
  const offsetMin: number = TetrisUtil.calcFallBottomOffset();
  if (offsetMin <= 0) return;
  // console.log(`offsetMin:${offsetMin} `);
  const afterPoints = TetrisUtil.getAfterPoints(0, offsetMin);
  music.fallPlay();
  TetrisUtil.drawAndSetPointsToMap(afterPoints);
  onCannotMoveDown();
};

/**
 * 切换显示阴影
 */
const toggleShadowRect = () => {
  // 未启动或暂停状态不能切换显示阴影
  if (!IsStart.value || IsPause.value) return;
  // 显示阴影
  ShadowConfig.visible = !ShadowConfig.visible;
  // TODO 后续优化？为什么强制
  TetrisUtil.calcShadow(ShadowConfig, true);
};

/** 逆时针旋转 */
const roundRectLeft = () => roundRect(false);
/** 顺时针旋转 */
const roundRectRight = () => roundRect(true);

/** 旋转：默认顺时针 */
const roundRect = (isClockwise: boolean = true) => {
  // 未启动或暂停状态不能移动方块
  if (!IsStart.value || IsPause.value) return;
  // 方块O不需要旋转
  if (currRect.bgCls === PointClassEnmu.O) return;
  const afterPoints = TetrisUtil.roundPoints(isClockwise);
  const notSelfPoints = TetrisUtil.getNotSelfPoints(afterPoints);
  // console.log(currRect.points);
  // console.log(afterPoints);
  // console.log(notSelfPoints);  
  const overMapIdx = notSelfPoints.findIndex(p => TetrisUtil.isOverMap(p));
  // console.log(`isOverMap：${ -1 < overMapIdx } `);
  // 判断能否旋转
  if (-1 < overMapIdx) return;
  music.rotatePlay();
  TetrisUtil.drawAndSetPointsToMap(afterPoints);
  TetrisUtil.calcShadow(ShadowConfig);
};

/** 向左横移 */
const moveLeftRect = () => moveHorizontalRect(false);
/** 向右横移 */
const moveRightRect = () => moveHorizontalRect(true);

/** 横移：默认向右 */
const moveHorizontalRect = (isMoveRight: boolean = true) => {
  // 未启动或暂停状态不能移动方块
  if (!IsStart.value || IsPause.value) return;
  const offset: number = isMoveRight ? 1 : -1;
  const afterPoints = TetrisUtil.getAfterPoints(offset);
  // console.log(afterPoints);
  const notSelfPoints = TetrisUtil.getNotSelfPoints(afterPoints);
  // console.log(notSelfPoints);  
  const overMapIdx = notSelfPoints.findIndex(p => TetrisUtil.isOverMap(p));
  // console.log(`isOverMap：${ -1 < overMapIdx } `);
  if (-1 < overMapIdx) return;
  music.actionPlay();
  TetrisUtil.drawAndSetPointsToMap(afterPoints);
  TetrisUtil.calcShadow(ShadowConfig);
};


/**
 * 下落，判断游戏结束，消行，计分，新方块
 */
const moveDownRect = () => {
  if (!IsStart.value || IsPause.value) return;
  // console.log(currRect);
  const afterPoints = TetrisUtil.getAfterPoints(0, 1);
  // console.log(afterPoints);
  const x2BottomY: Record<number, number> = TetrisUtil.getX2BottomY(afterPoints);
  // console.log(maxDownPoints);
  // 判断能否下落
  const isOverMap = TetrisUtil.isX2BottomYOverMap(x2BottomY);
  // console.log(`isOverMap：${ -1 < overMapIdx } `);
  // 不能下落
  if (isOverMap) return onCannotMoveDown();
  // 能下落则继续
  // TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
  // TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
  // TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
  TetrisUtil.drawAndSetPointsToMap(afterPoints);
  // 这是为了实时发出落底声音
  const isNextOverMap = TetrisUtil.isX2BottomYOverMap(x2BottomY, 1);
  isNextOverMap && music.actionPlay();
};

/** 当不能下落时 */
const onCannotMoveDown = () => {
  // 判断结束
  if (TetrisUtil.isGameOver()) {
    IsStart.value = false;
    ShadowConfig.visible = false;
    TetrisUtil.drawGameOverMap();
    // 打开前10记录表单模态窗口或结束消息模态窗口
    openTop10Dialog();
  } else {
    // 消行和计分
    clearLinesAndScore();
    // 新方块
    currRect = TetrisUtil.generateRect(ShadowConfig);
  }
}

/** 消行、计分、升级、提速 */
const clearLinesAndScore = () => {
  const lineIdxs = TetrisUtil.getFullLineIdx();
  // console.log(tetrisMap);
  const lineIdxLen = lineIdxs.length;
  if (lineIdxLen <= 0) return;
  music.lineClearPlay();
  // console.log(lineIdxs);
  TetrisUtil.clearFullLines(lineIdxs);
  const hasUp = calcScoreAndLevelAndTime(lineIdxLen);
  hasUp && music.levelUpPlay();
  // 彩蛋
  console.log(['不错哦。', '很棒。', '太棒了！', '完美！'][lineIdxLen - 1]);
};


/** 游戏指令：启动指令和挂起指令 */
const { start: gameCmdResume, stop: gameCmdSuspend } = useTimeoutFn(
  () => {
    if (IsPause.value || !IsStart.value) return gameCmdSuspend();
    moveDownRect();
    gameCmdResume();
  }, tickTime);

/**
 * 启动
 */
const startGame = () => {
  if (IsStart.value) return;
  music?.bgPlay();
  IsStart.value = true;
  IsPause.value = false;
  ShadowConfig.visible = true;
  Top10DialogFormVisible.value = false;
  FailDialogFormVisible.value = false;
  resetTetrisStatistics();
  // 清空地图
  TetrisUtil.clearMap(TetrisMap);
  currRect = TetrisUtil.generateRect(ShadowConfig);
  gameCmdResume();
};

/**
 * 暂停、继续
 */
const togglePause = () => {
  if (!IsStart.value) return;
  IsPause.value = !IsPause.value;
  music.pause(IsPause.value);
  IsPause.value ? gameCmdSuspend() : gameCmdResume();
};

/** 启动总线 */
const startBus = () => {
  IsStart.value ? togglePause() : startGame();
};

</script>

<template>
  <div class="tetris-background" ref="FullScreenElement">
    <div class="tetris-container" :style="{ backgroundColor: IsUseBg ? '#042c0380' : 'initial' }">
      <div class="tetris-panel">
        <div class="rect-next-map-panel">
          <div class="tetris-operate-panel">
            <div class="tetris-operate-btn-panel">
              <el-button :type="IsStart ? (IsPause ? 'warning' : 'success') : 'primary'" :icon="SwitchButton"
                @click="startBus" class="operBtnWidth" color="#003973">
                <template #default>
                  <span class="btn-start-bus" v-text="IsStart ? (IsPause ? '继续' : '暂停') : '开始'" />
                </template>
              </el-button>
            </div>
            <div class="tetris-operate-btn-panel">
              <el-button type="primary" :icon="FullScreen" :round="isFullscreen" @click="toggleFullScreen"
                class="operBtnWidth" color="#003973">
                <template #default>
                  <span v-text="isFullscreen ? '退出全屏' : '进入全屏'" />
                </template>
              </el-button>
            </div>
            <div class="tetris-operate-btn-panel">
              <el-button type="primary" :icon="Picture" :disabled="!IsUseBg" @click="nextBg" class="operBtnWidth"
                color="#003973">
                <template #default>
                  <span v-text="`下个背景`" />
                </template>
              </el-button>
            </div>
            <div class="tetris-operate-btn-panel">
              <el-switch v-model="IsUseBg" @change="toggleUseBg" inline-prompt active-text="使用背景" inactive-text="禁用背景"
                class="operBtnWidth" active-color="#003973" />
            </div>
          </div>
          <div class="rect-next-map-body" v-for="rectNextMap in RectNextMaps"
            :style="{ backgroundColor: IsUseBg ? '#042c0380' : 'initial' }">
            <template v-for="(rectNextRow, rowIdx) in rectNextMap">
              <div v-for="(rectNextPoint, colIdx) in rectNextRow" :key="`point${rowIdx}-${colIdx}`"
                :class="`tetris-point ${rectNextPoint.bgCls}`"></div>
            </template>
          </div>
        </div>
        <div class="tetris-body" :style="{ backgroundColor: IsUseBg ? '#042c0380' : 'initial' }">
          <div v-for="(tetrisRow, rowIdx) in TetrisMap" class="tetris-body-row">
            <div v-for="(tetrisPoit, colIdx) in tetrisRow" :key="`point${rowIdx}-${colIdx}`"
              :class="`tetris-point ${tetrisPoit.bgCls}`"></div>
          </div>
          <div v-if="ShadowConfig.visible" class="tetris-body-mask"></div>
        </div>
      </div> <!-- end div tetris-panel-->
      <div class="tetris-info">
        <div class="game-score-panel">
          <el-tag class="game-score-key" type="info">得分</el-tag>
          <span class="game-score-info" v-text="TetrisStatistics.score" />
        </div>
        <div class="tetris-info-body">
          <div class="tetris-statistics-panel">
            <div class="game-statistics">
              <el-tag class="game-statistics-key" type="success">等级</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.level" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key" type="danger">消行总数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.totalLines" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key" type="info">单行数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.oneLines" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key" type="info">两行数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.twoLines" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key" type="info">三行数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.threeLines" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key" type="info">四行数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.fourLines" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key" type="warning">方块总数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.totalRectCount" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key">方块I数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.ICount" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key">方块T数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.TCount" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key">方块L数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.LCount" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key">方块S数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.SCount" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key">方块O数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.OCount" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key">方块J数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.JCount" />
            </div>
            <div class="game-statistics">
              <el-tag class="game-statistics-key">方块Z数</el-tag>
              <span class="game-statistics-info" v-text="TetrisStatistics.ZCount" />
            </div>
          </div> <!-- end div tetris-statistics -->
          <div class="tetris-help-panel">
            <div class="key-define">
              <el-button @click="startGame" :disabled="IsStart" type="info" class="key-define-key" round color="#003973"
                v-text="KeyDefine.start" />
              <span class="key-define-info" v-text="IsStart ? '游戏中' : '开始游戏'" />
            </div>
            <div class="key-define">
              <el-button @click="togglePause" :disabled="!IsStart" type="info" class="key-define-key" round
                color="#003973" v-text="KeyDefine.pause" />
              <span class="key-define-info" v-text="IsPause ? '继续' : '暂停'" />
            </div>
            <div class="key-define">
              <el-button @click="moveLeftRect" :disabled="!IsStart || IsPause" type="info" class="key-define-key" round
                color="#003973" v-text="KeyDefine.left" />
              <span class="key-define-info">向左移动</span>
            </div>
            <div class="key-define">
              <el-button @click="moveRightRect" :disabled="!IsStart || IsPause" type="info" class="key-define-key" round
                color="#003973" v-text="KeyDefine.right" />
              <span class="key-define-info">向右移动</span>
            </div>
            <div class="key-define">
              <el-button @click="moveDownRect" :disabled="!IsStart || IsPause" type="info" class="key-define-key" round
                color="#003973" v-text="KeyDefine.down" />
              <span class="key-define-info">手动下落</span>
            </div>
            <div class="key-define">
              <el-button @click="fallRectBottom" :disabled="!IsStart || IsPause" type="info" class="key-define-key"
                round color="#003973" v-text="KeyDefine.fall" />
              <span class="key-define-info">直接落底</span>
            </div>
            <div class="key-define">
              <el-button @click="roundRectLeft" :disabled="!IsStart || IsPause" type="info" class="key-define-key" round
                color="#003973" v-text="KeyDefine.roundLeft" />
              <span class="key-define-info">逆时针旋转</span>
            </div>
            <div class="key-define">
              <el-button @click="roundRectRight" :disabled="!IsStart || IsPause" type="info" class="key-define-key"
                round color="#003973" v-text="KeyDefine.roundRight" />
              <span class="key-define-info">顺时针旋转</span>
            </div>
            <div class="key-define">
              <el-button @click="toggleShadowRect" :disabled="!IsStart || IsPause" type="info" class="key-define-key"
                round color="#003973" v-text="KeyDefine.shadow" />
              <span class="key-define-info" v-text="ShadowConfig.visible ? '关闭阴影' : '显示阴影'" />
            </div>
            <div class="key-define">
              <el-button @click="toggleFullScreen" type="info" class="key-define-key" round color="#003973"
                v-text="KeyDefine.full" />
              <span class="key-define-info" v-text="isFullscreen ? '退出全屏' : '进入全屏'" />
            </div>
            <div class="key-define">
              <el-button @click="toggleUseBg" type="info" class="key-define-key" round color="#003973"
                v-text="KeyDefine.bg" />
              <span class="key-define-info" v-text="IsUseBg ? '禁用背景' : '使用背景'" />
            </div>
            <div class="key-define">
              <el-button @click="nextBg" :disabled="!IsUseBg" type="info" class="key-define-key" round color="#003973"
                v-text="KeyDefine.bgNext" />
              <span class="key-define-info">下个背景</span>
            </div>
            <div class="key-define">
              <el-button @click="toggleSilent" type="info" class="key-define-key" round color="#003973"
                v-text="KeyDefine.silent" />
              <span class="key-define-info" v-text="IsSilent ? '取消静音' : '静音'" />
            </div>
          </div> <!-- end div tetris-help -->
        </div> <!-- end div tetris-info-body -->
      </div> <!-- end div tetris-info -->
      <div class="game-statistics-top10">
        <span class="game-statistics-top10-head">前十名</span>
        <el-table class="game-statistics-top10-body" :data="TetrisStatistics.top10" row-class-name="top10-table-row"
          header-row-class-name="top10-table-row">
          <el-table-column show-overflow-tooltip width="130" label="姓名" prop="name" />
          <el-table-column show-overflow-tooltip width="70" label="得分" prop="score" />
          <el-table-column show-overflow-tooltip width="90" label="时间" prop="ctime" />
        </el-table>
      </div>
    </div> <!-- end div tetris-panel -->
    <div class="game-footer">抵制不良游戏 拒绝盗版游戏 注意自我保护 谨防受骗上当 适度游戏益脑 沉迷游戏伤身 合理安排时间 享受健康生活</div>
    <el-dialog v-model="Top10DialogFormVisible" title="榜上有名" :width="400" style="background-color: #100a01e8;" draggable
      :close-on-click-modal="false" @submit.native.prevent>
      <el-form>
        <el-form-item label="玩家得分" :label-width="90">
          <span class="game-score-info" v-text="TetrisStatistics.score" />
        </el-form-item>
        <el-form-item label="玩家姓名" :label-width="90">
          <el-input v-model="Player" :prefix-icon="User" @keydown.stop="" @keypress.stop="" @keyup.stop=""
            :maxlength="18" clearable placeholder="请留下你的姓名(最多18个字符)" style="width: 250px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Top10DialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onTop10SaveBtnClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="FailDialogFormVisible" title="游戏结束" :width="300" style="background-color: #100a01e8;" draggable>
      <el-form>
        <el-form-item label="玩家得分" :label-width="90">
          <span class="game-score-info" v-text="TetrisStatistics.score" />
        </el-form-item>
        <span style="font-size: 16px;">再接再厉！</span>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="FailDialogFormVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
@media (min-width: 900px) {

  .tetris-background {
    padding: 10px 0;
    width: 100vw;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    background: v-bind(BgImage);
    background-color: var(--ep-bg-color);
  }

  .tetris-container {
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
  }

  .tetris-panel {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
  }

  .rect-next-map-panel {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .rect-next-map-body {
    margin-top: 10px;
    padding: 6px;
    width: 96px;
    border: solid 2px var(--ep-menu-border-color);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: center;
  }

  .tetris-body {
    margin-left: 5px;
    z-index: 13;
    position: relative;
    padding: 6px;
    width: 320px;
    border: solid 1px #0000;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: center;
    background:
      url("~/assets/game/tetris/Window.png") no-repeat top -58px left -100px/300% 64px,
      url("~/assets/game/tetris/Window.png") no-repeat top -100px right -58px/64px 150%,
      url("~/assets/game/tetris/Window.png") no-repeat bottom -58px right -100px/300% 64px,
      url("~/assets/game/tetris/Window.png") no-repeat top -100px left -58px/64px 150%;
  }

  .tetris-body-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: center;
  }

  .tetris-body-mask {
    z-index: 50;
    position: absolute;
    /* 动态计算宽度 */
    width: v-bind('ShadowConfig.width');
    height: calc(100% - 12px);
    top: 6px;
    left: v-bind('ShadowConfig.left');
    background: url(~/assets/game/tetris/shadow23blue.png);
  }

  .tetris-operate-panel {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .tetris-operate-btn-panel {
    margin-top: 10px;
  }

  .tetris-operate-btn-panel:first-child {
    margin-top: 0;
  }

  :deep(.tetris-operate-btn-panel .ep-switch__core) {
    width: 100px;
    height: 25px;
  }

  .operBtnWidth {
    padding: 0;
    width: 100px;
  }

  .btn-start-bus {
    padding: 0 10px;
    width: 36px;
    display: inline-block;
    text-align-last: justify;
  }

  .tetris-info {
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .game-score-panel {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .game-score-key {
    width: 60px;
    height: 32px;
    font-size: 20px;
    padding: 0;
    background-color: #042c03b8;
  }

  .game-score-info {
    margin-left: 5px;
    padding: 0 5px;
    font-size: 25px;
    max-width: 210px;
    background-color: #042c03b8;
  }

  .tetris-info-body {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
  }

  .tetris-help-panel {
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .key-define {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .key-define:first-child {
    margin-top: 0;
  }

  .key-define-key {
    padding: 0;
    width: 35px;
    height: 27px;
    font-size: 20px;
  }

  .key-define-info {
    margin-left: 5px;
    padding: 0 5px;
    height: 23px;
    width: 5rem;
    display: inline-block;
    text-align-last: justify;
    background-color: #042c03b8;
  }

  .tetris-statistics-panel {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .game-statistics {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .game-statistics:first-child {
    margin-top: 0;
  }

  .game-statistics-key {
    padding: 0 5px;
    height: 27px;
    font-size: 15px;
    background-color: #042c03b8;
  }

  :deep(.game-statistics-key .ep-tag__content) {
    width: 4rem;
    display: inline-block;
    text-align-last: justify;
  }

  .game-statistics-info {
    margin-left: 10px;
    padding: 0 3px;
    min-width: 60px;
    max-width: 90px;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
    border: solid 1px var(--ep-menu-border-color);
    background-color: #042c03b8;
  }

  .game-statistics-top10 {
    margin: 10px 0 0 10px;
    background: none;
    background-color: initial;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
  }

  :deep(.top10-table-row) {
    background: none;
    background-color: initial;
  }

  :deep(.top10-table-row .ep-table__cell) {
    background-color: #042c0380;
  }

  .game-statistics-top10-head {
    padding: 5px 10px;
    font-size: 18px;
    background-color: #042c03b8;
  }

  .game-statistics-top10-body {
    margin-top: 10px;
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

  .tetris-point {
    z-index: 80;
    height: 32px;
    width: 32px;
  }

  .tetris-point-I {
    background-position: -32px 0;
    background-image: url("~/assets/game/tetris/rect.png");
  }

  .tetris-point-T {
    background-position: -64px 0;
    background-image: url("~/assets/game/tetris/rect.png");
  }

  .tetris-point-L {
    background-position: -96px 0;
    background-image: url("~/assets/game/tetris/rect.png");
  }

  .tetris-point-S {
    background-position: -128px 0;
    background-image: url("~/assets/game/tetris/rect.png");
  }

  .tetris-point-O {
    background-position: -160px 0;
    background-image: url("~/assets/game/tetris/rect.png");
  }

  .tetris-point-J {
    background-position: -192px 0;
    background-image: url("~/assets/game/tetris/rect.png");
  }

  .tetris-point-Z {
    background-position: -224px 0;
    background-image: url("~/assets/game/tetris/rect.png");
  }

  .tetris-point-fail {
    background-position: -256px 0;
    background-image: url("~/assets/game/tetris/rect.png");
  }
}
</style>