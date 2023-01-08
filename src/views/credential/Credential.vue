<script lang="ts" setup>
import {
  Plus, Search, Edit, InfoFilled, Iphone, Location,
  MapLocation, Message, QuestionFilled, Memo, Timer,
  Calendar, Link, User, Stamp,
} from '@element-plus/icons-vue';
import { ref, reactive, watchEffect } from 'vue';
import { useRoute, } from 'vue-router';
import { urlHelper } from '~/utils/urlHelper';

const baseUrl = import.meta.env.VITE_BASE_URL;

// console.log('credential');

const route = useRoute();
const searchData = reactive({
  pagination: {
    pageSize: 10,
    currentPage: 1,
  },
  formInline: {
    name: '',
    mainstay: '',
    alias: '',
  },
});
const pageData = ref({
  tableData: [],
  total: 0,
});

// TODO 设计查询参数回填
const hasQueryParams = Object.keys(route.query).length;
if (hasQueryParams) {
  // console.log(route.query);
  const pageSize = urlHelper.getQueryValue(route.query, "pageSize");
  if (pageSize) {
    searchData.pagination.pageSize = parseInt(pageSize);
  }
  const currentPage = urlHelper.getQueryValue(route.query, "currentPage");
  if (currentPage) {
    searchData.pagination.currentPage = parseInt(currentPage);
  }
  const name = urlHelper.getQueryValue(route.query, "name");
  if (name) {
    searchData.formInline.name = name;
  }
}

const searchCredential = async () => {
  // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
  // const API_URL = `${ApifoxHost}/credential`;
  const ApifoxHost = "";
  const API_URL = `${ApifoxHost}/credential/pageCredential`;
  const json = await urlHelper.getData(API_URL, searchData.pagination, searchData.formInline);
  // console.log(json);
  return json;
}

const doSearchCredential = async () => {
  // console.log('submit!');
  const respPageData = await searchCredential();
  pageData.value.tableData = respPageData.records;
  pageData.value.total = respPageData.total;
  // expands.value.push(respPageData.records[0].id);
};

watchEffect(async () => {
  // 该 effect 会立即运行，后期可以加入变化的值，当变化时会重新运行
  // const respPageData = await searchCredential();
  // pageData.value.tableData = respPageData.records;
  // pageData.value.total = respPageData.total;
  // expands.value.push(respPageData.records[0].id);
  await doSearchCredential();
});

const expands: any = ref([]);
// 展开行
const doExpandRow = (row: any, column: any, event: any) => {
  // console.log('doExpandRow');
  // console.log(row);
  // console.log(column);
  // console.log(event);
  if (expands.value.includes(row.id)) {
    // console.log('doExpandRow close');
    expands.value = expands.value.filter((val: any) => val !== row.id);
  } else {
    // console.log('doExpandRow open');
    expands.value = [];//添加该代码实现手风琴模式，删除该代码取消手风琴模式
    expands.value.push(row.id);
  }
};

//点击行展示
const clickRowHandle = (row: any, column: any, event: any) => {
  // console.log('clickRowHandle');
  doExpandRow(row, column, event);
};


</script>

