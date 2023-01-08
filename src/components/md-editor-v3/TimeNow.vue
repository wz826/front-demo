<script setup lang="ts">
export interface TimeNowProps {
  isTwoLines?: boolean;
  isShowSeconds?: boolean;
}
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useWebConfigStore } from '~/store/webConfig'
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/zh-cn';
dayjs.extend(localeData);
dayjs.locale(useWebConfigStore().webConfig.lang.toLowerCase());

const props = withDefaults(defineProps<TimeNowProps>(), {
  isTwoLines: false,
  isShowSeconds: true,
})

const tickTime = props.isShowSeconds ? 1_000 : 60_000;

const time = ref('');
const date = ref('');
const dateTime = ref('');
const week = ref('');

const timePattern = `HH:mm${props.isShowSeconds ? ':ss' : ''}`;
const datePattern = 'YYYY-MM-DD';

const setDatetime = () => {
  const now = dayjs();
  week.value = dayjs.weekdays()[now.day()];
  time.value = now.format(timePattern);
  date.value = now.format(datePattern);
  if (!props.isTwoLines) {
    dateTime.value = `${date.value} ${time.value} ${week.value}`;
  }
}

const timerId = setInterval(setDatetime, tickTime);

onBeforeMount(setDatetime);

onBeforeUnmount(() => {
  clearInterval(timerId);
});
</script>

<template>
  <div class="time-now-panel">
    <el-icon>
      <font-awesome-icon :icon="faClock" class="icon"></font-awesome-icon>
    </el-icon>
    <div class="time-now-body">
      <span v-text="props.isTwoLines ? date : dateTime"></span>
      <span v-if="props.isTwoLines" v-text="`${time} ${week}`"></span>
    </div>
  </div>
</template>

<style scoped>
.time-now-panel {
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  line-height: 1em;
}

.time-now-body {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  line-height: 16px;
}
</style>