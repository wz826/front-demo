<script setup lang="ts">
import { RewardType, RewardTypeEnmu, REWARD, Standard } from './defineReward'
import { Ground } from './map';

// 奖励  [jiang3 li4]
// reward (as encouragement)

type Props = {
    reward: RewardType,
}

const props = defineProps<Props>();
const reward: RewardType = props.reward
// console.log(reward);
const zoomTime: number = reward.zoomTime;
// TODO 后续可以考虑由上层传递进来，不再由此处计算，可能会有性能上的提升
const rewardLength: string = `${zoomTime * REWARD.REWARD_LENGTH}px`;
const bgSize: string = `${zoomTime * Standard.BG_IMG_WIDTH}px ${zoomTime * Standard.BG_IMG_HEIGHT}px`;
const groundPos: string = `top ${zoomTime * Ground.HEIGHT_OFFSET}px left ${zoomTime * Ground.WIDTH_OFFSET}px`;


let bgPos: string = groundPos;
let top: string = `${zoomTime * reward.top * Standard.UNIT_LENGTH}px`;
let left: string = `${zoomTime * reward.left * Standard.UNIT_LENGTH}px`;
let zIndex: number = REWARD.Z_INDEX;
switch (reward.type) {
    // 船(升级成两栖坦克，可通过水道)
    case RewardTypeEnmu.ship:
        {
            const rw = REWARD.Ship;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
            // console.log(bgPos);
            // console.log(rw);
        }
        break;
    // 时钟(定时敌人的坦克一段时间)
    case RewardTypeEnmu.clock:
        {
            const rw = REWARD.Clock;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
    // 火枪(升级到第四级，可以摧毁钢墙)
    case RewardTypeEnmu.gun:
        {
            const rw = REWARD.Gun;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
    // 钢枪(升级到第五级，即满级，可以摧毁钢墙和草丛)
    case RewardTypeEnmu.rifle:
        {
            const rw = REWARD.Rifle;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
    // 星星(升级坦克，默认一级，二级子弹加快，三级双发子弹)
    case RewardTypeEnmu.star:
        {
            const rw = REWARD.Star;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
    // 帽子(增加一段无敌时间)
    case RewardTypeEnmu.cap:
        {
            const rw = REWARD.Cap;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
    // 炸弹(炸毁敌人的坦克)
    case RewardTypeEnmu.bomb:
        {
            const rw = REWARD.Bomb;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
    // 铁铲(给老鹰加一层土墙)
    case RewardTypeEnmu.spade:
        {
            const rw = REWARD.Spade;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
    // 钢铲(给老鹰加一层钢墙)
    case RewardTypeEnmu.shovel:
        {
            const rw = REWARD.Shovel;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
    // 坦克(给选手加一个坦克)
    case RewardTypeEnmu.tank:
        {
            const rw = REWARD.Tank;
            bgPos = `top ${zoomTime * rw.HEIGHT_OFFSET}px left ${zoomTime * rw.WIDTH_OFFSET}px`;
            zIndex += rw.Z_INDEX;
        }
        break;
}

</script>

<template>
    <div class="reward-bg"></div>
</template>

<style scoped>
.reward-bg {
    position: absolute;
    z-index: v-bind(zIndex);
    width: v-bind(rewardLength);
    height: v-bind(rewardLength);
    background-image: url("~/assets/game/tank90/tank90_bg.png");
    background-repeat: no-repeat;
    background-position: v-bind(bgPos);
    background-size: v-bind(bgSize);
    top: v-bind(top);
    left: v-bind(left);
}
</style>