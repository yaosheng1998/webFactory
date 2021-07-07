declare namespace IndexLessNamespace {
  export interface IIndexLess {
    bottom: string;
    container: string;
    dragWrap: string;
    left: string;
    midx: string;
    midy: string;
    point: string;
    right: string;
    rsLeftTop: string;
    rsMidLeft: string;
    rsMidTop: string;
    rsRightTop: string;
    selected: string;
    top: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
