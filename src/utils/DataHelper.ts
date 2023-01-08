/**
 * IDataHelper
 */
declare interface IDataHelper {
  /**
   * 空对象
   */
  readonly EMPTY_OBJECT: any;
  /**
   * 空数组
   */
  readonly EMPTY_ARRAY: any;
  /**
   * 空字符串
   */
  readonly EMPTY_STRING: any;
  /**
   * 是否为空
   *
   * @param val
   * @returns
   */
  isEmpty(val: any): boolean;
  /**
   * 是否为空白字符串
   *
   * @param val
   */
  isBlank(val: string): boolean;
  /**
   * 伪随机数，区间：[0, max) max默认为7
   * @param max
   */
  randomInt(max?: number): number;
}

class DataHelper implements IDataHelper {
  randomInt(max: number = 7): number {
    const factor = (max * 10) / max;
    return parseInt((Math.random() * factor).toFixed()) % max;
  }
  isBlank(val: string): boolean {
    return this.isEmpty(val) || !val.trim().length;
  }
  isEmpty(val: any): boolean {
    if (!val) return true;
    if (val instanceof String || "string" === typeof val) return !val.length;
    if (val instanceof Object) return !Object.keys(val).length;
    if (val instanceof Array) return !val.length;
    return false;
  }
  EMPTY_OBJECT: any = Object.freeze({});
  EMPTY_ARRAY: any = Object.freeze([]);
  EMPTY_STRING: any = Object.freeze("");
}

const dataHelper: IDataHelper = new DataHelper();
export { dataHelper };
