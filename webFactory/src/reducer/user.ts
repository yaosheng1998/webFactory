type TAction =
  | 'SET_LOGIN'
  | 'SET_USER_INFO'
  | 'SET_USER_PAGE'
  | 'SET_PAGE_GROUP';

interface IUserProfile {
  userName?: string;
  avatar?: string;
  birthday?: Date;
  frezee?: boolean;
  language?: string;
  skin?: number;
  email?: string;
}

export interface IState {
  userid: number;
  userProfile: IUserProfile;
  isLogin: boolean;
  page: {
    id: number;
    name: string;
    sourceId: string;
    publish: boolean;
    create: Date;
    update: Date;
    delete: Date;
    url: string;
    groupid: number;
    visitKey: string;
    description: string;
  }[];
  group: {
    groupid: number;
    name: string;
  }[];
}

export interface IAction {
  type: TAction;
  userid?: number;
  userProfile?: IUserProfile;
  isLogin?: boolean;
  page?: IState['page'];
  group?: IState['group'];
  email?: string;
}

const initialState: IState = {
  userid: -1,
  userProfile: {
    userName: 'sheng yao'
  },
  page: [],
  group: [],
  isLogin: false
};

const HANDLE_ACTION: {
  [propName in TAction]: (state: IState, action: IAction) => IState;
} = {
  SET_LOGIN: (state, action) => {
    return {
      ...state,
      isLogin: !!action.isLogin
    };
  },
  SET_USER_INFO: (state, action) => {
    return {
      ...state,
      userid: action.userid || 0,
      userProfile: {
        ...state.userProfile,
        ...action.userProfile
      }
    };
  },
  SET_USER_PAGE: (state, action) => {
    return {
      ...state,
      page: action.page || []
    };
  },
  SET_PAGE_GROUP: (state, action) => {
    return {
      ...state,
      group: action.group || []
    };
  }
};

export default (state: IState = initialState, action: IAction): IState => {
  const handle = HANDLE_ACTION[action.type];
  return handle ? handle(state, action) : state;
};
