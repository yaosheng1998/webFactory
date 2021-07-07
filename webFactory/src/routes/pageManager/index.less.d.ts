declare namespace IndexLessNamespace {
  export interface IIndexLess {
    btn: string;
    container: string;
    createPage: string;
    leftOption: string;
    loading: string;
    optionWrap: string;
    options: string;
    pagination: string;
    rightOption: string;
    spin: string;
    table: string;
    title: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
