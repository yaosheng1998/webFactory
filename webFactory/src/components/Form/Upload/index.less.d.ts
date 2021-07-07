declare namespace IndexLessNamespace {
  export interface IIndexLess {
    container: string;
    delete: string;
    desc: string;
    image: string;
    showImage: string;
    upIcon: string;
    upload: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
