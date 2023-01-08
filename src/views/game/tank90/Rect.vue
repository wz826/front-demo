<script setup lang="ts">
import './map/map'
import './map/map1-10'
import { Tank90Map as _ } from './map/map'
import { Brick, Eagle, Grass, Ground, Ice, Standard as $, Steel, Water } from './map'
import { nextTick, ref } from 'vue';
import { useTimeoutFn, } from '@vueuse/core';

const RTE = _.RectTypeEnmu;

// 矩形  
// n.  (Trad=矩形, Pinyin=ju3 xing2) rectangle

type Props = {
    rect: _.RectType,
}

const props = defineProps<Props>();
const rect: _.RectType = props.rect
const zoomTime: number = rect.zoomTime;
// TODO 后续可以考虑由上层传递进来，不再由此处计算，可能会有性能上的提升
const rectLength: string = `${zoomTime * $.RECT_LENGTH}px`;
const bgSize: string = `${zoomTime * $.BG_IMG_WIDTH}px ${zoomTime * $.BG_IMG_HEIGHT}px`;
const groundPos: string = `top ${zoomTime * Ground.HEIGHT_OFFSET}px left ${zoomTime * Ground.WIDTH_OFFSET}px`;

// console.log(rect);

let zIndex: number = $.Z_INDEX;
let bgWidth: string;
let bgHeight: string;
let bgPos = ref(groundPos);
let useRectWithBg = false;

let brickRect: _.BrickType;
let brickWidth: string;
let brickHeight: string;
let brickTopLeftPos: string;
let brickTopRightPos: string;
let brickBottomLeftPos: string;
let brickBottomRightPos: string;

let steelRect: _.SteelType;
let steelPos: string;

const getWaterBg = (isBefor: boolean = true) => {
    return isBefor
        ? `top ${zoomTime * Water.BEFORE_HEIGHT_OFFSET}px left ${zoomTime * Water.BEFORE_WIDTH_OFFSET}px`
        : `top ${zoomTime * Water.AFTER_HEIGHT_OFFSET}px left ${zoomTime * Water.AFTER_WIDTH_OFFSET}px`;
};

switch (rect.type) {
    case RTE.brick:
        zIndex += Brick.Z_INDEX;
        bgWidth = `${zoomTime * $.UNIT_LENGTH}px`;
        bgHeight = `${zoomTime * $.UNIT_LENGTH}px`;
        brickRect = rect.points as _.BrickType;
        brickWidth = `${zoomTime * 2 * $.UNIT_LENGTH}px`;
        brickHeight = `${zoomTime * 2 * $.UNIT_LENGTH}px`;
        brickTopLeftPos = `top ${zoomTime * Brick.TOP_LEFT_HEIGHT_OFFSET}px left ${zoomTime * Brick.TOP_LEFT_WIDTH_OFFSET}px`;
        brickTopRightPos = `top ${zoomTime * Brick.TOP_RIGHT_HEIGHT_OFFSET}px left ${zoomTime * Brick.TOP_RIGHT_WIDTH_OFFSET}px`;
        brickBottomLeftPos = `top ${zoomTime * Brick.BOTTOM_LEFT_HEIGHT_OFFSET}px left ${zoomTime * Brick.BOTTOM_LEFT_WIDTH_OFFSET}px`;
        brickBottomRightPos = `top ${zoomTime * Brick.BOTTOM_RIGHT_HEIGHT_OFFSET}px left ${zoomTime * Brick.BOTTOM_RIGHT_WIDTH_OFFSET}px`;
        break;
    case RTE.steel:
        zIndex += Steel.Z_INDEX;
        bgWidth = `${zoomTime * 2 * $.UNIT_LENGTH}px`;
        bgHeight = `${zoomTime * 2 * $.UNIT_LENGTH}px`;
        steelRect = rect.points as _.SteelType;
        steelPos = `top ${zoomTime * Steel.HEIGHT_OFFSET}px left ${zoomTime * Steel.WIDTH_OFFSET}px`;
        break;
    case RTE.grass:
        zIndex += Grass.Z_INDEX;
        bgWidth = rectLength;
        bgHeight = rectLength;
        bgPos.value = `top ${zoomTime * Grass.HEIGHT_OFFSET}px left ${zoomTime * Grass.WIDTH_OFFSET}px`;
        useRectWithBg = true;
        break;
    case RTE.water:
        zIndex += Water.Z_INDEX;
        bgWidth = rectLength;
        bgHeight = rectLength;
        let isBefor = ref(true);
        bgPos.value = getWaterBg();
        // TODO 后续可以优化成从上层传进来，不用启动多个定时器
        const { start: gameCmdResume, stop: gameCmdSuspend } = useTimeoutFn(
            async () => {
                await nextTick()
                isBefor.value = !isBefor.value;
                bgPos.value = getWaterBg(isBefor.value);
                gameCmdResume();
            }, Water.velocity);
        gameCmdResume();
        useRectWithBg = true;
        break;
    case RTE.ice:
        zIndex += Ice.Z_INDEX;
        bgWidth = rectLength;
        bgHeight = rectLength;
        bgPos.value = `top ${zoomTime * Ice.HEIGHT_OFFSET}px left ${zoomTime * Ice.WIDTH_OFFSET}px`;
        useRectWithBg = true;
        break;
    case RTE.eagle:
        zIndex += Eagle.Z_INDEX;
        bgWidth = rectLength;
        bgHeight = rectLength;
        if (rect.isGameOver) {
            bgPos.value = `top ${zoomTime * Eagle.GG_HEIGHT_OFFSET}px left ${zoomTime * Eagle.GG_WIDTH_OFFSET}px`;
        } else {
            bgPos.value = `top ${zoomTime * Eagle.HEIGHT_OFFSET}px left ${zoomTime * Eagle.WIDTH_OFFSET}px`;
        }
        useRectWithBg = true;
        break;
    default:
        useRectWithBg = false;
        break;
}


