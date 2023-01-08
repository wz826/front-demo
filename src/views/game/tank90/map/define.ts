/*
 * 战场面积均为13 X 13 TODO后续可以考虑做成宽屏
 * 每个单位面积由方块组成，单位面积为4 X 4，即16个点
 * 坦克占用一个单位
 * 炮弹由坦克的前方中间两个点发出，路径上持续通过直到遇到阻碍，摧毁时向两边溅射各1个点
 */
/**
 * 地图标准类
 */
class Standard {
    static readonly Z_INDEX: number = 100;
    /** 地图背景宽度 */
    static readonly BG_IMG_WIDTH: number = 1088;
    /** 地图背景高度 */
    static readonly BG_IMG_HEIGHT: number = 442;
    /** 地图标准单位长度 */
    static readonly UNIT_LENGTH: number = 8;
    /** 地图方块单位(TODO就是一个方块由多少个单位组成) */
    static readonly RECT_SIZE: number = 4;
    /** 地图方块宽度 */
    static readonly RECT_LENGTH: number = this.RECT_SIZE * this.UNIT_LENGTH;
    /** 地图宽度单位 战场面积均为13 X 13 TODO后续可以考虑做成宽屏 */
    static readonly MAP_WIDTH_SIZE: number = 13;
    /** 地图高度单位 战场面积均为13 X 13 */
    static readonly MAP_HEIGHT_SIZE: number = 13;
    /** 地图宽度 */
    static readonly MAP_WIDTH: number = this.MAP_WIDTH_SIZE * this.RECT_LENGTH;
    /** 地图高度 */
    static readonly MAP_HEIGHT: number = this.MAP_HEIGHT_SIZE * this.RECT_LENGTH;
    private constructor() {
    }
}

class Brick {
    static readonly Z_INDEX: number = 13;

    static readonly TOP_LEFT_WIDTH_OFFSET: number = -137;
    static readonly TOP_LEFT_HEIGHT_OFFSET: number = -171;

    static readonly TOP_RIGHT_WIDTH_OFFSET: number = -179;
    static readonly TOP_RIGHT_HEIGHT_OFFSET: number = -171;

    static readonly BOTTOM_LEFT_WIDTH_OFFSET: number = -239;
    static readonly BOTTOM_LEFT_HEIGHT_OFFSET: number = -179;

    static readonly BOTTOM_RIGHT_WIDTH_OFFSET: number = -383;
    static readonly BOTTOM_RIGHT_HEIGHT_OFFSET: number = -179;
    private constructor() {
    }
}

class Steel {
    static readonly Z_INDEX: number = 13;

    static readonly WIDTH_OFFSET: number = -1;
    static readonly HEIGHT_OFFSET: number = -205;
    private constructor() {
    }
}

class Water {
    static readonly Z_INDEX: number = 13;

    /** 速度 */
    static readonly velocity: number = 800;

    /** 流动效果：前 */
    static readonly BEFORE_WIDTH_OFFSET: number = -1;
    static readonly BEFORE_HEIGHT_OFFSET: number = -239;
    /** 流动效果：后 */
    static readonly AFTER_WIDTH_OFFSET: number = -35;
    static readonly AFTER_HEIGHT_OFFSET: number = -239;
    private constructor() {
    }
}

class Grass {
    static readonly Z_INDEX: number = 61;

    static readonly WIDTH_OFFSET: number = -137;
    static readonly HEIGHT_OFFSET: number = -239;
    private constructor() {
    }
}

class Ice {
    static readonly Z_INDEX: number = 13;

    static readonly WIDTH_OFFSET: number = -307;
    static readonly HEIGHT_OFFSET: number = -239;
    private constructor() {
    }
}

class Ground {
    static readonly Z_INDEX: number = 13;

    static readonly WIDTH_OFFSET: number = -1;
    static readonly HEIGHT_OFFSET: number = -137;
    private constructor() {
    }
}

class Eagle {
    static readonly Z_INDEX: number = 13;

    static readonly WIDTH_OFFSET: number = -647;
    static readonly HEIGHT_OFFSET: number = -171;

    static readonly GG_WIDTH_OFFSET: number = -681;
    static readonly GG_HEIGHT_OFFSET: number = -171;
    private constructor() {
    }
}

export { Standard, Brick, Steel, Grass, Water, Ice, Ground, Eagle }