declare namespace IndexLessNamespace {
  export interface IIndexLess {
    active: string;
    chartImg: string;
    chartItem: string;
    chartName: string;
    chartsWrap: string;
    container: string;
    downList: string;
    item: string;
    menu: string;
    show: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
