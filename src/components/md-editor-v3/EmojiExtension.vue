<script lang="ts" setup>
import MdEditor from 'md-editor-v3'
import { reactive } from 'vue';
import type { PropType } from 'vue';
import { emojis } from './emojisData';

const DropdownToolbar = MdEditor.DropdownToolbar;

const props = defineProps({
  editorId: {
    type: String as PropType<string>,
    default: ''
  }
});

const emit = defineEmits(['onChange']);

const state = reactive({
  visible: false
});

const emojiHandler = (emoji: string) => {
  // 获取输入框
  const textarea = document.querySelector(
    `#${props.editorId}-textarea`
  ) as HTMLTextAreaElement;
  // 获取选中的内容
  const selection = window.getSelection()?.toString();
  // 获取鼠标位置
  const endPoint = textarea.selectionStart;

  // 根据鼠标位置分割旧文本
  // 前半部分
  const prefixStr = textarea.value.substring(0, endPoint);
  // 后半部分
  const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));

  emit('onChange', `${prefixStr}${emoji}${suffixStr}`);

  setTimeout(() => {
    textarea.setSelectionRange(endPoint, endPoint + 1);
    textarea.focus();
  }, 0);
};

const onChange = (visible: boolean) => {
  state.visible = visible;
};
</script>

<template>
  <dropdown-toolbar title="Emoji" :visible="state.visible" @on-change="onChange">
    <template #overlay>
      <div class="emoji-container radius">
        <span class="emojis" v-for="(emoji, index) of emojis" :key="`emoji-${index}`" @click="emojiHandler(emoji)"
          v-text="emoji"></span>
      </div>
    </template>
    <template #trigger>
      <span>😀</span>
    </template>
  </dropdown-toolbar>
</template>


<style scoped>
@media (min-width: 1024px) {
  .emoji-container {
    width: 300px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .emojis {
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .radius {
    border: 1px solid var(--ep-border-color);
    border-radius: 3px;
  }
}
</style>