import { reactive, ref } from "vue";

// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能

/** 位置类型枚举 */
enum PointClassEnmu {
  bg = "bg",
  fail = "tetris-point-fail",
  I = "tetris-point-I",
  T = "tetris-point-T",
  L = "tetris-point-L",
  S = "tetris-point-S",
  O = "tetris-point-O",
  J = "tetris-point-J",
  Z = "tetris-point-Z",
}
/** 位置类型 */
interface PointClassType {
  bgCls: PointClassEnmu;
}
/** 位置 */
interface PointType {
  x: number;
  y: number;
}
/** 方块类型 */
interface RectType {
  bgCls: PointClassEnmu;
  points: PointType[];
  /** 初始点位 */
  initPos: PointType;
  /** 旋转参考点位 */
  roundPosIdx: number;
  left?: number;
  top?: number;
}
/**
    I形方块（长条形）
    <pre>
    1
    1
    1
    1
    </pre>
  */
const RectI: RectType = Object
  .freeze({
    bgCls: PointClassEnmu.I,
    points: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ],
    initPos: { x: 4, y: -4 },
    roundPosIdx: 2,
    left: 1,
  });
/**
    T形方块
    <pre>
    1 1 1
      1
    </pre>
  */
const RectT: RectType = Object
  .freeze({
    bgCls: PointClassEnmu.T,
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ],
    initPos: { x: 3, y: -2 },
    roundPosIdx: 1,
    top: 1,
  });
/**
    L形方块
    <pre>
    1
    1
    1 1
    </pre>
  */
const RectL: RectType = Object
  .freeze({
    bgCls: PointClassEnmu.L,
    points: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    initPos: { x: 4, y: -3 },
    roundPosIdx: 1,
    left: 1,
    top: 1,
  });
/**
    S形方块
    <pre>
      1 1
    1 1
    </pre>
  */
const RectS: RectType = Object
  .freeze({
    bgCls: PointClassEnmu.S,
    points: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    initPos: { x: 3, y: -2 },
    roundPosIdx: 0,
    top: 1,
  });
/**
    O形方块
    <pre>
    1 1
    1 1
    </pre>
  */
const RectO: RectType = Object
  .freeze({
    bgCls: PointClassEnmu.O,
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    initPos: { x: 4, y: -2 },
    roundPosIdx: 3,
    top: 1,
    left: 1,
  });
/**
    J形方块
    <pre>
      1
      1
    1 1    
    </pre>
  */
const RectJ: RectType = Object
  .freeze({
    bgCls: PointClassEnmu.J,
    points: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ],
    initPos: { x: 3, y: -3 },
    roundPosIdx: 1,
    top: 1,
    left: 1,
  });
/**
    Z形方块
    <pre>
    1 1
      1 1
    </pre>
  */
const RectZ: RectType = Object
  .freeze({
    bgCls: PointClassEnmu.Z,
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    initPos: { x: 3, y: -2 },
    roundPosIdx: 1,
    top: 1,
  });
