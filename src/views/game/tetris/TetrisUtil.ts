import db from "~/store/indexdb/game/db";
import { PointClassType, PointClassEnmu, RectType, PointType, generateRandomRect, } from "./TetrisDefine";
import { useWebConfigStore } from '~/store/webConfig'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale(useWebConfigStore().webConfig.lang.toLowerCase())
const baseUrl = import.meta.env.VITE_BASE_URL;

// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
// TODO 后续优化，落底前不写入地图，可以方便很多判断，且优化性能
declare interface TetrisUtilType {
  readonly TetrisWidth: number;
  readonly TetrisHeight: number; // 标准是10*20
  setTop10(tetrisStatistics: any): Promise<any>;
  clearMap(map: PointClassType[][]): void;
  isOverMap(point: PointType): boolean;
  isX2BottomYOverMap(x2BottomY: Record<number, number>, offsetY?: number): boolean;
  getAfterPoints(offsetX?: number, offsetY?: number): PointType[];
  getX2BottomY(points: PointType[]): Record<number, number>;
  getNotSelfPoints(afterPoints: PointType[]): PointType[];
  roundPoints(isClockwise: boolean): PointType[];
  getBgImage(isUseBg: boolean, bgNumIdx: number): string;
  drawAndSetPointsToMap(afterPoints: PointType[]): void;
  drawGameOverMap(): void;
  calcShadow(shadow: any, force?: boolean): void;
  /** 生成游戏方块和预览方块 */
  generateRect(shadow: any): RectType;
  /** 判断是否结束 */
  isGameOver(): boolean;
  getFullLineIdx(): number[];
  clearFullLines(fullLines: number[]): void;
  /** offset可能的情况
            ·······················
            · 0 0     0 0     0 0 ·
            · 0       0       0   ·
            · 0       0       0   ·
            ·                     ·
            ·                   # ·
            ·           #       # ·
            ·   #       #       # ·
            · # #     # #     # # ·
            ·······················
    offset    4 5     4 4     4 3
       use    3         4       3
  */
  calcFallBottomOffset(): number;
}

