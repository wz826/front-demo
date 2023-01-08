import { toRaw, ToRefs } from 'vue';
import { Standard as $ } from '../map'
import '../map/map'
import '../map/map1-10'
import { Tank90Map as _ } from '../map/map'
import { p1BgOffsets } from './playerOneTank'
import { p2BgOffsets } from './playerTwoTank'

const RectTypeEnmu = _.RectTypeEnmu;

interface Position {
    x: number;
    y: number;
}

enum DirectionEnum {
    up = 0,
    down = 1,
    left = 2,
    right = 3,
}

/**
 * 背景偏移
 */
interface TankBgOffsetType {
    readonly BEFORE_UP_WIDTH_OFFSET: number;
    readonly BEFORE_UP_HEIGHT_OFFSET: number;
    readonly AFTER_UP_WIDTH_OFFSET: number;
    readonly AFTER_UP_HEIGHT_OFFSET: number;

    readonly BEFORE_DOWN_WIDTH_OFFSET: number;
    readonly BEFORE_DOWN_HEIGHT_OFFSET: number;
    readonly AFTER_DOWN_WIDTH_OFFSET: number;
    readonly AFTER_DOWN_HEIGHT_OFFSET: number;

    readonly BEFORE_LEFT_WIDTH_OFFSET: number;
    readonly BEFORE_LEFT_HEIGHT_OFFSET: number;
    readonly AFTER_LEFT_WIDTH_OFFSET: number;
    readonly AFTER_LEFT_HEIGHT_OFFSET: number;

    readonly BEFORE_RIGHT_WIDTH_OFFSET: number;
    readonly BEFORE_RIGHT_HEIGHT_OFFSET: number;
    readonly AFTER_RIGHT_WIDTH_OFFSET: number;
    readonly AFTER_RIGHT_HEIGHT_OFFSET: number;
}

