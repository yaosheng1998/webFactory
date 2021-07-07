declare namespace IndexLessNamespace {
  export interface IIndexLess {
    background: string;
    block: string;
    container: string;
    error: string;
    imageContainer: string;
    imageContainerWrap: string;
    pending: string;
    point: string;
    refresh: string;
    shandow: string;
    sliderContainer: string;
    success: string;
    tip: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
