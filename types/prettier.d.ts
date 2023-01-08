declare module "prettier" {
  const content: any;
  /// 这里的 content 可以根据自己的需要，添加需要的类型，这的话可以让 ts 更好的提示
  /**
    type content = {
      test: string
    }
    */
  export = content;
}

declare module "prettier/parser-markdown" {
  const content: any;
  /// 这里的 content 可以根据自己的需要，添加需要的类型，这的话可以让 ts 更好的提示
  /**
    type content = {
      test: string
    }
    */
  export = content;
}