abstract class Tank {
    public static readonly Z_INDEX: number = 42;
    protected static readonly Max_Level: number = 5;
    private static readonly Live_Tanks: Tank[] = [];
    /** 
     * 等级，
     * 一级：坦克最多装填1发慢速炮弹， 
     * 二级：坦克最多装填1发高速炮弹，
     * 三级：坦克最多装填2发高速炮弹，坦克可以承受1发炮弹不被摧毁同时降级
     * 四级：坦克最多装填2发高速炮弹，炮弹击中钢墙时可以摧毁钢墙，坦克可以承受1发炮弹不被摧毁同时降级
     * 五级：坦克最多装填2发高速炮弹，炮弹击中钢墙时可以摧毁钢墙，炮弹通过草丛时可以消除草丛，坦克可以承受1发炮弹不被摧毁同时降级
     */
    protected level: number = 1;
    /**
     * 是否两栖坦克
     * 两栖坦克可以通过水道，可以承受1发炮弹不被摧毁同时变成普通坦克
     */
    private isShipTank: boolean = false;
    /**
     * 位置，四个角的点,[上左，上右，下左，下右]
     */
    private readonly position: Position[];
    /**
     * 方向:玩家坦克默认朝上，系统坦克默认朝下
     */
    private direction: DirectionEnum;
    /**
     * 弹药仓的炮弹装填数量，随等级变化，发射炮弹后清空弹药仓中的1颗炮弹，炮弹击中物体后才可以重新装填1颗炮弹到弹药仓
     */
    private bulletSize: number = 1;
    /**
     * 是否为高速炮弹，随等级变化
     */
    private isHighSpeedBullet: boolean = false;
    /** 背景图片的相对位置 */
    protected bgOffset: TankBgOffsetType;
    private bgOffsetTop: number = 1;
    private bgOffsetLeft: number = 1;
    /** 相对地图的位置 */
    private offsetTop: number = 1;
    private offsetLeft: number = 1;
    private readonly MAX_Y: number = $.MAP_HEIGHT_SIZE * $.RECT_SIZE - 1;
    private readonly MAX_X: number = $.MAP_WIDTH_SIZE * $.RECT_SIZE - 1;
    private readonly map: ToRefs<_.PointMap>;
    constructor(map: ToRefs<_.PointMap>, position: Position[], direction: DirectionEnum, bgOffset: TankBgOffsetType) {
        // console.log('Tank');
        // console.log(direction);
        this.map = map;
        this.position = position;
        this.direction = direction;
        this.bgOffset = bgOffset;
        // console.log(offset);
        this.turn(direction);
        this.setOffset();
        Tank.Live_Tanks.push(this);
    }
    public getBgOffsetTop() { return this.bgOffsetTop; };
    public getBgOffsetLeft() { return this.bgOffsetLeft; };
    public getOffsetTop() { return this.offsetTop; };
    public getOffsetLeft() { return this.offsetLeft; };
    public abstract shoot(): void;
    public abstract destory(): void;
    public move(direction: DirectionEnum) {
        if (this.direction !== direction) {
            this.turn(direction);
            return;
        }
        // 移动位置 position
        switch (direction) {
            case DirectionEnum.up:
                if (this.isOverMap()) return;
                this.position.forEach(pos => pos.y -= 1);
                break;
            case DirectionEnum.down:
                if (this.isOverMap()) return;
                this.position.forEach(pos => pos.y += 1);
                break;
            case DirectionEnum.left:
                if (this.isOverMap()) return;
                this.position.forEach(pos => pos.x -= 1);
                break;
            case DirectionEnum.right:
                if (this.isOverMap()) return;
                this.position.forEach(pos => pos.x += 1);
                break;
        }
        this.setOffset();
    };
    public turn(direction: DirectionEnum) {
        this.direction = direction;
        // console.log(direction);
        this.setBgOffset();
    };
    protected setBgOffset() {
        switch (this.direction) {
            case DirectionEnum.up:
                this.bgOffsetTop = this.bgOffset.BEFORE_UP_HEIGHT_OFFSET;
                this.bgOffsetLeft = this.bgOffset.BEFORE_UP_WIDTH_OFFSET;
                // console.log('turn');
                break;
            case DirectionEnum.down:
                this.bgOffsetTop = this.bgOffset.BEFORE_DOWN_HEIGHT_OFFSET;
                this.bgOffsetLeft = this.bgOffset.BEFORE_DOWN_WIDTH_OFFSET;
                break;
            case DirectionEnum.left:
                this.bgOffsetTop = this.bgOffset.BEFORE_LEFT_HEIGHT_OFFSET;
                this.bgOffsetLeft = this.bgOffset.BEFORE_LEFT_WIDTH_OFFSET;
                break;
            case DirectionEnum.right:
                this.bgOffsetTop = this.bgOffset.BEFORE_RIGHT_HEIGHT_OFFSET;
                this.bgOffsetLeft = this.bgOffset.BEFORE_RIGHT_WIDTH_OFFSET;
                break;
        }
    };
    private setOffset(): void {
        // 相对地图的位置
        const topLeft = this.position[0]
        // console.log(topLeft);
        this.offsetTop = topLeft.y;
        this.offsetLeft = topLeft.x;
    }
    private isOverMap(): boolean {
        switch (this.direction) {
            case DirectionEnum.up:
                {
                    const topLeft = this.position[0]
                    if (topLeft.y <= 0) return true;
                    const startY: number = topLeft.y - 1;
                    const startX: number = topLeft.x;
                    const pos: Position = { x: startX, y: startY };
                    for (let x: number = 0; x < $.RECT_SIZE; ++x, ++pos.x) {
                        if (this.isLongstop(pos)) return true;
                    }
                }
                return false;
            case DirectionEnum.down:
                {
                    const bottomLeft = this.position[2]
                    if (bottomLeft.y >= this.MAX_Y) return true;
                    const startY: number = bottomLeft.y + 1;
                    const startX: number = bottomLeft.x;
                    const pos: Position = { x: startX, y: startY };
                    for (let x: number = 0; x < $.RECT_SIZE; ++x, ++pos.x) {
                        if (this.isLongstop(pos)) return true;
                    }
                }
                return false;
            case DirectionEnum.left:
                {
                    const topLeft = this.position[0]
                    if (topLeft.x <= 0) return true;
                    const startY: number = topLeft.y;
                    const startX: number = topLeft.x - 1;
                    const pos: Position = { x: startX, y: startY };
                    for (let y: number = 0; y < $.RECT_SIZE; ++y, ++pos.y) {
                        if (this.isLongstop(pos)) return true;
                    }
                }
                return false;
            case DirectionEnum.right:
                {
                    const topRight = this.position[1]
                    if (topRight.x >= this.MAX_X) return true;
                    const startY: number = topRight.y;
                    const startX: number = topRight.x + 1;
                    const pos: Position = { x: startX, y: startY };
                    for (let y: number = 0; y < $.RECT_SIZE; ++y, ++pos.y) {
                        if (this.isLongstop(pos)) return true;
                    }
                }
                return false;
        }
    };
    private isLongstop(pos: Position): boolean {
        // console.log(pos)
        const type: _.RectTypeEnmu = this.map[pos.y].value[pos.x];
        if (type === RectTypeEnmu.brick) return true;
        if (type === RectTypeEnmu.steel) return true;
        if (type === RectTypeEnmu.water && !this.isShipTank) return true;
        // console.log(Tank.Live_Tanks)
        // console.log(toRaw(this))
        // console.log(Tank.Live_Tanks.filter(lt => lt !== toRaw(this)))
        if (Tank.Live_Tanks.filter(lt => lt !== toRaw(this)).findIndex(lt => lt.position
            .findIndex(lp => lp.x === pos.x && lp.y === pos.y) > -1) > -1) return true;
        return false;
    }
}

