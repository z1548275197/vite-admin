interface PageItem {
  componentList: [];
  backgroundUrl: String;
 
}

interface MaterialItem {
  type: Number;
  name: String;
}

interface State {
  pageList: PageItem[],
  materialList: MaterialItem[],
  currentPageIndex: Number;
  currentComponentIndex: Number;
}

const state: State = {
  pageList: [],
  materialList: [],
  currentPageIndex: 0,
  currentComponentIndex: -1
};
const getters = {
    // getLocale(state:State){
    //     console.log('state',state)
    //     return state.locale
    // }
};

const mutations = {
  INIT_CONTRACT(state: State, paylod: any): void {
    state.pageList = paylod.pageList;
  }
};

const actions = {
    // setLocale(context:any,locale:any){
    //     context.commit(types.ADD_LOCALE, locale);
    // }
};

export default {
  state,
  actions,
  getters,
  mutations,
};