/** 按键定义 */
enum KeyDefine {
  /** 开始游戏 */
  start = "Y",
  /** P进入全屏 */
  full = "P",
  /** O静音 */
  silent = "O",
  /** V使用背景 */
  bg = "V",
  /** N切换背景 */
  bgNext = "N",
  /** A向左移动 */
  left = "A",
  /** D向右移动 */
  right = "D",
  /** S手动下落 */
  down = "S",
  /** I直接落底 */
  fall = "I",
  /** W暂停 */
  pause = "W",
  /** J逆时针旋转 */
  roundLeft = "J",
  /** K顺时针旋转 */
  roundRight = "K",
  /** U显示阴影 */
  shadow = "U",
}
/** 统计方块出现次数 */
const calcRectCount = (typeIdx: number) => {
  switch (typeIdx) {
    case 0: ++TetrisStatistics.ICount; break;
    case 1: ++TetrisStatistics.JCount; break;
    case 2: ++TetrisStatistics.LCount; break;
    case 3: ++TetrisStatistics.OCount; break;
    case 4: ++TetrisStatistics.SCount; break;
    case 5: ++TetrisStatistics.TCount; break;
    case 6: ++TetrisStatistics.ZCount; break;
  }
  ++TetrisStatistics.totalRectCount;
};
/** 方块类型列表 */
const Rects: RectType[] = [RectI, RectJ, RectL, RectO, RectS, RectT, RectZ];
/** 伪随机数，区间：[0, max) max默认为7 */
const randomInt = (max: number = 7): number => {
  const factor = (max * 10) / max;
  return parseInt((Math.random() * factor).toFixed()) % max;
};
/** 生成方块 */
const generateRandomRect = (): RectType => {
  // TODO 当前轮次的7种用玩后才可以用新的一轮
  const typeIdx = randomInt();
  calcRectCount(typeIdx);
  const rect = { ...Rects[typeIdx] };
  const points = rect.points.map((point) => ({ ...point }));
  const initPos = { ...rect.initPos };
  rect.points = points;
  rect.initPos = initPos;
  return rect;
};
/** 根据等级计算分数 */
const calc = (level: number): number => {
  return 100 * ((level - 1) * level + 1);
};
/** 一次消行奖励的分数 */
const LineScore = [10, 30, 60, 100];
/** 等级需要的积分 */
const LevelScore = [0, 100, 300, 700, 1300, 2100, 3100, 4300, 5700, 7300, 9100,
  11100, 13300, 15700, 18300, 21100, 24100, 27300, 30700, 34300, 38100, 42100, 46300,];
/** 等级降落的速度 */
const LevelTime = [300, 200, 160, 130, 120, 110, 105, 100, 95, 90, 85, 80];
/** 统计数据：计分、评级、落速 */
const calcScoreAndLevelAndTime = (lineSize: number) => {
  // 计分
  TetrisStatistics.score += LineScore[lineSize - 1];
  // 统计单次连续消行数
  switch (lineSize) {
    case 1: ++TetrisStatistics.oneLines; break;
    case 2: ++TetrisStatistics.twoLines; break;
    case 3: ++TetrisStatistics.threeLines; break;
    case 4: ++TetrisStatistics.fourLines; break;
  }
  TetrisStatistics.totalLines += lineSize;
  const score = TetrisStatistics.score;
  // 评级
  let level = LevelScore.findIndex((ls) => score < ls) - 1;
  let beforLevel = TetrisStatistics.level;
  if (level < 0) {
    // 当级别太高时，就不再变化了
    level = TetrisStatistics.level;
    beforLevel = --beforLevel;
  }
  TetrisStatistics.level = level;
  // 落速（当级别太高时，速度就不变化了）
  tickTime.value = LevelTime[level] || LevelTime.slice(-1)[0];
  return beforLevel !== level;
};
/** 重置统计数据 */
const resetTetrisStatistics = () => {
  TetrisStatistics.ICount = 0;
  TetrisStatistics.JCount = 0;
  TetrisStatistics.TCount = 0;
  TetrisStatistics.LCount = 0;
  TetrisStatistics.OCount = 0;
  TetrisStatistics.SCount = 0;
  TetrisStatistics.ZCount = 0;
  TetrisStatistics.totalRectCount = 0;
  TetrisStatistics.oneLines = 0;
  TetrisStatistics.twoLines = 0;
  TetrisStatistics.threeLines = 0;
  TetrisStatistics.fourLines = 0;
  TetrisStatistics.totalLines = 0;
  TetrisStatistics.score = 0;
  TetrisStatistics.level = 0;
  tickTime.value = LevelTime[0];
};
/** 游戏下落间隔时间 */
const tickTime = ref(LevelTime[0]);
/** 游戏数据 */
const TetrisStatistics = reactive({
  level: 0,
  oneLines: 0,
  twoLines: 0,
  threeLines: 0,
  fourLines: 0,
  totalLines: 0,
  score: 0,
  ICount: 0,
  JCount: 0,
  LCount: 0,
  OCount: 0,
  SCount: 0,
  ZCount: 0,
  TCount: 0,
  totalRectCount: 0,
  top10: [{ name: "于敏", score: 5960, ctime: "2022-11-07" }],
});

export {
  PointClassEnmu, KeyDefine,
  TetrisStatistics, tickTime,
  generateRandomRect, calcScoreAndLevelAndTime, resetTetrisStatistics
};
export type { PointClassType, PointType, RectType };