<template >
  <div class="wzblog-credential-list-container">
    <breadcrumb />
    <el-form :inline="true" :model="searchData.formInline" class="demo-form-inline wz-cd-search-form"
      style="text-align: left;margin-top: 10px;">
      <el-form-item label="主体">
        <el-input v-model="searchData.formInline.mainstay" placeholder="主体" :prefix-icon="Stamp" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="searchData.formInline.name" placeholder="名称" :prefix-icon="Stamp" />
      </el-form-item>
      <el-form-item label="别名">
        <el-input v-model="searchData.formInline.alias" placeholder="别名" :prefix-icon="Stamp" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="doSearchCredential" style="width: 100px;">查询</el-button>
        <el-link :href="`${baseUrl}credential/add`" :icon="Plus" type="primary" style="margin-left: 20px;">
          <template #default>
            <span>添加凭据</span>
          </template>
        </el-link>
      </el-form-item>
    </el-form>
    <el-table :data="pageData.tableData" stripe row-key="id" :expand-row-keys="expands" @row-click="clickRowHandle"
      @expand-change="doExpandRow" highlight-current-row style="width: 100%; margin-top: 10px;" max-height="500" border>
      <el-table-column show-overflow-tooltip fixed prop="mainstay" label="主体" width="100" />
      <el-table-column show-overflow-tooltip fixed prop="name" label="名称" width="100" />
      <el-table-column fixed type="expand">
        <template #default="props">
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Stamp />
                </el-icon>
                主体
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.mainstay }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Stamp />
                </el-icon>
                名称
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.name }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Stamp />
                </el-icon>
                别名
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.alias }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Link />
                </el-icon>
                版本数
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.historyCount }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <user />
                </el-icon>
                创建人
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.createdBy }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Calendar />
                </el-icon>
                创建时间
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.createdTime }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <user />
                </el-icon>
                修改人
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.updatedBy }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Timer />
                </el-icon>
                修改时间
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.updatedTime }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Stamp />
                </el-icon>
                密码
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.password }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Stamp />
                </el-icon>
                密码提示
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.passwordSuggestion }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Link />
                </el-icon>
                网址
              </div>
            </el-col>
            <el-col :span="10">
              <div class="cell-item-value">{{ props.row.line?.url }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Location />
                </el-icon>
                创建地址
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.address }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <MapLocation />
                </el-icon>
                常用地址列表
              </div>
            </el-col>
            <el-col :span="16">
              <div class="cell-item-value">{{ props.row.line?.addressOftenList }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Iphone />
                </el-icon>
                手机号码
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.phone }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Iphone />
                </el-icon>
                安全手机列表
              </div>
            </el-col>
            <el-col :span="16">
              <div class="cell-item-value">{{ props.row.line?.phoneSafeList }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Message />
                </el-icon>
                电子邮箱
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.mail }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Message />
                </el-icon>
                安全邮箱列表
              </div>
            </el-col>
            <el-col :span="16">
              <div class="cell-item-value">{{ props.row.line?.mailSafeList }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
                安全问题1
              </div>
            </el-col>
            <el-col :span="14">
              <div class="cell-item-value">{{ props.row.line?.safeQuestionOne }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <InfoFilled />
                </el-icon>
                安全答案1
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cell-item-value">{{ props.row.line?.safeAnswerOne }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
                安全问题2
              </div>
            </el-col>
            <el-col :span="14">
              <div class="cell-item-value">{{ props.row.line?.safeAnswerTwo }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <InfoFilled />
                </el-icon>
                安全答案2
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cell-item-value">{{ props.row.line?.safeAnswerTwo }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
                安全问题3
              </div>
            </el-col>
            <el-col :span="14">
              <div class="cell-item-value">{{ props.row.line?.safeQuestionThree }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <InfoFilled />
                </el-icon>
                安全答案3
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cell-item-value">{{ props.row.line?.safeAnswerThree }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Memo />
                </el-icon>
                备注
              </div>
            </el-col>
            <el-col :span="22">
              <div class="cell-item-value">{{ props.row.line?.remark }}</div>
            </el-col>
          </el-row>
          <el-row class="form-row">
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <user />
                </el-icon>
                创建人
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.createdBy }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Calendar />
                </el-icon>
                创建时间
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.createdTime }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <user />
                </el-icon>
                修改人
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.updatedBy }}</div>
            </el-col>
            <el-col :span="2">
              <div class="cell-item-lable">
                <el-icon>
                  <Timer />
                </el-icon>
                修改时间
              </div>
            </el-col>
            <el-col :span="4">
              <div class="cell-item-value">{{ props.row.line?.updatedTime }}</div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="alias" label="别名" width="90" />
      <el-table-column show-overflow-tooltip prop="historyCount" label="版本数" width="70" />
      <el-table-column show-overflow-tooltip prop="line.password" label="密码" width="80" />
      <el-table-column show-overflow-tooltip prop="line.passwordSuggestion" label="密码提示" width="100" />
      <el-table-column show-overflow-tooltip prop="line.phone" label="手机号码" width="100" />
      <el-table-column show-overflow-tooltip prop="line.mail" label="电子邮箱" width="120" />
      <el-table-column show-overflow-tooltip prop="line.url" label="网址" width="120" />
      <el-table-column show-overflow-tooltip prop="line.address" label="创建地址" width="90" />
      <el-table-column show-overflow-tooltip prop="createdTime" label="创建时间" width="120" />
      <el-table-column show-overflow-tooltip prop="line.createdTime" label="行创建时间" width="120" />
      <!-- TODO 做成组件 -->
      <el-table-column label="备注" width="220">
        <template #default="{ row }">
          <el-popover title="备注" :content="row.line.remark" :width="300" placement="top-start" trigger="hover"
            :show-after="500">
            <template #reference>
              <span class="tooltipcell">
                {{ row.line.remark }}
              </span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="130">
        <template #default="{ row }">
          <el-link :href="`${baseUrl}credential/detail/${row.bizid}`" :icon="InfoFilled" type="primary" @click.stop="">
            详情
          </el-link>
          <el-link :href="`${baseUrl}credential/edit/${row.id}`" :icon="Edit" type="primary" @click.stop=""
            style="margin-left: 10px;">
            编辑
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination v-model:currentPage="searchData.pagination.currentPage"
        v-model:page-size="searchData.pagination.pageSize" :total="pageData.total"
        :page-sizes="[10, 20, 50, 100, 500, 1000]" :background="true"
        layout="total, sizes, prev, pager, next, jumper" />
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {

  .wzblog-credential-list-container {
    width: calc(100% - 12px);
    padding: 3px;
  }

  .tooltipcell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .form-row {
    margin: 0;
    width: calc(100vw - 95px);
  }

  .cell-item-lable {
    height: 100%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: end;
    padding-right: 5px;
    color: var(--ep-text-color-secondary);
    background-color: var(--ep-bg-color);
  }

  .cell-item-value {
    height: 100%;
    font-size: 12px;
    padding-left: 5px;
    background-color: var(--ep-fill-color-extra-light);
  }

  .wz-cd-search-form {
    padding: 0;
  }

  .wz-cd-search-form .ep-form-item {
    padding: 0;
    margin-bottom: 0;
  }
}
</style>