class TetrisUtil implements TetrisUtilType {
  readonly TetrisWidth: number = 10;
  readonly TetrisHeight: number = 20; // 标准是10*20
  readonly rectNextWidth = 3;
  readonly rectNextHeight = 4;
  readonly rectNextSize = 3;
  readonly tetrisMap: PointClassType[][];
  readonly rectNextMaps: PointClassType[][][];
  readonly nextRects: RectType[];
  currRect: RectType | null = null;
  constructor(tetrisMap: PointClassType[][], rectNextMaps: PointClassType[][][], nextRects: RectType[]) {
    this.tetrisMap = tetrisMap;
    this.rectNextMaps = rectNextMaps;
    this.nextRects = nextRects;
    // 初始化游戏地图
    this.initMap(tetrisMap, this.TetrisHeight, this.TetrisWidth);
    // 初始化预览地图
    for (let cnt = 0; cnt < this.rectNextSize; ++cnt) {
      const rectNextMapItem: PointClassType[][] = [];
      this.initMap(rectNextMapItem, this.rectNextHeight, this.rectNextWidth);
      rectNextMaps.push(rectNextMapItem);
    }
  }
  calcFallBottomOffset(): number {
    const rect = this.currRect as RectType;
    const offsets: number[] = Object.entries(this.getX2BottomY(rect.points))
      .map((xy) => {
        const colIdx = parseInt(xy[0]);
        const rowIdxOffset = xy[1];
        let offset = this.TetrisHeight - rowIdxOffset - 1;
        for (let rowIdx = rowIdxOffset + 1; rowIdx < this.TetrisHeight; ++rowIdx) {
          // console.log(tetrisMap[rowIdx][x].class);
          if (rowIdx < 0) continue;
          if (this.isRectPoint(this.tetrisMap[rowIdx][colIdx])) {
            offset = rowIdx - rowIdxOffset - 1;
            break;
          }
        }
        // console.log(`offset${offset} `);
        return offset;
      });
    const offsetMin: number = Math.min(...offsets);
    return offsetMin;
  }
  clearFullLines(fullLines: number[]): void {
    fullLines.forEach((lineIdx) => {
      // console.log(lineIdx);
      this.tetrisMap.splice(lineIdx, 1);
      this.tetrisMap.unshift(this.generateEmptyRow(this.TetrisWidth));
    });
  }
  getFullLineIdx(): number[] {
    const lineIdxs = this.tetrisMap
      .map((row, idx) =>
        // 一行中有空白(BgPoint为空白)则表示不是满行，返回-1，后续过滤
        row.findIndex((p) => this.isBgPoint(p)) > -1 ? -1 : idx
      )
      .filter((idx) => idx > -1);
    return lineIdxs;
  }
  isGameOver(): boolean {
    const rect = this.currRect as RectType;
    // 判断是否结束
    const overTopIdx = rect.points.findIndex((point) => point.y < 0);
    return -1 < overTopIdx;
  }
  generateRect(shadow: any): RectType {
    const rect = this.nextRects?.shift() || generateRandomRect();
    this.currRect = rect;
    // console.log(currRect);
    // 初始化当前方块
    rect.points.forEach((point) => {
      point.x += rect.initPos.x;
      point.y += rect.initPos.y;
    });
    // 强制计算阴影
    this.calcShadow(shadow, true);
    // 清空旧的方块预览
    this.rectNextMaps.forEach(this.clearMap);
    // 生成新的方块预览
    while (this.nextRects.length < this.rectNextSize) {
      const nextRect = generateRandomRect();
      this.nextRects.push(nextRect);
    }
    // 显示新的预览方块
    this.nextRects.forEach((nextRect, mapIdx) =>
      nextRect.points.forEach((point) => {
        const row = point.y + (nextRect?.top || 0);
        const col = point.x + (nextRect?.left || 0);
        const cls = nextRect.bgCls;
        this.rectNextMaps[mapIdx][row][col].bgCls = cls;
      }));
    return rect;
  }
  calcShadow(shadow: any, force: boolean = false): void {
    const rect = this.currRect as RectType;
    if (force || shadow.visible) {
      // 只保留相同的横坐标，用来计算阴影宽度
      const xs = new Set(rect.points.map((point) => point.x));
      // 取最小的横坐标，用来计算阴影横向偏移
      const minX = Math.min(...xs);
      shadow.left = `${6 + minX * 32}px`;
      shadow.width = `${xs.size * 32}px`;
    }
  }
  drawAndSetPointsToMap(afterPoints: PointType[]): void {
    const rect = this.currRect as RectType;
    // 从地图中清除当前方块旧的位置
    rect.points.forEach((p) => this.setTetrisMapBgclsByPos(p, PointClassEnmu.bg));
    // 把当前方块新的位置画在地图中
    afterPoints.forEach((p) => this.setTetrisMapBgclsByPos(p, rect.bgCls));
    // 赋值新的位置到当前方块
    rect.points = afterPoints;
  }
  drawGameOverMap(): void {
    // 清空预览方块
    this.nextRects.splice(0);
    // 把预览图中的方块都显示成结束方块形状
    this.rectNextMaps.forEach((item) => item.forEach((row) => this.setMapRowToFail(row)));
    // 把游戏地图中的方块都显示成结束方块形状
    this.tetrisMap.forEach((row) => this.setMapRowToFail(row));
    // 把当前方块也显示成结束方块形状
    const rect = this.currRect as RectType;
    rect.points.forEach((p) => this.setTetrisMapBgclsByPos(p, PointClassEnmu.fail));
  }
  getBgImage(isUseBg: boolean, bgNumIdx: number): string {
    if (isUseBg) {
      const bgNum = bgNumIdx + 1;
      return `url('${baseUrl}images/game/bg/bg (${bgNum}).jpg') no-repeat 0 0/100% 100%`;
    } else {
      return "none";
    }
  }
  roundPoint(referPoint: PointType, calcPoint: PointType, isClockwise: boolean): PointType {
    const ry = referPoint.y;
    const rx = referPoint.x;
    const cy = calcPoint.y;
    const cx = calcPoint.x;
    return isClockwise
      ? this.newPoint(ry + rx - cy, ry - rx + cx)
      : this.newPoint(rx - ry + cy, rx + ry - cx);
  }
  roundPoints(isClockwise: boolean): PointType[] {
    const rect = this.currRect as RectType;
    const referPoint: PointType = rect.points[rect.roundPosIdx];
    return rect.points.map((point) => this.roundPoint(referPoint, point, isClockwise));
  }
  getNotSelfPoints(afterPoints: PointType[]): PointType[] {
    return afterPoints.filter((ap) => this.isNotSelfPoint(ap));
  }
  isNotSelfPoint(point: PointType): boolean {
    const rect = this.currRect as RectType;
    const selfIdx = rect.points.findIndex((cp) => cp.y === point.y && cp.x === point.x);
    return selfIdx < 0;
  }
  getX2BottomY(points: PointType[]): Record<number, number> {
    return points.reduce(
      (map: Record<number, number>, point) => {
        const y = point.y;
        const x = point.x;
        if (!map[x] || map[x] < y) map[x] = y;
        return map;
      }, {});
  }
  getAfterPoints(offsetX: number = 0, offsetY: number = 0): PointType[] {
    const rect = this.currRect as RectType;
    return rect.points.map((p) => this.newPoint(p.x + offsetX, p.y + offsetY));
  }
  newPoint(x: number, y: number): PointType {
    return { x, y };
  }
  isX2BottomYOverMap(x2BottomY: Record<number, number>, offsetY: number = 0): boolean {
    const goonOverMapIdx = Object.entries(x2BottomY)
      .findIndex((xy) => this.isOverMap(this.newPoint(parseInt(xy[0]), xy[1] + offsetY)));
    return -1 < goonOverMapIdx;
  }
  isOverMap(point: PointType): boolean {
    let y = point.y;
    let x = point.x;
    if (y >= this.TetrisHeight || x < 0 || x >= this.TetrisWidth) return true;
    // 小于0的y只有初始化时才出现，不考虑越界
    if (y < 0) return false;
    return this.existRectPoint(point);
  }
  existRectPoint(point: PointType): boolean {
    return this.isRectPoint(this.tetrisMap[point.y][point.x]);
  }
  isBgPoint(pointClass: PointClassType): boolean {
    return !this.isRectPoint(pointClass);
  }
  isRectPoint(pointClass: PointClassType): boolean {
    return pointClass?.bgCls !== PointClassEnmu.bg;
  }
  setTetrisMapBgclsByPos(point: PointType, bgCls: PointClassEnmu): void {
    point.y > -1 && (this.tetrisMap[point.y][point.x].bgCls = bgCls);
  }
  clearMap(map: PointClassType[][]): void {
    map.forEach((row) => row.forEach((col) => (col.bgCls = PointClassEnmu.bg)));
  }
  setMapPointClassToFail(pointClass: PointClassType): void {
    // console.log(pointClass);
    pointClass.bgCls !== PointClassEnmu.bg && (pointClass.bgCls = PointClassEnmu.fail);
  }
  setMapRowToFail(mapRow: PointClassType[]): void {
    // console.log(this.setMapPointClassToFail);
    // console.log(mapRow);
    mapRow.forEach(this.setMapPointClassToFail);
  }
  async setTop10(tetrisStatistics: any) {
    const dbTop10s = await db.top10.orderBy("score").reverse().limit(10).toArray();
    // console.log(dbTop10s);
    const top10s = dbTop10s.map((top10) =>
      ({ name: top10.name, score: top10.score, ctime: dayjs(top10.ctime).fromNow(), }));
    if (!top10s.length) return;
    tetrisStatistics.top10 = top10s;
  }
  initMap(map: PointClassType[][], height: number, width: number): void {
    // console.log(this.tetrisWidth);
    for (let rowIdx = 0; rowIdx < height; ++rowIdx) {
      map.push(this.generateEmptyRow(width));
    }
  }
  /** 生成空行 */
  generateEmptyRow(width: number): PointClassType[] {
    const emptyRow: PointClassType[] = [];
    for (let colIdx = 0; colIdx < width; ++colIdx) {
      const point: PointClassType = { bgCls: PointClassEnmu.bg };
      emptyRow.push(point);
    }
    return emptyRow;
  }
}

const useTetrisUtil = (tetrisMap: PointClassType[][], rectNextMaps: PointClassType[][][], nextRects: RectType[]) => {
  const tetrisUtil: TetrisUtilType = new TetrisUtil(tetrisMap, rectNextMaps, nextRects);
  return tetrisUtil;
};

export { useTetrisUtil };
export type { TetrisUtilType };
