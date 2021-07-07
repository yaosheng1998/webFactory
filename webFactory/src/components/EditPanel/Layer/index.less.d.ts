declare namespace IndexLessNamespace {
  export interface IIndexLess {
    container: string;
    content: string;
    edit: string;
    hidden: string;
    item: string;
    name: string;
    options: string;
    selected: string;
    title: string;
    up: string;
    wrap: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
