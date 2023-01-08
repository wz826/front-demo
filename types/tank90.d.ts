// TODO 全局自定义类型
// declare namespace Tank90 {

declare module "Tank90" {

    enum RectTypeEnmu {
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

    interface BrickType {
        /** 左上角的四个点：[上左，上右，下左，下右]，*/
        topLeft?: RectTypeEnmu[];
        /** [上左，上右，下左，下右]，*/
        topRight?: RectTypeEnmu[];
        /** [上左，上右，下左，下右]，*/
        bottomLeft?: RectTypeEnmu[];
        /** [上左，上右，下左，下右]，*/
        bottomRight?: RectTypeEnmu[];
    }

    interface SteelType {
        topLeft?: RectTypeEnmu;
        topRight?: RectTypeEnmu;
        bottomLeft?: RectTypeEnmu;
        bottomRight?: RectTypeEnmu;
    }

    interface RectType {
        readonly type: RectTypeEnmu;
        zoomTime: number,
        isGameOver?: boolean;
        points?: BrickType | SteelType;
    }

}