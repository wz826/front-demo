<script lang="ts" setup>
import { Search, Edit, Notebook, Key, Reading, } from '@element-plus/icons-vue';
import { faChevronLeft, faChevronRight, faList, faPencil, } from "@fortawesome/free-solid-svg-icons";
import { ref, reactive, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { urlHelper } from '~/utils/urlHelper';

//  console.log('notepad');
const baseUrl = import.meta.env.VITE_BASE_URL;

const route = useRoute();

interface tagType {
  tagName: string;
  checked: boolean;
  type: string;
};
const notepadTagType = 'success';

const searchData: any = reactive({
  pagination: {
    pageSize: 10,
    currentPage: 1,
  },
  formInline: {
    title: '',
    contentMd: '',
    keyword: '',
    tags: [],
    noTag: false,
  },
});
const pageData = ref({
  tableData: [],
  total: 0,
  tableLayout: 'auto',
});
const searchTagData = reactive({
  pagination: {
    pageSize: 50,
    currentPage: 1,
  },
  formInline: {
    tagName: '',
  },
});
const pageTagData: any = ref({
  tableData: [],
  total: 0,
});

const findPageTagData = async () => {
  // console.log(bizid.value);    
  // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
  const ApifoxHost = "";
  const API_URL = `${ApifoxHost}/notepadTag/pageUseNotepadTag`;
  const data = Object.assign({}, searchTagData.formInline, searchTagData.pagination);
  const json = await urlHelper.postData(API_URL, data);
  pageTagData.value.tableData = json.records;
  pageTagData.value.total = json.total;
  const tagsName = searchData.formInline.tags.map((tag: any) => tag.tagName);
  pageTagData.value.tableData.forEach((pageTab: any) => {
    if (tagsName.includes(pageTab.tagName)) {
      pageTab.checked = true;
    }
  });
  // console.log(json);
};

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
  const title = urlHelper.getQueryValue(route.query, "title");
  if (title) {
    searchData.formInline.title = title;
  }
}

const searchNotepad = async () => {
  // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
  // const API_URL = `${ApifoxHost}/notepad`;
  const ApifoxHost = "";
  const API_URL = `${ApifoxHost}/notepad/pageNotepad`;
  const data = Object.assign({}, searchData.formInline, searchData.pagination);
  const json = await urlHelper.postData(API_URL, data);
  // console.log(json);
  return json;
}

const doSearchNotepad = async () => {
  // console.log('doSearch!');
  const respPageData = await searchNotepad();
  pageData.value.tableData = respPageData.records;
  pageData.value.total = respPageData.total;
  // expands.value.push(respPageData.records[0].id);
};

// 多个监听要分开放置
watchEffect(async () => {
  // 该 effect 会立即运行，后期可以加入变化的值，当变化时会重新运行
  await doSearchNotepad();
});

// 多个监听要分开放置
watchEffect(async () => {
  // 该 effect 会立即运行，后期可以加入变化的值，当变化时会重新运行
  await findPageTagData();
});

const onSelectedTag = (curr_idx: number) => {
  // console.log("onCheckedTag" + curr_idx);
  const sel = pageTagData.value.tableData[curr_idx];
  const has = searchData.formInline.tags.filter((tag: any) => tag.tagName === sel.value);
  if (has.length) return;
  // console.log(sel);
  // toggle checked
  if (sel.checked) {
    sel.checked = false;
    const checked = searchData.formInline.tags.filter((tag: any) => tag.tagName === sel.tagName);
    if (checked.length) {
      const obj = checked[0];
      searchData.formInline.tags.splice(searchData.formInline.tags.indexOf(obj), 1)
    }
  } else {
    sel.checked = true;
    searchData.formInline.tags.push({
      tagName: sel.tagName,
      checked: sel.checked,
      type: notepadTagType,
    });
  }
  // checked.value = status
};


const onCloseTag = (idx: number) => {
  // console.log("onCloseTag" + idx);
  // console.log(searchData.formInline.tags);
  const closeTag = searchData.formInline.tags[idx];
  // console.log(closeTag);
  const dbchecked = pageTagData.value.tableData.filter((tag: any) => tag.tagName === closeTag.tagName);
  if (dbchecked.length) {
    // console.log(dbchecked[0].checked);
    dbchecked[0].checked = false;
  }
  searchData.formInline.tags.splice(idx, 1);
  // checked.value = status
};


</script>

