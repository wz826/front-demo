import { Standard } from './define';
namespace Tank90Map {
    export enum RectTypeEnmu {
        ground = 0,
        // 砖墙  brick (由4层土砖组成(每层4块土砖)，一级坦克1发炮弹可以摧毁1层，二级以上1发炮弹可以摧毁2层)
        brick = 1,
        // 钢墙  steel (由2层钢砖组成(每层2块钢砖)，四级坦克1发炮弹可以摧毁1层)
        steel = 2,
        // 水道  water (普通坦克无法通过，炮弹可以通过，两栖坦克可以通过)
        water = 3,
        // 草丛  grass (坦克可以通过，炮弹可以通过，通过时会有隐匿效果，五级坦克炮弹通过时可以摧毁)
        grass = 4,
        // 冰面  ice (坦克可以通过，炮弹可以通过，坦克通过时会有加速和打滑效果)
        ice = 5,
        // 老鹰 (坦克可以通过，炮弹击中后游戏结束)
        eagle = 6,
    }

    export type Line = RectTypeEnmu[];

    export type PointMap = Line[];

    /** 砖墙的点 [上左，上右，下左，下右] */
    export type BrickPoint = RectTypeEnmu[];

    export interface BrickType {
        /** 左上角的四个点：[上左，上右，下左，下右]，*/
        topLeft?: BrickPoint;
        /** [上左，上右，下左，下右]，*/
        topRight?: BrickPoint;
        /** [上左，上右，下左，下右]，*/
        bottomLeft?: BrickPoint;
        /** [上左，上右，下左，下右]，*/
        bottomRight?: BrickPoint;
    }

    export interface SteelType {
        topLeft?: RectTypeEnmu;
        topRight?: RectTypeEnmu;
        bottomLeft?: RectTypeEnmu;
        bottomRight?: RectTypeEnmu;
    }

    export interface RectType {
        readonly type: RectTypeEnmu;
        zoomTime: number;
        isGameOver?: boolean;
        points?: BrickType | SteelType;
    }

    export type RectMap = RectType[][];

    // 此处不用变更，只做为冗余字段
    const zoomTime = 1;

    const getLine = (point: RectTypeEnmu): readonly RectTypeEnmu[] => {
        const line: Line = [];
        for(let idx =0; idx < Standard.RECT_SIZE; ++idx){
            line.push(point);
        }
        return Object.freeze(line);
    }

    const groundLine: readonly RectTypeEnmu[] = getLine(RectTypeEnmu.ground);
    const brickLine: readonly RectTypeEnmu[] = getLine(RectTypeEnmu.brick);
    const steelLine: readonly RectTypeEnmu[] = getLine(RectTypeEnmu.steel);
    const waterLine: readonly RectTypeEnmu[] = getLine(RectTypeEnmu.water);
    const grassLine: readonly RectTypeEnmu[] = getLine(RectTypeEnmu.grass);
    const iceLine: readonly RectTypeEnmu[] = getLine(RectTypeEnmu.ice);
    const eagleLine: readonly RectTypeEnmu[] = getLine(RectTypeEnmu.eagle);

