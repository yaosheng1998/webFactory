declare namespace IndexLessNamespace {
  export interface IIndexLess {
    container: string;
    delete: string;
    leftLine: string;
    rect: string;
    rectInfo: string;
    topLine: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
