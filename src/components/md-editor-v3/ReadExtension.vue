<script lang="ts" setup>
import { faEye } from "@fortawesome/free-solid-svg-icons";
import MdEditor, { Themes } from 'md-editor-v3'
import { reactive, watchEffect } from 'vue';
import type { PropType } from 'vue';
import { isDark } from '~/composables';


const ModalToolbar = MdEditor.ModalToolbar;

const props = defineProps({
  mdText: {
    type: String as PropType<string>,
    default: ''
  }
});

const state = reactive({
  visible: false,
  modalFullscreen: false,
  theme: 'dark' as Themes,
  previewTheme: "vuepress",
  codeTheme: "oneDark",
  lang: "zh-CN",
});

watchEffect(() => {
  // console.log(isDark.value);
  state.theme = isDark.value ? 'dark' : 'light';
});

</script>

<template>
  <modal-toolbar :visible="state.visible" :is-fullscreen="state.modalFullscreen" show-adjust title="预览"
    modal-title="编辑预览" width="870px" height="600px" @on-click="state.visible = true" @on-close="state.visible = false"
    @on-adjust="state.modalFullscreen = !state.modalFullscreen">
    <div v-if="state.visible" style="height: 100%; padding: 20px; overflow: auto">
      <md-editor :model-value="props.mdText" :language="state.lang" :preview-theme="state.previewTheme"
        :code-theme="state.codeTheme" editor-id="edit2preview" preview-only show-code-row-number :theme="state.theme" />
    </div>
    <template #trigger>
      <font-awesome-icon :icon="faEye" class="icon"> </font-awesome-icon>
    </template>
  </modal-toolbar>
</template>