    const rectBrick: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            topLeft: [...brickLine],
            topRight: [...brickLine],
            bottomLeft: [...brickLine],
            bottomRight: [...brickLine],
        },
    };

    const rectBrickBottomRight: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            bottomRight: [...brickLine],
        },
    };

    const rectBrickBottomLeft: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            bottomLeft: [...brickLine],
        },
    };

    const rectBrickTopRight: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            topRight: [...brickLine],
        },
    };

    const rectBrickTopLeft: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            topLeft: [...brickLine],
        },
    };

    const rectBrickRight: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            topRight: [...brickLine],
            bottomRight: [...brickLine],
        },
    };

    const rectBrickTop: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            topLeft: [...brickLine],
            topRight: [...brickLine],
        },
    };

    const rectBrickBottom: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            bottomLeft: [...brickLine],
            bottomRight: [...brickLine],
        },
    };


    const rectBrickLeft: RectType = {
        type: RectTypeEnmu.brick,
        zoomTime,
        points: {
            topLeft: [...brickLine],
            bottomLeft: [...brickLine],
        },
    };

    const rectSteel: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            topLeft: RectTypeEnmu.steel,
            topRight: RectTypeEnmu.steel,
            bottomLeft: RectTypeEnmu.steel,
            bottomRight: RectTypeEnmu.steel,
        },
    };

    const rectSteelBottomRight: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            bottomRight: RectTypeEnmu.steel,
        },
    };

    const rectSteelBottomLeft: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            bottomLeft: RectTypeEnmu.steel,
        },
    };

    const rectSteelTopRight: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            topRight: RectTypeEnmu.steel,
        },
    };

    const rectSteelTopLeft: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            topLeft: RectTypeEnmu.steel,
        },
    };

    const rectSteelRight: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            topRight: RectTypeEnmu.steel,
            bottomRight: RectTypeEnmu.steel,
        },
    };

    const rectSteelLeft: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            topLeft: RectTypeEnmu.steel,
            bottomLeft: RectTypeEnmu.steel,
        },
    };

    const rectSteelBottom: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            bottomLeft: RectTypeEnmu.steel,
            bottomRight: RectTypeEnmu.steel,
        },
    };

    const rectSteelTop: RectType = {
        type: RectTypeEnmu.steel,
        zoomTime,
        points: {
            topLeft: RectTypeEnmu.steel,
            topRight: RectTypeEnmu.steel,
        },
    };

    const rectGrass: RectType = {
        type: RectTypeEnmu.grass,
        zoomTime,
    };

    const rectWater: RectType = {
        type: RectTypeEnmu.water,
        zoomTime,
    };

    const rectIce: RectType = {
        type: RectTypeEnmu.ice,
        zoomTime,
    };

    const rectEagle: RectType = {
        type: RectTypeEnmu.eagle,
        zoomTime,
    };

    const rectEagleGg: RectType = {
        type: RectTypeEnmu.eagle,
        zoomTime,
        isGameOver: true,
    };

    const rectGround: RectType = {
        type: RectTypeEnmu.ground,
        zoomTime,
    };

    const convertBrickToMap = (brick: BrickType): PointMap => {
        const map: PointMap = [];
        const line1: Line = [];
        const line2: Line = [];
        const line3: Line = [];
        const line4: Line = [];
        if (!brick.topLeft) brick.topLeft = [...groundLine];
        if (!brick.topRight) brick.topRight = [...groundLine];
        if (!brick.bottomLeft) brick.bottomLeft = [...groundLine];
        if (!brick.bottomRight) brick.bottomRight = [...groundLine];
        // [上左，上右，下左，下右]
        line1.push(...brick.topLeft.slice(0, 2), ...brick.topRight.slice(0, 2));
        line2.push(...brick.topLeft.slice(2, 4), ...brick.topRight.slice(2, 4));
        line3.push(...brick.bottomLeft.slice(0, 2), ...brick.bottomRight.slice(0, 2));
        line4.push(...brick.bottomLeft.slice(2, 4), ...brick.bottomRight.slice(2, 4));
        map.push(line1, line2, line3, line4);
        return map;
    }

    const convertSteelToMap = (steel: SteelType): PointMap => {
        const map: PointMap = [];
        const line1: Line = [];
        const line2: Line = [];
        const line3: Line = [];
        const line4: Line = [];
        const tl = steel.topLeft === RectTypeEnmu.steel ? steelLine : groundLine;
        const tr = steel.topRight === RectTypeEnmu.steel ? steelLine : groundLine;
        const bl = steel.bottomLeft === RectTypeEnmu.steel ? steelLine : groundLine;
        const br = steel.bottomRight === RectTypeEnmu.steel ? steelLine : groundLine;
        // [上左，上右，下左，下右]
        line1.push(...tl.slice(0, 2), ...tr.slice(0, 2));
        line2.push(...tl.slice(2, 4), ...tr.slice(2, 4));
        line3.push(...bl.slice(0, 2), ...br.slice(0, 2));
        line4.push(...bl.slice(2, 4), ...br.slice(2, 4));
        map.push(line1, line2, line3, line4);
        return map;
    }

    export const convertRectSetToLine = (rect: RectType, line1: Line, line2: Line, line3: Line, line4: Line) => {
        switch (rect.type) {
            case RectTypeEnmu.brick:
                const brick: BrickType = rect.points as BrickType;
                const brickmap = convertBrickToMap(brick);
                line1.push(...brickmap[0]);
                line2.push(...brickmap[1]);
                line3.push(...brickmap[2]);
                line4.push(...brickmap[3]);
                break;
            case RectTypeEnmu.steel:
                const steel: SteelType = rect.points as SteelType;
                const steelmap = convertSteelToMap(steel);
                line1.push(...steelmap[0]);
                line2.push(...steelmap[1]);
                line3.push(...steelmap[2]);
                line4.push(...steelmap[3]);
                break;
            case RectTypeEnmu.water:
                line1.push(...waterLine);
                line2.push(...waterLine);
                line3.push(...waterLine);
                line4.push(...waterLine);
                break;
            case RectTypeEnmu.grass:
                line1.push(...grassLine);
                line2.push(...grassLine);
                line3.push(...grassLine);
                line4.push(...grassLine);
                break;
            case RectTypeEnmu.ice:
                line1.push(...iceLine);
                line2.push(...iceLine);
                line3.push(...iceLine);
                line4.push(...iceLine);
                break;
            case RectTypeEnmu.eagle:
                line1.push(...eagleLine);
                line2.push(...eagleLine);
                line3.push(...eagleLine);
                line4.push(...eagleLine);
                break;
            default:
                line1.push(...groundLine);
                line2.push(...groundLine);
                line3.push(...groundLine);
                line4.push(...groundLine);
                break;
        }
    }

    /** 获取背景方块中的类型（4 Ｘ 4的方块中只可能有一种类型） */
    export const getRectType = (rect: Line): RectTypeEnmu => {
        const index = rect.findIndex(type => type !== RectTypeEnmu.ground);
        if (index === -1) return RectTypeEnmu.ground;
        return rect[index];
    }

    export const convertMapToRect = (rectType: RectTypeEnmu,
        line1: Line, line2: Line, line3: Line, line4: Line,
        zoomTime: number, isGameOver: boolean): RectType => {
        const rect: RectType = { type: rectType, zoomTime, isGameOver, };
        switch (rectType) {
            case RectTypeEnmu.brick:
                const brick: BrickType = {
                    /** 左上角的四个点：[上左，上右，下左，下右]，*/
                    topLeft: [...line1.slice(0, 2), ...line2.slice(0, 2)],
                    /** [上左，上右，下左，下右]，*/
                    topRight: [...line1.slice(2, 4), ...line2.slice(2, 4)],
                    /** [上左，上右，下左，下右]，*/
                    bottomLeft: [...line3.slice(0, 2), ...line4.slice(0, 2)],
                    /** [上左，上右，下左，下右]，*/
                    bottomRight: [...line3.slice(2, 4), ...line4.slice(2, 4)],
                };
                rect.points = brick;
                break;
            case RectTypeEnmu.steel:
                const steel: SteelType = {};
                if (line1[1] === RectTypeEnmu.steel) steel.topLeft = RectTypeEnmu.steel
                if (line1[3] === RectTypeEnmu.steel) steel.topRight = RectTypeEnmu.steel
                if (line3[1] === RectTypeEnmu.steel) steel.bottomLeft = RectTypeEnmu.steel
                if (line3[3] === RectTypeEnmu.steel) steel.bottomRight = RectTypeEnmu.steel
                rect.points = steel;
                break;
        }
        return rect;
    }

    /** 定义短别名，方便定义地图 */
    export const
        /** 老鹰 */
        E__ = rectEagle,
        Eg_ = rectEagleGg,
        /** 砖墙 */
        B__ = rectBrick,
        Bt_ = rectBrickTop,
        Bb_ = rectBrickBottom,
        Bl_ = rectBrickLeft,
        Br_ = rectBrickRight,
        Btl = rectBrickTopLeft,
        Btr = rectBrickTopRight,
        Bbl = rectBrickBottomLeft,
        Bbr = rectBrickBottomRight,
        /** 钢墙 */
        S__ = rectSteel,
        St_ = rectSteelTop,
        Sb_ = rectSteelBottom,
        Sl_ = rectSteelLeft,
        Sr_ = rectSteelRight,
        Stl = rectSteelTopLeft,
        Str = rectSteelTopRight,
        Sbl = rectSteelBottomLeft,
        Sbr = rectSteelBottomRight,
        /** 水道 */
        W__ = rectWater,
        /** 草丛 */
        G__ = rectGrass,
        /** 冰道 */
        I__ = rectIce,
        /** 道路 */
        L__ = rectGround;
}
// TODO 如果Vite支持namespace的合并就好了，就不用写下面这种啰嗦的代码了
export {Tank90Map}
// export type {     
//     // , RectTypeEnmu, BrickType, SteelType, RectType
//  }