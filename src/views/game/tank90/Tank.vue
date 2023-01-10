<script setup lang="ts">
import { PlayerTank, Standard as $ } from './tank/defineTank'
import { Ref, ref, UnwrapNestedRefs, watchEffect } from 'vue';
import { Config } from './map';

// tank  [tæŋk]
// n.  柜, 箱, 罐; 池塘; 贮水池; 坦克, 战车

export interface Props {
    config: Config,
    tank: UnwrapNestedRefs<PlayerTank>,
}

const props = defineProps<Props>();

// const tank: TankType = props.tank
// console.log(tank);
const zoomTime: Ref<number> = ref(1);
// TODO 后续可以考虑由上层传递进来，不再由此处计算，可能会有性能上的提升
const rewardLength: Ref<string> = ref('');
const bgSize: Ref<string> = ref('');

const bgPos: Ref<string> = ref('');
const top: Ref<string> = ref('');
const left: Ref<string> = ref('');
const zIndex: Ref<number> = ref(1);

const init = ({ config, tank }: { config: Config, tank: UnwrapNestedRefs<PlayerTank> }) => {
    // const tank: TankType = props.tank
    // console.log(tank);
    zoomTime.value = config.zoomTime;
    // TODO 后续可以考虑由上层传递进来，不再由此处计算，可能会有性能上的提升
    rewardLength.value = `${zoomTime.value * $.RECT_LENGTH}px`;
    bgSize.value = `${zoomTime.value * $.BG_IMG_WIDTH}px ${zoomTime.value * $.BG_IMG_HEIGHT}px`;

    bgPos.value = `top ${zoomTime.value * tank.getBgOffsetTop()}px left ${zoomTime.value * tank.getBgOffsetLeft()}px`;
    top.value = `${zoomTime.value * tank.getOffsetTop() * $.UNIT_LENGTH}px`;
    left.value = `${zoomTime.value * tank.getOffsetLeft() * $.UNIT_LENGTH}px`;
    zIndex.value = PlayerTank.Z_INDEX;
}

watchEffect(() => {
    // console.log("watchEffect");
    init(props);
});


// console.log(top);
// console.log(left);

</script>

<template>
    <div class="tank-bg"></div>
</template>

<style scoped>
.tank-bg {
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