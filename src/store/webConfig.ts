import { defineStore } from "pinia";
import { ref } from "vue";

const WzBlog_WebConfig_Key: string = 'wzblog_WebConfig_Key_20221122';
interface WebConfigType {
  isWebFullScreen: boolean;
  isOfflineMode: boolean;
  isHideAside: boolean;
  theme: string;
  previewTheme: string;
  codeTheme: string;
  lang: string;
}

export const useWebConfigStore = defineStore("webConfig", () => {
  const webConfig: WebConfigType = JSON.parse(localStorage.getItem(WzBlog_WebConfig_Key) || '{}');

  {
    // TODO 后续做全局切换
    webConfig.lang = 'zh-CN';
    webConfig.codeTheme = 'atom';
    webConfig.previewTheme = 'default';
    webConfig.theme = 'dark';
  }

  const isWebFullScreen = ref(webConfig.isWebFullScreen);
  const toggleWebFullScreen = () => {
    isWebFullScreen.value = !isWebFullScreen.value;
    webConfig.isOfflineMode = isWebFullScreen.value;
    localStorage.setItem(WzBlog_WebConfig_Key, JSON.stringify(webConfig));
  };

  const isOfflineMode = ref(webConfig.isOfflineMode);
  const toggleOfflineMode = () => {
    isOfflineMode.value = !isOfflineMode.value;
    webConfig.isOfflineMode = isOfflineMode.value;
    localStorage.setItem(WzBlog_WebConfig_Key, JSON.stringify(webConfig));
  };

  const isHideAside = ref(webConfig.isHideAside);
  const toggleAside = () => {
    isHideAside.value = !isHideAside.value;
    webConfig.isHideAside = isHideAside.value;
    localStorage.setItem(WzBlog_WebConfig_Key, JSON.stringify(webConfig));
  };

  return {
    webConfig,
    isWebFullScreen, toggleWebFullScreen,
    isOfflineMode, toggleOfflineMode,
    isHideAside, toggleAside,
  };
});
