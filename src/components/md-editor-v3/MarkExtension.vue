<script setup lang="ts">
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import MdEditor from 'md-editor-v3'
import type { PropType } from 'vue';

const NormalToolbar = MdEditor.NormalToolbar;

const props = defineProps({
  editorId: {
    type: String as PropType<string>,
    default: ''
  }
});

const emit = defineEmits(['onChange']);

const markHandler = () => {
  // 获取输入框
  const textarea = document.querySelector(
    `#${props.editorId}-textarea`
  ) as HTMLTextAreaElement;
  // 获取选中的内容
  const selection = window.getSelection()?.toString();
  // 获取鼠标位置
  const endPoint = textarea.selectionStart;

  // 生成标记文本
  const markStr = `@${selection}@`;

  // 根据鼠标位置分割旧文本
  // 前半部分
  const prefixStr = textarea.value.substring(0, endPoint);
  // 后半部分
  const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));

  emit('onChange', `${prefixStr}${markStr}${suffixStr}`);

  setTimeout(() => {
    textarea.setSelectionRange(endPoint, markStr.length + endPoint);
    textarea.focus();
  }, 0);
};
</script>

<template>
  <normal-toolbar title="Mark" @on-click="markHandler">
    <template #trigger>
      <font-awesome-icon :icon="faBookmark" class="icon"> </font-awesome-icon>
    </template>
  </normal-toolbar>
</template>