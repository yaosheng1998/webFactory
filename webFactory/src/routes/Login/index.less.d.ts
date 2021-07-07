declare namespace IndexLessNamespace {
  export interface IIndexLess {
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    button: string;
    check: string;
    container: string;
    content: string;
    cuo: string;
    decorate: string;
    dui: string;
    forget: string;
    input: string;
    inputIcon: string;
    inputWrap: string;
    isLogin: string;
    line: string;
    main: string;
    mask: string;
    one: string;
    optionWrap: string;
    point: string;
    register: string;
    rember: string;
    repeat: string;
    title: string;
    toLogin: string;
    two: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
