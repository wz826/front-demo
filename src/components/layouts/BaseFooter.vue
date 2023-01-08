<script setup lang="ts">
import { reactive } from 'vue';
// TODO 后续改成import
const jinrishici = require('jinrishici');
const toadyPoem: any = reactive({});
jinrishici.load((result: any) => {
  // console.log(result.status);
  toadyPoem.content = result.data.content;
  toadyPoem.title = result.data.origin.title;
  toadyPoem.dynasty = result.data.origin.dynasty;
  toadyPoem.author = result.data.origin.author;
  toadyPoem.contentFull = result.data.origin.content;
  toadyPoem.translate = result.data.origin.translate;
  // 彩蛋
  console.log(`今日诗词：${toadyPoem.content}`);
});

</script>

<template>
  <el-divider border-style="dashed" />
  <el-row class="form-row">
    <el-col style="text-align: center;">
      <span class="poem-item">{{ toadyPoem.content }}</span>
      <el-tag class="poem-item" size="small">{{ toadyPoem.title }}</el-tag>
      <el-tag class="poem-item" size="small">{{ toadyPoem.dynasty }}</el-tag>
      <el-tag class="poem-item" size="small">{{ toadyPoem.author }}</el-tag>
    </el-col>
  </el-row>
  <el-divider border-style="dashed" />
  <el-row class="form-row">
    <el-col :span="1">
      <div class="poem-item-full">
        <el-tag size="large">原文</el-tag>
      </div>
    </el-col>
    <el-col :span="23">
      <el-space wrap>
        <div v-for="one in toadyPoem.contentFull">
          <span>{{ one }}</span>
        </div>
      </el-space>
    </el-col>
  </el-row>
  <el-divider border-style="dashed" />
  <el-row class="form-row">
    <el-col :span="1">
      <div class="poem-item-full">
        <el-tag size="large">赏析</el-tag>
      </div>
    </el-col>
    <el-col :span="23">
      <el-space wrap>
        <div v-for="one in toadyPoem.translate">
          <span>{{ one }}</span>
        </div>
      </el-space>
    </el-col>
  </el-row>
</template>

<style scoped>
.form-row {
  width: 100vw;
  margin: 2rem 0;
  letter-spacing: 0.1rem;
}

.poem-item {
  margin: 0 1rem;
}

.poem-item-full {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 5px;
}

.ep-divider--horizontal {
  margin: 0;
}
</style>