</script>

<template>
    <div class="rect-panel" :class="useRectWithBg ? 'rect-bg' : ''">
        <template v-if="rect.type === RTE.brick">
            <div class="brick-panel">
                <template v-if="brickRect?.topLeft">
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.topLeft[0] === RTE.brick ? brickTopLeftPos : groundPos
                    }">
                    </div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.topLeft[1] === RTE.brick ? brickTopRightPos : groundPos
                    }"></div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.topLeft[2] === RTE.brick ? brickBottomLeftPos : groundPos
                    }"></div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.topLeft[3] === RTE.brick ? brickBottomRightPos : groundPos
                    }"></div>
                </template>
            </div>
            <div class="brick-panel">
                <template v-if="brickRect?.topRight">
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.topRight[0] === RTE.brick ? brickTopLeftPos : groundPos
                    }">
                    </div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.topRight[1] === RTE.brick ? brickTopRightPos : groundPos
                    }"></div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.topRight[2] === RTE.brick ? brickBottomLeftPos : groundPos
                    }"></div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.topRight[3] === RTE.brick ? brickBottomRightPos : groundPos
                    }"></div>
                </template>
            </div>
            <div class="brick-panel">
                <template v-if="brickRect?.bottomLeft">
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.bottomLeft[0] === RTE.brick ? brickTopLeftPos : groundPos
                    }">
                    </div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.bottomLeft[1] === RTE.brick ? brickTopRightPos : groundPos
                    }"></div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.bottomLeft[2] === RTE.brick ? brickBottomLeftPos : groundPos
                    }"></div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.bottomLeft[3] === RTE.brick ? brickBottomRightPos : groundPos
                    }"></div>
                </template>
            </div>
            <div class="brick-panel">
                <template v-if="brickRect?.bottomRight">
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.bottomRight[0] === RTE.brick ? brickTopLeftPos : groundPos
                    }">
                    </div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.bottomRight[1] === RTE.brick ? brickTopRightPos : groundPos
                    }"></div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.bottomRight[2] === RTE.brick ? brickBottomLeftPos : groundPos
                    }"></div>
                    <div class="rect-bg" :style="{
                        backgroundPosition: brickRect.bottomRight[3] === RTE.brick ? brickBottomRightPos : groundPos
                    }"></div>
                </template>
            </div>
        </template>
        <template v-else-if="rect.type === RTE.steel">
            <div class="rect-bg" :style="{
                backgroundPosition: steelRect?.topLeft === RTE.steel ? steelPos : groundPos
            }">
            </div>
            <div class="rect-bg" :style="{
                backgroundPosition: steelRect?.topRight === RTE.steel ? steelPos : groundPos
            }">
            </div>
            <div class="rect-bg" :style="{
                backgroundPosition: steelRect?.bottomLeft === RTE.steel ? steelPos : groundPos
            }">
            </div>
            <div class="rect-bg" :style="{
                backgroundPosition: steelRect?.bottomRight === RTE.steel ? steelPos : groundPos
            }">
            </div>
        </template>
    </div>
</template>

<style scoped>
.rect-panel {
    z-index: v-bind(zIndex);
    width: v-bind(rectLength);
    height: v-bind(rectLength);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.brick-panel {
    width: v-bind(brickWidth);
    height: v-bind(brickHeight);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.rect-bg {
    width: v-bind(bgWidth);
    height: v-bind(bgHeight);
    background-image: url("~/assets/game/tank90/tank90_bg.png");
    background-repeat: no-repeat;
    background-position: v-bind(bgPos);
    background-size: v-bind(bgSize);
}
</style>