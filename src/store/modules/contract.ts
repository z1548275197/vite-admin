interface PageItem {
  componentList: any[];
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
  pageList: [],             // 页面数据
  materialList: [],         // 素材工具栏列表
  currentPageIndex: 0,      // 当前选择的页面索引
  currentComponentIndex: -1 // 当前选择的组件索引
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
    state.currentComponentIndex = -1;
    state.currentPageIndex = 0;
  },
  UPDATE_COMPONENT(state: State, paylod: any): void {
    state.pageList[paylod.pageIndex].componentList = paylod.componentList;
  },
  EDIT_COMPONENT(state: State, paylod: any): void {
    state.pageList[paylod.pageIndex].componentList[paylod.componentIndex] = paylod.component;
  },
  SELECT_COMPONENT(state: State, paylod: any): void {
    state.currentComponentIndex = paylod.componentIndex;
    state.currentPageIndex = paylod.pageIndex;
  },
};

const actions = {
  INIT_CONTRACT(context:any,paylod:any){
    context.commit('INIT_CONTRACT', paylod);
  },
  UPDATE_COMPONENT(context:any,paylod:any){
    context.commit('UPDATE_COMPONENT', paylod);
  },
  EDIT_COMPONENT(context:any,paylod:any){
    context.commit('EDIT_COMPONENT', paylod);
  },
  SELECT_COMPONENT(context:any,paylod:any): void {
    context.commit('SELECT_COMPONENT', paylod);
  },
};

export default {
  state,
  actions,
  getters,
  mutations,
};
