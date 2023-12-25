import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const componetType: any = {
  1: '文本'
}

export default defineComponent({
  setup() {
    const store = useStore();

    const state: any = reactive({
      componentList: [
        {
          id: 'test1111',
          type: 1,
          x: 0,
          y: 0,
          value: '111',
          width: 120,
          height: 30,
        },
        {
          id: 'test2222',
          type: 1,
          x: 0,
          y: 1050,
          value: '222',
          width: 120,
          height: 30,
        },
        {
          id: 'test3333',
          type: 1,
          x: 750,
          y: 800,
          value: '333',
          width: 120,
          height: 30,
        },
      ],
      typeList: [
        {
          type: 1,
          name: '文本'
        }
      ],
      backgroundUrl: 'https://fr-static.jiazhengye.cn/0001.0388eb5ca865f91f.jpg',
      currentComponentIndex: -1,
    });

    return () => {
      return (
        <el-container class={classes.container}>
          <el-header class={classes.header}>
            {renderHeader()}
          </el-header>
          <el-container>
            <el-main class={classes.main}>
              {renderCanvas()}
            </el-main>
            <el-aside width="200px" class={classes.leftAside}>
              {renderLeftContent()}
            </el-aside>
            <el-aside width="200px" class={classes.rightAside}>
              {state.currentComponentIndex >= 0 && renderRightContent()}
            </el-aside>
          </el-container>
        </el-container>
      )
    }
  }
})
