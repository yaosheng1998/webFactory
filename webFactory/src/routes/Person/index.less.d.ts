declare namespace IndexLessNamespace {
  export interface IIndexLess {
    avatar: string;
    avatarWrap: string;
    birthday: string;
    body: string;
    change: string;
    container: string;
    content: string;
    form: string;
    head: string;
    id: string;
    input: string;
    item: string;
    loading: string;
    logout: string;
    name: string;
    nameWrap: string;
    spin: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
