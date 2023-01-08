
import { Standard } from './map'

enum RewardTypeEnmu {
    // 船(升级成两栖坦克，可通过水道)
    ship = 0,
    // 时钟(定时敌人的坦克一段时间)
    clock = 1,
    // 火枪(升级到第四级，可以摧毁钢墙)
    gun = 2,
    // 钢枪(升级到第五级，即满级，可以摧毁钢墙和草丛)
    rifle = 3,
    // 星星(升级坦克，默认一级，二级子弹加快，三级双发子弹)
    star = 4,
    // 帽子(增加一段无敌时间)
    cap = 5,
    // 炸弹(炸毁敌人的坦克)
    bomb = 6,
    // 铁铲(给老鹰加一层土墙)
    spade = 7,
    // 钢铲(给老鹰加一层钢墙)
    shovel = 8,
    // 坦克(给选手加一个坦克)
    tank = 9,
}

interface RewardType {
    zoomTime: number,
    type: RewardTypeEnmu;
    top: number;
    left: number;
    disappearTime: number;
}

class Reward {
    readonly Z_INDEX: number = 200;
    /** 奖励物品的边长 */
    readonly REWARD_LENGTH: number = Standard.RECT_LENGTH;
    readonly Ship: Ship = new Ship();
    readonly Clock: Clock = new Clock();
    readonly Gun: Gun = new Gun();
    readonly Rifle: Rifle = new Rifle();
    readonly Star: Star = new Star();
    readonly Cap: Cap = new Cap();
    readonly Bomb: Bomb = new Bomb();
    readonly Spade: Spade = new Spade();
    readonly Shovel: Shovel = new Shovel();
    readonly Tank: Tank = new Tank();
}

class Ship {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -443;
    readonly HEIGHT_OFFSET: number = -205;
}
class Clock {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -477;
    readonly HEIGHT_OFFSET: number = -205;
}
class Gun {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -511;
    readonly HEIGHT_OFFSET: number = -205;
}
class Rifle {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -919;
    readonly HEIGHT_OFFSET: number = -205;
}
class Star {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -545;
    readonly HEIGHT_OFFSET: number = -205;
}
class Cap {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -613;
    readonly HEIGHT_OFFSET: number = -205;
}
class Bomb {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -681;
    readonly HEIGHT_OFFSET: number = -205;
}
class Spade {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -749;
    readonly HEIGHT_OFFSET: number = -205;
}
class Shovel {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -953;
    readonly HEIGHT_OFFSET: number = -205;
}
class Tank {
    readonly Z_INDEX: number = 81;

    readonly WIDTH_OFFSET: number = -817;
    readonly HEIGHT_OFFSET: number = -205;
}


/** 奖励常量 */
const REWARD = new Reward();

export {  REWARD, Standard, RewardTypeEnmu }

export type {  RewardType }