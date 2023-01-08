<script setup lang="ts">
import { Notebook, StarFilled, Plus, Search, Key, EditPen, } from '@element-plus/icons-vue';
import { ElLoading, ElNotification } from 'element-plus';
import "element-plus/theme-chalk/src/loading.scss";
import "element-plus/theme-chalk/src/notification.scss";
import "element-plus/theme-chalk/src/message-box.scss";
import "element-plus/theme-chalk/src/drawer.scss"; // 模板组件的样式加不加都一样
import { urlHelper } from '~/utils/urlHelper';
import { dataHelper } from '~/utils/DataHelper';
import { onBeforeRouteLeave, } from 'vue-router';
import { reactive, watchEffect, onBeforeMount, ref, watch } from 'vue';
import { isDark } from '~/composables';

// https://highlightjs.org/usage/
// 在md-editor-v3动态引入则不可切换主题
// 静态引入，则需要手动更新JS包，如果不手动指定包，则会打开外网资源，如果无外网则不可用
import highlight from 'highlight.js'; // 此处生效 
// stackoverflow-dark.css
// tokyo-night-dark.css
// monokai.css
// github-dark.css
// atom-one-dark.css
// base16/onedark.css
// base16/solarized-dark.css
// base16/windows-10.css
import 'highlight.js/styles/github-dark.css'; // 此处生效 
import prettier from 'prettier';
import parserMarkdown from 'prettier/parser-markdown';
// https://gitee.com/giteesuperman/cropperjs#installation
import cropperjs from 'cropperjs';
import 'cropperjs/dist/cropper.css';
// 引用screenfull
import screenfull from 'screenfull';
import mermaid from 'mermaid';
// https://katex.org/docs/node.html
import katex from 'katex';
import 'katex/dist/katex.min.css';

// mavonEditor基于markdown-it和auto-textarea 
// http://www.mavoneditor.com/
// https://gitee.com/mirrors_hinesboy/mavonEditor/blob/master/README-EN.md

// vue-markdown-marked和simplemde
// http://ckang1229.gitee.io/vue-markdown-editor/zh/

// 当前使用
// md-editor-v3
// https://imzbf.github.io/md-editor-v3/index
// https://gitee.com/devqianlong/md-editor-v3/blob/master/README-CN.md
import MdEditor, { HeadList } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import '~/assets/font/font_md-editor-v3.js';

// 自定义工具栏
import { toolbars } from '~/composables/md-editor-v3/toolbar';

// console.log('isDark' + isDark.value);
// http://wzblog.io:88/wzblog/node_modules/_highlight.js@11.6.0@highlight.js/styles/tokyo-night-dark.css
// const highlightcssPrefix = "/wzblog/node_modules/_highlight.js@11.6.0@highlight.js/styles";
// const highlightjsPrefix = "/wzblog/node_modules/_highlight.js@11.6.0@highlight.js/lib";
// const highlightcssPrefix = "/wzblog/highlight/css";
// const highlightjsPrefix = "/wzblog/node_modules/_highlight.js@11.6.0@highlight.js/lib";
MdEditor.config({
  editorExtensions: {
    highlight: {
      instance: highlight,
      // 在md-editor-v3动态引入则不可切换主题
      // 静态引入，则需要手动更新JS包，如果不手动指定包，则会打开外网资源，如果无外网则不可用
      // css: {
      //   oneDark: { // 似乎未生效
      //     light: `${highlightcssPrefix}/base16/one-light.css`,
      //     dark: `${highlightcssPrefix}/base16/onedark.css`,
      //   }
      // },
      // js: `${highlightjsPrefix}/index.js`,
    },
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown,
    },
    cropper: {
      instance: cropperjs,
    },
    screenfull: {
      instance: screenfull,
    },
    mermaid: {
      instance: mermaid,
    },
    katex: {
      instance: katex,
    }
  },
  markedRenderer(renderer) {
    renderer.heading = (text, level, raw, s, index) => {
      return `<h${level} id="heading-${index}">${text}</h${level}>`;
    };
    renderer.link = (href, title, text) => {
      return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
    };
    return renderer;
  },
});

const md: any = reactive({
  text: '',
  editorId: 'wzblog-md-editor-v3',
  theme: 'dark',
  previewTheme: 'github',
  // 在md-editor-v3动态引入则不可切换主题
  // 静态引入，则需要手动更新JS包，如果不手动指定包，则会打开外网资源，如果无外网则不可用
  // atom、a11y、github、gradient、kimbie、paraiso、qtcreator、stackoverflow
  codeTheme: 'oneDark', // 似乎未生效
  showCodeRowNumber: true,
  toolbars,
  footers: ['markdownTotal', '=', 0, 'scrollSwitch'],
  // 未生效
  // hljs: highlight,
  // screenfull,
  // mermaid,
  // katex,
  // TODO 后续做全局切换
  lang: 'zh-CN',
});

