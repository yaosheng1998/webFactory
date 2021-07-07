declare namespace IndexLessNamespace {
  export interface IIndexLess {
    header: string;
    hide: string;
    logo: string;
    logoWrap: string;
    userAvatar: string;
    userName: string;
    userWrap: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
