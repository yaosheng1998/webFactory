declare namespace IndexLessNamespace {
  export interface IIndexLess {
    breakRule: string;
    breakSwitch: string;
    breakTitle: string;
    btn: string;
    container: string;
    content: string;
    folder: string;
    input: string;
    item: string;
    line: string;
    lineSwitch: string;
    name: string;
    position: string;
    size: string;
    text: string;
    title: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