interface tagType {
  tagName: string;
  checked: boolean;
  type: string;
};
const notepadTagType = 'success';

interface notepadType {
  id: string;
  title: string;
  contentMd: string;
  contentHtml: string;
  keyword: string;
  catalog: string;
  tagDrawerVisible: boolean;
  tags: tagType[];
}

const notepad: notepadType = reactive({
  id: '',
  title: '',
  contentMd: '',
  contentHtml: '',
  keyword: '',
  catalog: '',
  tags: [],
  tagDrawerVisible: false,
});
const currTag = ref('');
const searchTagData = reactive({
  pagination: {
    pageSize: 10,
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
  notepad.tagDrawerVisible = true;
  // console.log(bizid.value);    
  // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
  const ApifoxHost = "";
  const API_URL = `${ApifoxHost}/notepadTag/pageNotepadTag`;
  const data = Object.assign({}, searchTagData.formInline, searchTagData.pagination);
  const json = await urlHelper.postData(API_URL, data);
  pageTagData.value.tableData = json.records;
  pageTagData.value.total = json.total;
  const tagsName = notepad.tags.map(tag => tag.tagName);
  pageTagData.value.tableData.forEach((pageTab: any) => {
    if (tagsName.includes(pageTab.tagName)) {
      pageTab.checked = true;
    }
  });
  // console.log(json);
};

watch(searchTagData, findPageTagData);

const startAdd = async (): Promise<any> => {
  // console.log(bizid.value);    
  // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
  const ApifoxHost = "";
  const API_URL = `${ApifoxHost}/notepad/startAdd`;
  const json = await urlHelper.getData(API_URL);
  // console.log(json);
  return json;
}

// 挂载前执行一次
onBeforeMount(async () => {
  const json = await startAdd();
  notepad.id = json.data.id;
});

// console.log(md);

watchEffect(async () => {
  // console.log(isDark.value);
  md.theme = isDark.value ? 'dark' : 'light';
});

const onUploadImg = async (files: any[], callback: (arg0: any[]) => void) => {
  // console.log("onUploadImg");
  // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
  // const API_URL = `${ApifoxHost}/credential`;
  const ApifoxHost = "";
  // const ApifoxHost = import.meta.env.VENUS_WZBLOG_HOST;
  const API_URL = `${ApifoxHost}/notepadImage/uploadImage`;
  const notepadImage = { notepadId: notepad.id };
  const res = await urlHelper.postImageData(API_URL, notepadImage, files);
  // console.log(res);
  // console.log(res[0]);
  // console.log(res[0].data);
  callback(res.map((item: any) => {
    const url = location.origin + '/' + item.data.imagePath;
    // console.log(url);
    return url;
  }));
};

const onChange = (v: string) => {
  if (!v.length) return;
  md.text = v;
  notepad.contentMd = v;
  hasChanged.value = true;
  console.log(!hasChanged.value);
};

const onHtmlChanged = (v: string) => {
  notepad.contentHtml = v;
};

const hasChanged = ref(false);
const hasSaved = ref(false);

onBeforeRouteLeave(async (to, from) => {
  if (hasSaved.value || !hasChanged.value) return true;
  try {
    await ElMessageBox.confirm('笔记未保存，确定离开吗？', '笔记未保存', {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    return true;
  } catch (e) {
    return false;
  }
});

const doSave = async () => {
  if (hasSaved.value) {
    ElMessageBox.alert('已经保存成功了！', '重复提交', {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: '确认',
      type: 'warning'
    });
    return false;
  };
  // console.log("doSave");
  const loading = ElLoading.service({
    lock: true,
    text: '保存中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  // console.log(notepad);
  // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
  const ApifoxHost = "";
  // const ApifoxHost = import.meta.env.VENUS_WZBLOG_HOST;
  const SAVE_CD_API_URL = `${ApifoxHost}/notepad/saveNote`;
  const json = await urlHelper.postData(SAVE_CD_API_URL, notepad);
  hasSaved.value = true;
  loading.close();
  ElNotification.success({
    title: '保存成功',
    message: '笔记保存成功',
    position: 'bottom-right',
  });
};

const onGetCatalog = (list: HeadList[]) => {
  //   console.log("onGetCatalog");
  //   console.log(list);
  notepad.catalog = JSON.stringify(list);
  if (dataHelper.isBlank(notepad.title)) {
    if (!dataHelper.isEmpty(list) && !dataHelper.isBlank(list[0].text)) {
      notepad.title = list[0].text;
    }
  }
};

const toSanitizeHtml = (html: string): string => {
  // TODO toSanitizeHtml
  // console.log("TODO toSanitizeHtml");
  return html;
};

const onCheckedTag = (curr_idx: number) => {
  //   console.log("onCheckedTag" + curr_idx);
  //   console.log(notepad.tags);
  notepad.tags.forEach((val, idx) => {
    if (idx === curr_idx) {
      val.checked = !val.checked;
      if (val.checked) {
        currTag.value = val.tagName;
      } else {
        currTag.value = '';
      }
      //   console.log(val);
    } else {
      val.checked = false;
    }
  });
  // checked.value = status
};

const onSelectedTag = (curr_idx: number) => {
  //   console.log("onCheckedTag" + curr_idx);
  const sel = pageTagData.value.tableData[curr_idx];
  const has = notepad.tags.filter((tag: any) => tag.tagName === sel.value);
  if (has.length) return;
  //   console.log(sel);
  // toggle checked
  if (sel.checked) {
    sel.checked = false;
    const checked = notepad.tags.filter(tag => tag.tagName === sel.tagName);
    if (checked.length) {
      const obj = checked[0];
      if (obj.checked) {
        currTag.value = '';
      }
      notepad.tags.splice(notepad.tags.indexOf(obj), 1)
    }
  } else {
    sel.checked = true;
    notepad.tags.push({
      tagName: sel.tagName,
      checked: sel.checked,
      type: notepadTagType,
    });
    currTag.value = sel.tagName;
    const checked = notepad.tags.filter(tag => tag.checked && tag.tagName !== currTag.value);
    if (checked.length) {
      checked[0].checked = false;
    }
  }
  hasChanged.value = true;
  // checked.value = status
};

const onCloseTag = (idx: number) => {
  //   console.log("onCloseTag" + idx);
  //   console.log(notepad.tags);
  const closeTag = notepad.tags[idx];
  //   console.log(closeTag);
  const dbchecked = pageTagData.value.tableData.filter((tag: any) => tag.tagName === closeTag.tagName);
  if (dbchecked.length) {
    //   console.log(dbchecked[0].checked);
    dbchecked[0].checked = false;
  }
  if (!closeTag.checked) {
    currTag.value = '';
  }
  notepad.tags.splice(idx, 1);
  // checked.value = status
};

const doEditTag = () => {
  //   console.log("doEditTag");
  if (!currTag.value) return;
  const has = notepad.tags.filter((tag: any) => tag.tagName === currTag.value);
  if (has.length) return;
  const newchecked = notepad.tags.filter(tag => tag.checked);
  if (newchecked.length) {
    newchecked[0].tagName = currTag.value;
  } else {
    notepad.tags.push({
      tagName: currTag.value,
      checked: true,
      type: 'success',
    });
    const dbchecked = pageTagData.value.tableData.filter((tag: any) => tag.tagName === currTag.value);
    if (dbchecked.length) {
      //   console.log(dbchecked[0].checked);
      dbchecked[0].checked = true;
    }
  }
  hasChanged.value = true;
  //   console.log(currTag.value);
  // checked.value = status
};

const onInputChange = (v: string) => {
  hasChanged.value = true;
}

</script>

<template>
  <div class="wzblog-notepad-add-bg">
    <breadcrumb />
    <div class="wzblog-notepad-add-panel">
      <div class="notepad-title">
        <el-row class="form-row">
          <el-col :span="2">
            <div class="poem-item-full">
              <el-tag size="large">笔记标题</el-tag>
            </div>
          </el-col>
          <el-col :span="22">
            <el-input v-model="notepad.title" @change="onInputChange" clearable placeholder="笔记标题"
              :prefix-icon="Notebook" />
          </el-col>
        </el-row>
      </div>
      <!-- :hljs="md.hljs" :screenfull="md.screenfull" :mermaid="md.mermaid" :katex="md.katex"  -->
      <md-editor v-model="md.text" :editor-id="md.editorId" :theme="md.theme" :preview-theme="md.previewTheme"
        :code-theme="md.codeTheme" :show-code-row-number="md.showCodeRowNumber" :language="md.lang"
        :footers="md.footers" :toolbars="md.toolbars" :preview="false" :onUploadImg="onUploadImg"
        :onHtmlChanged="onHtmlChanged" :onSave="doSave" :onChange="onChange" :sanitize="toSanitizeHtml"
        :onGetCatalog="onGetCatalog" no-iconfont class="notepad-md-body">
        <template #defToolbars>
          <mark-extension :editor-id="md.editorId" @on-change="onChange" />
          <emoji-extension :editor-id="md.editorId" @on-change="onChange" />
          <read-extension :md-text="md.text" />
        </template>
        <template #defFooters>
          <time-now />
        </template>
      </md-editor>
      <div class="notepad-title">
        <el-row class="form-row">
          <el-col :span="2">
            <div class="poem-item-full">
              <el-tag size="large">关键字</el-tag>
            </div>
          </el-col>
          <el-col :span="22">
            <el-input v-model="notepad.keyword" @change="onInputChange" clearable placeholder="关键字"
              :prefix-icon="Key" />
          </el-col>
        </el-row>
        <el-row class="form-row" style="margin-top: 20px;">
          <el-col :span="2">
            <div class="poem-item-full">
              <el-tag size="large">标签</el-tag>
            </div>
          </el-col>
          <el-col :span="22">
            <el-scrollbar height="50px" class="radius" noresize>
              <el-tag v-for="(tag, idx) in notepad.tags" :key="tag.tagName" :type="tag.type" style="margin: 2px 5px;">
                {{ tag.tagName }}
              </el-tag>
              <el-button type="primary" @click="findPageTagData()" :icon="EditPen" size="small">编辑标签
              </el-button>
            </el-scrollbar>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="20" style="margin: 50px 120px;">
        <el-col :span="24">
          <el-button type="primary" @click="doSave()" :icon="Plus" size="large">保存笔记</el-button>
        </el-col>
      </el-row>
      <el-dialog v-model="notepad.tagDrawerVisible" class="wzblog_tag_dialog" width="900px" align-center draggable>
        <template #header>
          <span class="align-V-center-H-left">
            <el-icon>
              <StarFilled />
            </el-icon>
            添加标签
          </span>
        </template>
        <el-row class="wzblog_tag_dialog-body" :gutter="20" style="margin: 0;">
          <el-col :span="12" class="notepadTagDataClass">
            <div class="notepadTagDataFormClass">
              <el-input v-model="currTag" class="tags-input" placeholder="编辑标签" :prefix-icon="StarFilled" />
              <el-button type="primary" @click="doEditTag()" :icon="Plus" size="small">编辑标签</el-button>
            </div>
            <div class="notepadTagDataScrollClass">
              <el-scrollbar height="200px" class="radius" noresize>
                <el-tag v-for="(tag, idx) in notepad.tags" :key="tag.tagName" :type="tag.type" closable
                  @close="onCloseTag(idx)" @click="onCheckedTag(idx)" :effect="tag.checked ? 'dark' : 'light'"
                  class="wzblog-tags">
                  {{ tag.tagName }}
                </el-tag>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="12" class="searchTagDataClass">
            <div class="searchTagDataFormClass">
              <el-input v-model="searchTagData.formInline.tagName" class="tags-input" placeholder="搜索全部标签"
                :prefix-icon="StarFilled" />
              <el-button type="primary" @click="doEditTag()" :icon="Search" size="small">搜索</el-button>
            </div>
            <div class="searchTagDataScrollClass">
              <el-scrollbar height="200px" class="radius" noresize>
                <el-tag v-for="(tag, idx) in pageTagData.tableData" :key="tag.tagName" @click="onSelectedTag(idx)"
                  :type="tag.type" :effect="tag.checked ? 'dark' : 'light'" class="wzblog-tags">
                  {{ tag.tagName }}
                </el-tag>
              </el-scrollbar>
            </div>
            <div class="searchTagDataPageClass">
              <el-pagination v-model:currentPage="searchTagData.pagination.currentPage"
                v-model:page-size="searchTagData.pagination.pageSize" :total="pageTagData.total"
                :page-sizes="[10, 20, 50, 100, 500, 1000]" small layout="total, prev, pager, next" />
            </div>
          </el-col>
        </el-row>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="notepad.tagDrawerVisible = false">完成</el-button>
          </span>
        </template>
      </el-dialog>
    </div> <!-- end wzblog-notepad-add-panel -->
  </div>
</template>



<style scoped>
.wzblog-notepad-add-bg {
  padding: 3px;
  width: calc(100% - 6px);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
}

.wzblog-notepad-add-panel {
  margin-top: 10px;
  margin-right: 100px;
  width: 80%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
  align-self: center;
}


.notepad-title {
  margin: 1rem 0;
  width: 100%;
  letter-spacing: 0.1rem;
}

.notepad-md-body {
  width: 100%;
}

.form-row {
  width: 100%;
}

.wzblog-tags {
  margin: 0.5rem 1rem;
}


.align-V-center-H-left {
  display: flex;
  align-items: center;
  justify-content: left;
}

:deep(.wzblog_tag_dialog .ep-dialog__body) {
  padding: 0;
}

.radius {
  border: 1px solid var(--ep-border-color);
  border-radius: 3px;
}

.poem-item-full {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 5px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.tags-input {
  width: 200px;
  height: 25px;
  margin-right: 10px;
}

.notepadTagDataScrollClass {
  margin-top: 5px;
}

.searchTagDataScrollClass {
  margin-top: 5px;
}
</style>