class PlayerTank extends Tank {
    /**
     * 是否无敌模式
     * 刚出生或吃到无敌奖励时变为无敌模式，此时不会被炮弹摧毁
     */
    private isInvincibly: false = false;
    /**
     * 坦克数量
     */
    private tankSize: number = 3;
    /**
     * 是否为玩家1
     */
    private readonly isFirstPlayer: boolean;
    constructor(map: ToRefs<_.PointMap>, isFirstPlayer: boolean = true) {
        // console.log('PlayerTank');
        const position: Position[] = PlayerTank.getPlayerTankInitPosition(isFirstPlayer);
        const offset: TankBgOffsetType = PlayerTank.getBgOffset(1, isFirstPlayer);
        super(map, position, DirectionEnum.up, offset);
        this.isFirstPlayer = isFirstPlayer;
    }
    public shoot(): void {
        // level up
        this.levelUp();
    }
    public destory(): void {
    }
    private levelUp(): void {
        if (this.level >= PlayerTank.Max_Level) return;
        // TODO 升级到5级后再升级会出现异常
        // Uncaught TypeError: Cannot read properties of undefined (reading 'BEFORE_LEFT_HEIGHT_OFFSET')
        // at Proxy.setBgOffset (Index-d10aca7e.js:1:20841)
        // at Proxy.levelUp (Index-d10aca7e.js:1:22470)
        // at Proxy.shoot (Index-d10aca7e.js:1:22316)
        // at N (Index-d10aca7e.js:1:25750)
        // at HTMLDocument.D (Index-d10aca7e.js:1:25602)
        ++this.level;
        const bgOffset: TankBgOffsetType = PlayerTank.getBgOffset(this.level, this.isFirstPlayer);
        this.bgOffset = bgOffset;
        this.setBgOffset();
    }
    private static getBgOffset(level: number = 1, isFirstPlayer: boolean = true): TankBgOffsetType {
        let idx = level - 1;
        if (level >= PlayerTank.Max_Level) {
            idx = PlayerTank.Max_Level - 1
        }
        if (level <= 0) {
            idx = 1
        }
        const bgOffset: TankBgOffsetType = isFirstPlayer ? p1BgOffsets[idx] : p2BgOffsets[idx];
        return bgOffset;
    }
    /**
     * 玩家出生位置，四个角的点,[上左，上右，下左，下右]
     */
    private static getPlayerTankInitPosition(isFirstPlayer: boolean) {
        const initX = isFirstPlayer ? 4 : 8;
        const initY = 12;
        const leftX = initX * $.RECT_SIZE;
        const rightX = initX * $.RECT_SIZE + 3;
        const topY___ = initY * $.RECT_SIZE;
        const bottomY = initY * $.RECT_SIZE + 3;
        const playerPosition: Position[] = [
            { x: leftX, y: topY___ }, { x: rightX, y: topY___ },
            { x: leftX, y: bottomY }, { x: rightX, y: bottomY },
        ];
        return playerPosition;
    }
}

class NpcTank extends Tank {
    /**
     * 是否暂停(NPC坦克被暂停，不是游戏被暂停)
     * 暂停时不可以移动坦克和发射炮弹，已经发射的炮弹继续飞行
     */
    private isPause: boolean = false;
    constructor(map: ToRefs<_.PointMap>, position: Position[], offset: TankBgOffsetType) {
        super(map, position, DirectionEnum.down, offset);
        // TODO 初始化后自治运行，直到销毁
    }
    public shoot(): void {
    }
    public destory(): void {
    }
}

/**
 * 创建玩家坦克
 * 
 * @param map 
 * @param isFirstPlayer 
 */
export const createPlayerTank = (map: ToRefs<_.PointMap>, isFirstPlayer: boolean = true): PlayerTank => {
    const playerTank = new PlayerTank(map, isFirstPlayer);
    return playerTank;
}

export { DirectionEnum, Tank, PlayerTank, $ as Standard };
export type { Position, TankBgOffsetType };
