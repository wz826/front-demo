/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_POSITION: string;
  // 更多环境变量...
  readonly VITE_BASE_URL: string;
  readonly VITE_OWNER: string;
  readonly VITE_APP_NAME: string;
  readonly VENUS_CONNECTION_TIMEOUT: string;
  readonly VENUS_WZBLOG_HOST: string;
  readonly VENUS_WZBLOG_WSL_HOST: string;
  readonly VENUS_ApifoxHost: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
