<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const test = ref(route.params.test);
//  console.log(test.value);
const env = import.meta.env
//  console.log(env)
const router = useRouter();

const goBack = () => {
  // console.log(router);
  router.back();
};

const calendar = ref()
const selectDate = (val: string) => {
  calendar.value.selectDate(val)
}
</script>

<template>
  <el-container class="wz-home-bg">
    <el-calendar ref="calendar" class="wz-calendar">
      <template #header="{ date }">
        <span>{{ date }}</span>
        <el-button-group>
          <el-button size="small" @click="selectDate('prev-year')">
            前一年
          </el-button>
          <el-button size="small" @click="selectDate('prev-month')">
            前一月
          </el-button>
          <el-button type="primary" size="small" @click="selectDate('today')">
            今天
          </el-button>
          <el-button size="small" @click="selectDate('next-month')">
            后一月
          </el-button>
          <el-button size="small" @click="selectDate('next-year')">
            后一年
          </el-button>
        </el-button-group>
      </template>
    </el-calendar>
  </el-container>
</template>

<style scoped>
@media (min-width: 1024px) {

  .wz-home-bg {
    width: 100%;
    justify-content: center;
  }

  .wz-calendar {
    margin-top: 5px;
    margin-right: 100px;
    width: 800px;
    align-self: center;
  }

  :deep(.wz-calendar .ep-calendar-day) {
    height: 80px;
  }


}
</style>

