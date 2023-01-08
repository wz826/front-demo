/// <reference path="./map.ts" />
/// <reference path="./map1-10.ts" />
import './map'
import './map1-10'
// TODO vite对ts支持的不够好，目前命名空间（namespace）不支持合并
import { Tank90Map as _ } from './map'
import { Tank90Map as Map1_10 } from './map1-10'
import { Standard, Brick, Steel, Grass, Water, Ice, Ground, Eagle } from './define';

// 90坦克 ADGHKN版式.png
// 90坦克 BEIL版式.png
// 90坦克 CFJM版式.png
// 91坦克 版式一.png
// 91坦克 版式二.png
// 91坦克 版式三.png

/** 91坦克 版式一.png */
const rectMaps: _.RectMap[] = [...Map1_10.maps1_10];

// console.log(Map1_10.map1);
// console.log(Tank90Map.RectTypeEnmu);

export const getMap = (level: number = 1): _.PointMap => {
    const pointMap: _.PointMap = [];
    const rectMap = rectMaps[level - 1];
    for (let rowIdx = 0; rowIdx < Standard.MAP_HEIGHT_SIZE; ++rowIdx) {
        const line1: _.Line = [];
        const line2: _.Line = [];
        const line3: _.Line = [];
        const line4: _.Line = [];
        for (let colIdx = 0; colIdx < Standard.MAP_WIDTH_SIZE; ++colIdx) {
            const rect = rectMap[rowIdx][colIdx];
            _.convertRectSetToLine(rect, line1, line2, line3, line4);
        }
        pointMap.push(line1, line2, line3, line4);
    }
    return pointMap;
}

export const convertMapToRects = (map: _.PointMap, zoomTime: number = 1, isGameOver: boolean = false): _.RectType[] => {
    const rect: _.RectType[] = [];
    for (let rowIdx = 0; rowIdx < Standard.MAP_HEIGHT_SIZE; ++rowIdx) {
        const rowStart = rowIdx * Standard.RECT_SIZE;
        for (let colIdx = 0; colIdx < Standard.MAP_WIDTH_SIZE; ++colIdx) {
            const colStart = colIdx * Standard.RECT_SIZE;
            const colEnd = colStart + Standard.RECT_SIZE;
            const line1: _.Line = map[rowStart + 0].slice(colStart, colEnd);
            const line2: _.Line = map[rowStart + 1].slice(colStart, colEnd);
            const line3: _.Line = map[rowStart + 2].slice(colStart, colEnd);
            const line4: _.Line = map[rowStart + 3].slice(colStart, colEnd);
            const rectType: _.RectTypeEnmu = _.getRectType([...line1, ...line2, ...line3, ...line4]);
            rect.push(_.convertMapToRect(rectType, line1, line2, line3, line4, zoomTime, isGameOver));
        }
    }
    return rect;
}

// TODO 再次定义导出
// type RectTypeEnmu = Tank90Map.RectTypeEnmu;
// type BrickType = Tank90Map.BrickType;
// type SteelType = Tank90Map.SteelType;
// type RectType = Tank90Map.RectType;

interface Config {
    zoomTime: number,
    isGameOver: boolean;
}

export { Standard, Brick, Steel, Grass, Water, Ice, Ground, Eagle };
export type {
    Config
    // TODO 再次定义导出
    // , RectTypeEnmu, BrickType, SteelType, RectType
};
