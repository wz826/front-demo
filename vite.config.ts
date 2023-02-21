import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Unocss from "unocss/vite";
import { presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup, } from "unocss";
import requireTransform from "vite-plugin-require-transform";
import viteCompression from "vite-plugin-compression";

const pathSrc = path.resolve(__dirname, "src");

export default ({ mode }: ConfigEnv): UserConfigExport => {
  /*
   * 我们可以通过mode直接判断当前是不是生产环境，
   * 注意mode可以在运行指令中指定：`vite build --mode production`，
   * 如果没有指定，那默认打包就是production
   */
  const isPro = mode === "production";
  const root = process.cwd();
  const envDir = "/viteEnv";
  // //这个时候，我们可以将VITE_、VENUS_开头的变量透传给客户端
  const envPrefix = ["VITE_", "VENUS_"];
  const env = loadEnv(mode, root + envDir, envPrefix);
  // console.log(env);
  // elkjs实在是太大了，依赖路径：elkjs ==> mermaid ==> md-editor-v3
  const bigPkgNames = ["elkjs", "highlight.js", "mermaid", "prettier", "element-plus", "cytoscape", "katex", "md-editor-v3", "rsocket-core", 
    "vue", "fortawesome", "lodash", "moment", "dexie", "font_md-editor-v3", "cropperjs", "vuedraggable", "sortablejs", "dagre-d3-es",];   
  const pkgSet = new Set();
  const userConfig: UserConfigExport = defineConfig({
    base: env.VITE_BASE_URL,
    envDir: env.VITE_ENV_DIR,
    envPrefix: envPrefix,
    server: {
      port: 88,
      strictPort: true,
    },
    build: {
      outDir: "dist/wzblog",
      assetsDir: "static/",
      chunkSizeWarningLimit: 1024,
      sourcemap: false, // 生成map会报错，暂时不生成了
      minify: "terser",
      target: "esnext",
      terserOptions: {
        compress: {
          // 有些需要输出的广告
          drop_console: false,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("node_modules")) {
              // console.log(id); TODO 后期可以优化，只选择有@符号的字符串元素
              const arr = id.split("node_modules/")[1].split("/")[1].split("@");
              // console.log(arr);
              const pkg = arr.shift();
              if (pkg && bigPkgNames.includes(pkg)) {
                return "_" + pkg;
              } else {
                pkgSet.add(pkg);
                // console.log(pkgSet);
                return "__vendor";
              }
            }
          },
          chunkFileNames: "static/chunks/[name]-[hash].js",
          entryFileNames: "static/entrys/[name]-[hash].js",
          assetFileNames: "static/assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    resolve: {
      alias: {
        "~/": `${pathSrc}/`,
      },
      extensions: [".ts", ".js", ".vue", ".json", ".mjs"], // TODO 似乎没什么用 2022年10月15日 12:14:28
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/element/index.scss" as *;`,
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass",
          }),
        ],
        dts: "src/auto-imports.d.ts",
      }),
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass",
          }),
        ],
        dts: "src/components.d.ts",
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss({
        presets: [
          presetUno(),
          presetAttributify(),
          presetIcons({
            scale: 1.2,
            warn: true,
          }),
        ],
        transformers: [transformerDirectives(), transformerVariantGroup()],
      }),
      // vite项目不支持require语法问题解决 require is not defined
      // Vite默认使用es6标准的 import 的导入方式，不支持require引入。默认有Vite自己的引入方式https://vitejs.cn/guide/assets.html
      // 但在在日常使用Vue3+Ts+Vite构建项目中,部分比较旧的三方插件中默认使用的是require引入(webpack构建可以使用),会出现require方法报错的兼容性问题 require is not defined 。
      requireTransform({
        fileRegex: /.ts$|.tsx$|.vue$/,
      }),
      viteCompression({
        threshold: 10240, // 对大于 10KB 的文件进行压缩, 只处理比这个值大的资源，按字节算
        algorithm: "gzip", // brotliCompress新压缩算法更高压缩率:注意需要服务器支持https 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
        deleteOriginFile: false, // 删除原文件：注意不能删除原件，nginx暂时不支持无原件
      }),
    ], // end plugins
  });
  // console.log(pkgSet);
  return userConfig;
};
