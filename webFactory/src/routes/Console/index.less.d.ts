declare namespace IndexLessNamespace {
  export interface IIndexLess {
    Nav: string;
    attr: string;
    breadcrumb: string;
    container: string;
    content: string;
    input: string;
    main: string;
    nav: string;
    title: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