<template >
  <div class="wzblog-notepad-list-container">
    <breadcrumb />
    <div class="wz-notepad-list-panel">
      <el-row class="wz-notepad-search-condition-panel">
        <el-row class="formInline">
          <div class="tags-key">
            <el-tag size="default">查询条件</el-tag>
          </div>
          <div class="tags-info">
            <el-input v-model="searchData.formInline.title" placeholder="标题" clearable
              class="wz-notepad-input wz-notepad-condition-item">
              <template #prefix>
                <font-awesome-icon :icon="faList" class="icon"></font-awesome-icon>
              </template>
            </el-input>
            <el-input v-model="searchData.formInline.contentMd" placeholder="内容" :prefix-icon="Reading" clearable
              class="wz-notepad-input wz-notepad-condition-item" />
            <el-input v-model="searchData.formInline.keyword" placeholder="关键字" :prefix-icon="Key" clearable
              class="wz-notepad-input wz-notepad-condition-item" />
            <el-button type="info" round plain :icon="Search" @click="doSearchNotepad"
              class="wz-notepad-btn-search wz-notepad-condition-item">
              查询
            </el-button>
            <el-link :href="`${baseUrl}notepad/add`" type="primary" class="wz-notepad-condition-item">
              <template #default>
                <font-awesome-icon :icon="faPencil" class="icon"></font-awesome-icon>
                <span>写笔记</span>
              </template>
            </el-link>
          </div>
        </el-row>
        <el-row class="tags">
          <el-row class="tags-selected">
            <div class="tags-key">
              <el-tag size="default">已选择的标签</el-tag>
            </div>
            <div class="tags-info">
              <el-switch v-model="searchData.formInline.noTag" active-text="无标签" inactive-text="无标签" inline-prompt />
              <el-tag v-for="(tag, idx) in searchData.formInline.tags" :key="tag.tagName" :type="tag.type" closable
                @close="onCloseTag(idx)" style="margin: 2px 5px;">
                {{ tag.tagName }}
              </el-tag>
            </div>
          </el-row>
        </el-row>
      </el-row>
      <div class="wzblog-notepad-list-body-panel">
        <div class="wzblog-notepad-list-body-tags">
          <div class="tags-key">
            <el-tag size="default">全部标签</el-tag>
          </div>
          <div class="tags-resources">
            <el-tag v-for="(tag, idx) in pageTagData.tableData" :key="tag.tagName" :type="tag.type"
              @click="onSelectedTag(idx)" :effect="tag.checked ? 'dark' : 'light'">
              {{ tag.tagName }}
            </el-tag>
          </div>
          <el-pagination class="tags-resources-page" v-model:currentPage="searchTagData.pagination.currentPage"
            v-model:page-size="searchTagData.pagination.pageSize" :total="pageTagData.total" layout="slot" small>
            <template #default>
              <div class="tags-resources-page-oper">
                <span v-text="`${pageTagData.total}条`"></span>
                <font-awesome-icon
                  @click.stop="searchTagData.pagination.currentPage > 1 && --searchTagData.pagination.currentPage"
                  :icon="faChevronLeft" class="icon tags-resources-page-oper-btn">
                </font-awesome-icon>
                <span v-text="searchTagData.pagination.currentPage"></span>
                <font-awesome-icon
                  @click.stop="searchTagData.pagination.currentPage < Math.ceil(pageTagData.total / searchTagData.pagination.pageSize) && ++searchTagData.pagination.currentPage"
                  :icon="faChevronRight" class="icon tags-resources-page-oper-btn">
                </font-awesome-icon>
                <span v-text="`${Math.ceil(pageTagData.total / searchTagData.pagination.pageSize)}页`"></span>
              </div>
            </template>
          </el-pagination>
        </div>
        <div class="wzblog-notepad-list-body">
          <el-table :data="pageData.tableData" stripe row-key="id" highlight-current-row :flexible="true"
            :table-layout="pageData.tableLayout" class="wzblog-nodepad-list-table" max-height="500">
            <el-table-column show-overflow-tooltip label="标题" min-width="500">
              <template #default="{ row }">
                <el-link :href="`${baseUrl}notepad/detail/${row.id}`" :icon="Notebook" type="info">{{ row.title }}
                </el-link>
                <span class="wz-notepad-attachment">
                  <span class="wz-notepad-attachment-item" v-text="row.createdTime.substring(0, 10)"></span>
                  <span class="wz-notepad-attachment-item" v-text="row.createdBy"></span>
                  <span class="wz-notepad-attachment-item" v-text="row.keyword"></span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="100">
              <template #default="{ row }">
                <span v-text="row.updatedTime.substring(0, 10)"></span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template #default="{ row }">
                <el-link :href="`${baseUrl}notepad/edit/${row.id}`" :icon="Edit" type="primary">编辑</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :total="pageData.total" v-model:currentPage="searchData.pagination.currentPage"
            v-model:page-size="searchData.pagination.pageSize" :page-sizes="[10, 20, 50, 100, 500, 1000]"
            layout="total, sizes, prev, pager, next, jumper" />
        </div> <!-- end div wzblog-notepad-list-body -->
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {

  .wzblog-notepad-list-container {
    width: calc(100% - 12px);
    padding: 3px;
  }

  .wz-notepad-list-panel {
    margin-top: 10px;
  }

  .wz-notepad-search-condition-panel {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
  }

  .wz-notepad-input {
    width: 200px;
    height: 25px;
  }

  .wz-notepad-btn-search {
    padding: 0;
    width: 70px;
    height: 25px;
  }

  .wz-notepad-condition-item {
    margin-left: 10px;
  }

  .wz-notepad-condition-item:first-child {
    margin-left: 0;
  }

  .tags {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: center;
    align-items: flex-start;
  }

  .tags-selected {
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .tags-key {
    width: 100px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
  }

  .tags-info {
    margin-left: 5px;
  }

  .wzblog-nodepad-list-table {
    width: 100%;
  }

  .wz-notepad-attachment {
    margin-left: 10px;
    color: var(--ep-color-info-light-5);
  }

  .wz-notepad-attachment-item {
    margin-left: 5px;
  }

  .wzblog-notepad-list-body-panel {
    display: flex;
  }

  .wzblog-notepad-list-body {
    width: calc(100% - 150px);
  }

  .wzblog-notepad-list-body-tags {
    width: 150px;
  }

  .tags-resources {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .tags-resources .ep-tag {
    margin: 0 3px 3px 0;
    padding: 0px 3px;
    height: 18px;
    cursor: pointer;
  }

  .tags-resources-page {
    margin: 10px 0 0 10px;
  }

  .tags-resources-page-oper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .tags-resources-page-oper-btn {
    margin: 0 5px;
    padding: 0 3px;
    cursor: pointer;
  }

}
</style>

