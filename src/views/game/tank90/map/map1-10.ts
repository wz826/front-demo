/// <reference path="./index.ts" />
// TODO 如果Vite支持namespace的合并就好了，就不用写下面这种啰嗦的代码了
import { Tank90Map as _ } from './map'

/** 91坦克 版式一.png */
namespace Tank90Map {
   /** 第一关：13 X 13 */
   export const map1: _.RectMap = [
      // 1             3             5             7             9             11            13      
      [_.L__, _.L__, _.L__, _.L__, _.L__, _.L__, _.L__, _.L__, _.L__, _.L__, _.L__, _.L__, _.L__], // 1
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__],
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__], // 3
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.S__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__],
      // 1             3             5             7             9             11            13       
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.Bt_, _.L__, _.Bt_, _.L__, _.B__, _.L__, _.B__, _.L__], // 5
      [_.L__, _.Bt_, _.L__, _.Bt_, _.L__, _.Bb_, _.L__, _.Bb_, _.L__, _.Bt_, _.L__, _.Bt_, _.L__],
      [_.Bb_, _.L__, _.Bb_, _.Bb_, _.L__, _.Bt_, _.L__, _.Bt_, _.L__, _.Bb_, _.Bb_, _.L__, _.Bb_], // 7
      [_.St_, _.L__, _.Bt_, _.Bt_, _.L__, _.Bb_, _.L__, _.Bb_, _.L__, _.Bt_, _.Bt_, _.L__, _.St_],
      [_.L__, _.Bb_, _.L__, _.Bb_, _.L__, _.B__, _.B__, _.B__, _.L__, _.Bb_, _.L__, _.Bb_, _.L__], // 9
      // 1             3             5             7             9             11            13      
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__],
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.Bt_, _.L__, _.Bt_, _.L__, _.B__, _.L__, _.B__, _.L__], // 11
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.Bbr, _.Bb_, _.Bbl, _.L__, _.B__, _.L__, _.B__, _.L__],
      [_.L__, _.L__, _.L__, _.L__, _.L__, _.Br_, _.E__, _.Bl_, _.L__, _.L__, _.L__, _.L__, _.L__], // 13
   ];

   /** 第二关：13 X 13 */
   export const map2: _.RectMap = [
      // 1             3             5             7             9             11            13      
      [_.L__, _.L__, _.L__, _.S__, _.L__, _.L__, _.L__, _.S__, _.L__, _.L__, _.L__, _.L__, _.L__], // 1
      [_.L__, _.B__, _.L__, _.S__, _.L__, _.L__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__],
      [_.L__, _.B__, _.L__, _.L__, _.L__, _.L__, _.B__, _.B__, _.L__, _.B__, _.S__, _.B__, _.L__], // 3
      [_.L__, _.L__, _.L__, _.B__, _.L__, _.L__, _.L__, _.L__, _.L__, _.S__, _.L__, _.L__, _.L__],
      // 1             3             5             7             9             11            13      
      [_.G__, _.L__, _.L__, _.B__, _.L__, _.L__, _.S__, _.L__, _.L__, _.B__, _.G__, _.B__, _.S__], // 5
      [_.G__, _.G__, _.L__, _.L__, _.L__, _.B__, _.L__, _.L__, _.S__, _.L__, _.G__, _.L__, _.L__],
      [_.L__, _.B__, _.B__, _.B__, _.G__, _.G__, _.G__, _.S__, _.L__, _.L__, _.G__, _.B__, _.L__], // 7
      [_.L__, _.L__, _.L__, _.S__, _.G__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.L__],
      [_.S__, _.B__, _.L__, _.S__, _.L__, _.B__, _.L__, _.B__, _.L__, _.L__, _.L__, _.B__, _.L__], // 9
      // 1             3             5             7             9             11            13      
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.B__, _.B__, _.L__, _.B__, _.S__, _.B__, _.L__],
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.B__, _.B__, _.B__, _.L__, _.L__, _.L__, _.L__, _.L__], // 11
      [_.L__, _.B__, _.L__, _.L__, _.L__, _.Bbr, _.Bb_, _.Bbl, _.L__, _.B__, _.L__, _.B__, _.L__],
      [_.L__, _.B__, _.L__, _.B__, _.L__, _.Br_, _.E__, _.Bl_, _.L__, _.B__, _.B__, _.B__, _.L__], // 13
   ];

   export const maps1_10: _.RectMap[] = [map1, map2];
}
// TODO 如果Vite支持namespace的合并就好了，就不用写下面这种啰嗦的代码了
export { Tank90Map }