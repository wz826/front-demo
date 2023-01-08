<script setup lang="ts">
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { Notebook, Collection, FullScreen, } from '@element-plus/icons-vue';
import { onBeforeMount, onMounted, reactive, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { urlHelper } from '~/utils/urlHelper';
import { dataHelper } from '~/utils/DataHelper';
import { useWebConfigStore } from '~/store/webConfig';
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

// prettier
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
import '~/assets/font/font_md-editor-v3.js'
import MdEditor, { HeadList } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

// /wzblog/
const baseUrl = import.meta.env.BASE_URL;

const route = useRoute();
const id = route.params.id;

//  console.log(id);

const router = useRouter();

// console.log('isDark' + isDark.value);

MdEditor.config({
  editorExtensions: {
    highlight: {
      instance: highlight,
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

const previewThemeKey = "wzblog-md-editor-v3-previewThemeKey";

const md: any = reactive({
  previewOnly: true,
  text: '',
  editorId: 'wzblog-md-editor-v3',
  theme: 'dark',
  // 'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis'
  previewTheme: localStorage.getItem(previewThemeKey) || 'mk-cute',
  // 在md-editor-v3动态引入则不可切换主题
  // 静态引入，则需要手动更新JS包，如果不手动指定包，则会打开外网资源，如果无外网则不可用
  // atom、a11y、github、gradient、kimbie、paraiso、qtcreator、stackoverflow
  codeTheme: 'oneDark', // 似乎未生效
  // codeTheme: 'oneDark', // 似乎未生效
  showCodeRowNumber: true,
  // TODO 后续做全局切换
  lang: "zh-CN",
});

// console.log(md);

watchEffect(() => {
  // console.log(isDark.value);
  md.theme = isDark.value ? 'dark' : 'light';
});

const onPreviewThemeChange = () => {
  localStorage.setItem(previewThemeKey, md.previewTheme);
};

const getOneNote = async (): Promise<any> => {
  // console.log(bizid.value);    
  // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
  // const notepadid = '9233019a940945b7aa5234e44a87c339';
  //   console.log(id);
  const ApifoxHost = "";
  const API_URL = `${ApifoxHost}/notepad/getOneNote/${id}`;
  const json = await urlHelper.getData(API_URL);
  // console.log(json);
  return json;
}

const notepad: any = reactive({
  id: '',
  title: '',
  contentMd: '',
  contentHtml: '',
  keyword: '',
  catalog: '',
  tag: '',
  createdBy: '',
  createdTime: '',
  updatedTime: '',
  tags: [],
  catalogs: [],
  catalogsVisible: true,
});

interface tagType {
  tagName: string;
  checked: boolean;
  type: string;
};
const notepadTagType = 'success';

// 挂载前执行一次
onBeforeMount(async () => {
  const json = await getOneNote();
  md.text = json.data.contentMd;
  // console.log(md.text);
  notepad.id = json.data.id;
  notepad.title = json.data.title;
  notepad.contentMd = json.data.contentMd;
  notepad.contentHtml = json.data.contentHtml;
  notepad.keyword = json.data.keyword;
  notepad.catalog = json.data.catalog;
  notepad.createdBy = json.data.createdBy;
  notepad.createdTime = json.data.createdTime;
  notepad.updatedTime = json.data.updatedTime;
  notepad.tags = json.data.tags;
  notepad.tags.forEach((tag: any) => tag.type = notepadTagType);
  buildGetCatalog(notepad);
  const originTitle = document.title;
  // TODO DONE 未生效 异步事件要写在异步中
  const blogTitle = notepad.title;
  // console.log(blogTitle);
  document.title = `${blogTitle} ${originTitle}`;
});

onMounted(() => {
  // TODO 不应该在渲染后更改，凡事应该先找源头修改
  // document.querySelectorAll(`${md.editorId} a`).forEach(el => el.setAttribute('target', 'blank'));
});

const buildGetCatalog = (notepad: {
  catalogs: { hash: string; text: string; }[]; catalog: string; contentMd: string;
}) => {
  //   console.log("buildGetCatalog");
  if (!dataHelper.isEmpty(notepad.catalog)) {
    const catalogs = JSON.parse(notepad.catalog)
      .map((catalog: HeadList, idx: number) => ({ hash: `#heading-${idx + 1}`, text: catalog.text, level: catalog.level }))
      // TODO 暂时只显示一级目录
      .filter((catalog: HeadList, idx: number) => catalog.level < 2);
    notepad.catalogs = catalogs;
    // console.log("buildGetCatalog notepad.catalog");
    // console.log(notepad.catalogs);
  } else {
    if (!dataHelper.isEmpty(notepad.contentMd)) {
      const lines = notepad.contentMd.split(/[(\r\n)\r\n]+/);
      var headPatt = /#\s+/;
      // 目前还无法识别非目录#，如：代码中的#
      const catalogs = lines
        .filter(line => headPatt.test(line))
        .map((line, idx) => ({ hash: `#heading-${idx + 1}`, text: line.slice(2) }));
      notepad.catalogs = catalogs;
      // console.log(notepad.catalog);
    }
  }
};

const jumpToCatalog = (hash: string) => {
  // TODO 考虑做路径进行的也导航到对应大纲
  router.replace(`${hash}`);
  const options: ScrollIntoViewOptions = {
    behavior: "smooth", // 平滑过渡
    block: "start", // 上边框与视窗顶部平齐。默认值
    inline: "nearest",
  };
  document.querySelector(hash)?.scrollIntoView(options);
};

// TODO MdCatalog当文档中出现数学公式时会解析失败
const MdCatalog = MdEditor.MdCatalog;

const isInvertImg = ref(false);
const invertImg = () => {
  isInvertImg.value = !isInvertImg.value;
  document.querySelectorAll(`#${md.editorId} img`)
    .forEach(ele => {
      const img = ele as HTMLImageElement;
      img.style.filter = `invert(${isInvertImg.value ? 1 : 0})`;
    });
}

</script>

<template>
  <div class="wzblog-notepad-detail-container" :class="useWebConfigStore().isWebFullScreen ? 'is-full-screen' : ''">
    <breadcrumb v-if="!useWebConfigStore().isWebFullScreen" />
    <div class="wzblog-notepad-detail-panel" :class="useWebConfigStore().isWebFullScreen ? 'is-full-screen' : ''">
      <el-row class="notepad-head">
        <el-row class="notepad-theme">
          <el-tag>
            <el-icon>
              <Collection />
            </el-icon>
            主题
          </el-tag>
          <el-radio-group class="notepad-theme-group" v-model="md.previewTheme" @change="onPreviewThemeChange">
            <el-radio-button label="default" />
            <el-radio-button label="github" />
            <el-radio-button label="vuepress" />
            <el-radio-button label="mk-cute" />
            <el-radio-button label="smart-blue" />
            <el-radio-button label="cyanosis" />
          </el-radio-group>
          <el-button type="primary" @click="invertImg" class="web-full-btn">
            <template #default>
              <el-icon>
                <font-awesome-icon :icon="faImage" class="icon"></font-awesome-icon>
              </el-icon>
              <span v-text="isInvertImg ? '原始图片' : '反色图片'"></span>
            </template>
          </el-button>
          <el-button type="primary" :icon="FullScreen" @click="useWebConfigStore().toggleWebFullScreen"
            class="web-full-btn">
            {{ useWebConfigStore().isWebFullScreen ? "退出全屏" : "网页全屏" }}
          </el-button>
        </el-row>
        <el-row class="notepad-title">
          <el-link type="info" :href="`${baseUrl}notepad/detail/${id}`">
            <template #icon>
              <div class="notepad-title-body">
                <el-icon>
                  <Notebook />
                </el-icon>
                <span>{{ notepad.title }}</span>
              </div>
            </template>
          </el-link>
        </el-row>
        <el-row class="notepad-attachment">
          <el-tag>作者</el-tag>
          <el-tag>{{ notepad.createdBy || '匿名' }}</el-tag>
          <el-tag>创建时间</el-tag>
          <el-tag>{{ notepad.createdTime }}</el-tag>
          <el-tag>更新时间</el-tag>
          <el-tag>{{ notepad.updatedTime }}</el-tag>
          <el-tag size="default">标签</el-tag>
          <el-tag v-for="(tag, idx) in notepad.tags" :key="tag.tagName" :type="tag.type" style="margin: 2px 5px;">
            {{ tag.tagName }}
          </el-tag>
        </el-row>
      </el-row>
      <div class="wzblog-notepad-body-panel">
        <md-editor :modelValue="md.text" :editor-id="md.editorId" :previewOnly="md.previewOnly" :theme="md.theme"
          :show-code-row-number="md.showCodeRowNumber" :preview-theme="md.previewTheme" :code-theme="md.codeTheme"
          :language="md.lang" no-iconfont class="wzblog-notepad-body"
          :class="useWebConfigStore().isWebFullScreen ? 'is-full-screen' : ''">
        </md-editor>
      </div>
      <div class="wzblog-notepad-fix-nav" v-if="notepad.catalogs?.length">
        <div class="wzblog-outlook-panel" :style="{ left: notepad.catalogsVisible ? '' : '-50px' }">
          <el-switch active-text="大纲" inactive-text="大纲" v-model="notepad.catalogsVisible" size="large" inline-prompt />
          <el-scrollbar v-if="notepad.catalogsVisible" max-height="calc(100vh - var(--wzblog-outlook-bottom-y))"
            class="wzblog-notepad-fix-scroll">
            <!-- TODO MdCatalog当文档中出现数学公式时会解析失败
                  <MdCatalog :editor-id="md.editorId" :theme="md.theme" /> -->
            <div class="wzblog-notepad-catalogs">
              <el-button v-for="(catalog, idx) in notepad.catalogs" @click="jumpToCatalog(catalog.hash)"
                :key="catalog.hash" :link="true">
                <template #default>
                  <el-tooltip class="box-item" effect="dark" :content="catalog.text" placement="left-start">
                    <span class="wzblog-outlook-span" v-text="catalog.text"></span>
                  </el-tooltip>
                </template>
              </el-button>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div> <!-- end wzblog-notepad-detail-panel -->
  </div>
</template>


<style scoped>
.wzblog-notepad-detail-container {
  padding: 3px;
  width: calc(100% - 12px);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
}

.wzblog-notepad-detail-panel {
  margin-top: 5px;
  margin-left: 50px;
  width: calc(100% - 300px);
  min-height: 500px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
}

.is-full-screen {
  margin: 0;
  padding: 0;
  width: 100%;
}

.wzblog-notepad-fix-nav {
  --wzblog-outlook-bottom-y: 150px;
  --wzblog-outlook-max-width: 200px;
  --wzblog-outlook-left: -200px;
  --wzblog-outlook-z-index: 31;
  position: fixed;
  right: 10px;
  top: 65px;
  height: calc(100vh - var(--wzblog-outlook-bottom-y));
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.wzblog-outlook-panel {
  position: absolute;
  left: var(--wzblog-outlook-left);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.wzblog-notepad-fix-scroll {
  overflow-x: hidden;
}

.wzblog-notepad-catalogs {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wzblog-notepad-catalogs .ep-button {
  margin: 0;
  padding: 0;
  width: var(--wzblog-outlook-max-width);
  text-align: left;
}

.wzblog-notepad-catalogs .ep-button:not(:first-child) {
  margin-top: 5px;
}

.wzblog-outlook-span {
  width: var(--wzblog-outlook-max-width);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notepad-head {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
}

.wzblog-notepad-body-panel {
  width: 100%;
}

.wzblog-notepad-body {
  padding: 5px;
}

.notepad-theme {
  align-self: flex-end;
  align-items: center;
}

.notepad-title {
  margin: 0;
  letter-spacing: 0.1rem;
}

.notepad-title-body {
  font: 2em sans-serif;
  line-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.notepad-title-body .ep-icon {
  height: 2rem;
  line-height: 2.5rem;
  display: flex;
  align-items: end;
  justify-content: flex-start;
}

.notepad-attachment {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.notepad-attachment span {
  margin-right: 5px;
}

:deep(.notepad-theme .ep-tag__content) {
  display: flex;
  align-items: center;
}

.notepad-theme-group {
  margin-left: 1rem;
}

:deep(.notepad-theme-group .ep-radio-button__inner) {
  padding: 3px 5px;
}

.web-full-btn {
  margin: 0 20px;
  padding: 3px 5px;
  height: 24px;
}
</style>

