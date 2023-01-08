import dayjs from "dayjs";
import { dataHelper } from "~/utils/DataHelper";

/**
 * IUrlHelper
 */
declare interface IUrlHelper {
  /**
   * 把Object类型参数转换成等号连接的字符串数组
   *
   * @param obj
   * @returns Array 等号连接的字符串数组
   */
  object2queryArray(obj: Object): Array<string>;
  /**
   * 把Object类型参数（可传多个）转换成URL查询参数
   *
   * @param objs
   * @returns string
   */
  object2query(...objs: Array<Object>): string;
  /**
   * 添加参数到URL
   *
   * @param url
   * @param query
   * @returns
   */
  urlAppendQuery(url: string, query: string): string;
  /**
   * 添加参数到URL
   *
   * @param url
   * @param objs
   * @returns
   */
  urlAppendObject(url: string, ...objs: Array<Object>): string;
  /**
   * 根据对象（可传多个）填充URL路径参数
   *
   * @param url
   * @param objs
   */
  urlFillPathObject(url: string, ...objs: Array<Object>): string;
  /**
   * 获取查询参数中的属性
   * TODO 为什么不能用Object类型
   *
   * @param query
   */
  getQueryValue(query: any, key: string): string;
  /**
   * 发送POST请求
   *
   * @param url
   * @param data
   */
  postData(url: string, data: Object): Promise<any>;
  /**
   * 发送GET请求
   *
   * @param url
   * @param data
   */
  getData(url: string, ...data: Array<Object>): Promise<any>;
  /**
   * 获取今日诗词
   *
   * @deprecated 参考使用cnpm install -S jinrishici
   */
  getTodayPoem(): Promise<any>;
  /**
   * 批量上传图片
   *
   * @param url
   * @param data
   * @param images
   */
  postImageData(url: string, data: Object, ...images: Array<Object>): Promise<any[]>;
}

class UrlHelper implements IUrlHelper {
  async postImageData(url: string, data: Object, ...images: Object[]): Promise<any[]> {
    const options: RequestInit = {
      method: "POST",
      // 似乎上传文件FormData不需要用这个"Content-Type": "multipart/form-data"
      // headers: { "Content-Type": "multipart/form-data" },
    };
    const host = import.meta.env.VENUS_WZBLOG_WSL_HOST;
    const apiUrl = `${url.startsWith("http") ? "" : host}${url}`;
    const uploadFetchs = images
      .map(async (image: any) => {
        const opt = { ...options };
        const form = new FormData();
        // console.log(image);
        // 注意这个必须得是文件
        form.append("file", image[0]);
        if (!dataHelper.isEmpty(data)) {
          Object.entries(data).forEach((kv) => form.append(kv[0], kv[1]));
        }
        opt.body = form;
        const uploadFetch = await fetch(apiUrl, opt);
        // const json = await uploadFetch.json();
        return uploadFetch.json();
      });
    const jsons = await Promise.all(uploadFetchs);
    // console.log(jsons);
    return jsons;
  }
  async getData(url: string, ...data: Object[]): Promise<any> {
    // console.log(import.meta.env.VENUS_WZBLOG_WSL_HOST);
    const host = import.meta.env.VENUS_WZBLOG_WSL_HOST;
    const apiUrl = (url.startsWith("http") ? "" : host) + this.urlAppendObject(url, ...data);
    const response = await fetch(apiUrl);
    const json = await response.json();
    // console.log(json);
    return json;
  }
  async postData(url: string, data: Object): Promise<any> {
    Date.prototype.toJSON = function () { return dayjs(this).format('YYYY-MM-DD HH:mm:ss'); };
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const host = import.meta.env.VENUS_WZBLOG_WSL_HOST;
    const apiUrl = (url.startsWith("http") ? "" : host) + url;
    const response = await fetch(apiUrl, options);
    const json = await response.json();
    // console.log(json);
    return json;
  }
  async getTodayPoem(): Promise<any> {
    const token_api = "https://v2.jinrishici.com/token";
    // const poem_api = "https://v2.jinrishici.com/sentence";
    const poem_api_test = "https://v2.jinrishici.com/info";
    // const poem_api = "https://v2.jinrishici.com/one.json";
    const token_json: any = await (await fetch(token_api)).json();
    // console.log(token_json);
    const options: RequestInit = {
      method: "GET",
      mode: "cors",
      headers: { "X-User-Token": token_json.data },
    };
    // console.log(options);
    const json = await (await fetch(poem_api_test, options)).json();
    // console.log(json);
    return json;
  }
  getQueryValue(query: any, key: string): string {
    const val = query[key];
    if (dataHelper.isEmpty(val)) return dataHelper.EMPTY_STRING;
    if (val instanceof String || "string" === typeof val) return val.toString();
    if (val instanceof Array) return val[0];
    return dataHelper.EMPTY_STRING;
  }
  urlFillPathObject(url: string, ...objs: Object[]): string {
    if (dataHelper.isBlank(url)) return dataHelper.EMPTY_STRING;
    if (dataHelper.isEmpty(objs)) return url;
    // 如果有问题，回退到注释代码
    // objs.forEach((val) => {
    //   Object.entries(val).forEach((kv) => {
    //     url = url.replace(`:${kv[0]}`, kv[1]);
    //   });
    // });
    objs.forEach((val) => {
      url = Object.entries(val).reduce((u, kv) => u.replace(`:${kv[0]}`, kv[1]), url)
    });
    // TODO 期待转换成如下代码
    // objs.reduce((us, obj) => Object.entries(obj).reduce((u, kv) => u.replace(`:${kv[0]}`, kv[1]), us), url);
    return url;
  }
  urlAppendObject(url: string, ...objs: Object[]): string {
    const query = this.object2query(...objs);
    return this.urlAppendQuery(url, query);
  }
  urlAppendQuery(url: string, query: string): string {
    if (dataHelper.isBlank(url)) return dataHelper.EMPTY_STRING;
    if (dataHelper.isBlank(query)) return url;
    url += `${url.includes("?") ? "&" : "?"}${query}`;
    return url;
  }
  object2queryArray(obj: Object): string[] {
    if (dataHelper.isEmpty(obj)) return dataHelper.EMPTY_ARRAY;
    return Object.entries(obj).map((kv) => kv.join("="));
  }
  object2query(...objs: Object[]): string {
    if (dataHelper.isEmpty(objs)) return dataHelper.EMPTY_STRING;
    const arr: Array<string> = objs.map((val) => this.object2queryArray(val))
      .reduce((pre, cur) => [...pre, ...cur]);
    return arr.join("&");
  }
}

const urlHelper: IUrlHelper = new UrlHelper();

export { urlHelper };
