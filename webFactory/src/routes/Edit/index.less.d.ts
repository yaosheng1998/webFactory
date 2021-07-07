declare namespace IndexLessNamespace {
  export interface IIndexLess {
    attribute: string;
    background: string;
    btn: string;
    container: string;
    content: string;
    cover: string;
    editContent: string;
    editPanel: string;
    header: string;
    hide: string;
    layer: string;
    loading: string;
    option: string;
    right: string;
    spin: string;
    tools: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
