import { PageItem, MaterialItem } from '../types/contract';

interface State {
  pageList: PageItem[],
  materialList: MaterialItem[],
  currentPageIndex: number;
  currentComponentIndex: number;
  specification: 'A3' | 'A4';
  resizeSchema: 1 | 2;
  status: 1 | 2 | 0;
  fieldList: any[];
}

const state: State = {
  pageList: [],             // 页面数据
  materialList: [
    {
      type: 1,
      name: '单行文本',
      icon: 'https://fr-static.jiazhengye.cn/danhangwenben.67065f09d47bf6c3.png'
    },
    {
      type: 6,
      name: '多行文本',
      icon: 'https://fr-static.jiazhengye.cn/duohangwenben.6dd1111a4371f793.png'
    },
    {
      type: 4,
      name: '复选框',
      icon: 'https://fr-static.jiazhengye.cn/fuxuankuang.58a02d57f1c28f89.png'
    },
    {
      type: 3,
      name: '填写日期',
      icon: 'https://fr-static.jiazhengye.cn/rili.59af711857f188c9.png'
    },
  ],         // 素材工具栏列表
  currentPageIndex: 0,      // 当前选择的页面索引
  currentComponentIndex: -1, // 当前选择的组件索引
  specification: 'A4', // 纸张规格
  resizeSchema: 1,  // 拖拽尺寸模式
  status: 1,
  fieldList: []
};
const getters = {
  currentPageData(state: State) {
    return state.pageList[state.currentPageIndex as any]
  },
  currentComponent(state: State, getters: any) {
    if (getters.currentPageData && state.currentComponentIndex > -1) {
      return getters.currentPageData.componentList[state.currentComponentIndex];
    }
    return null;
  }
};

const mutations = {
  INIT_CONTRACT(state: State, paylod: any): void {
    state.pageList = paylod.pageList;
    state.status = paylod.status;
    state.currentComponentIndex = -1;
    state.currentPageIndex = 0;
  },
  UPDATE_STATUS(state: State, paylod: any): void {
    state.status = paylod.status;
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
  UPDATE_SPECIFICATION(state: State, paylod: any): void {
    state.specification = paylod.specification;
  },
  UPDATE_RESIZESCHEMA(state: State, paylod: any): void {
    state.resizeSchema = paylod.resizeSchema;
  },
  INIT_CONTRACT_FIELD(state: State, paylod: any): void {
    state.fieldList = paylod.fieldList;
  },
};

const actions = {
  INIT_CONTRACT(context: any, paylod: any) {
    context.commit('INIT_CONTRACT', paylod);
  },
  UPDATE_STATUS(context: any, paylod: any) {
    context.commit('UPDATE_STATUS', paylod);
  },
  UPDATE_COMPONENT(context: any, paylod: any) {
    context.commit('UPDATE_COMPONENT', paylod);
  },
  EDIT_COMPONENT(context: any, paylod: any) {
    context.commit('EDIT_COMPONENT', paylod);
  },
  SELECT_COMPONENT(context: any, paylod: any): void {
    context.commit('SELECT_COMPONENT', paylod);
  },
  UPDATE_SPECIFICATION(context: any, paylod: any): void {
    context.commit('UPDATE_SPECIFICATION', paylod);
  },
  UPDATE_RESIZESCHEMA(context: any, paylod: any): void {
    context.commit('UPDATE_RESIZESCHEMA', paylod);
  },
  INIT_CONTRACT_FIELD(context: any, paylod: any): void {
    context.commit('INIT_CONTRACT_FIELD', paylod);
  },
};

export default {
  state,
  actions,
  getters,
  mutations,
};
