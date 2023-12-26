import { defineComponent, onMounted, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import EditHeader from './components/editHeader';
import PageContent from './components/pageContent';
import AddedControl from './components/addedControl';
import EditProperty from './components/editProperty';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const componetType: any = {
  1: '文本'
}

export default defineComponent({
  setup() {
    const store = useStore();
    const dataSource: any = computed(() => store.state.contract);

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

    const initData = () => {
      store.dispatch('INIT_CONTRACT', {
        pageList: [
          {
            backgroundUrl: 'https://fr-static.jiazhengye.cn/0001.0388eb5ca865f91f.jpg',
            componentList: [
              {
                id: 'test1111',
                type: 1,
                x: 0,
                y: 0,
                value: '111',
                width: 150,
                height: 30,
                componentName: '单行文本'
              },
              {
                id: 'test2222',
                type: 1,
                x: 0,
                y: 1050,
                value: '222',
                width: 150,
                height: 30,
                componentName: '单行文本'
              },
              {
                id: 'test3333',
                type: 1,
                x: 750,
                y: 800,
                value: '333',
                width: 150,
                height: 30,
                componentName: '单行文本'
              },
            ]
          },
          {
            backgroundUrl: 'https://fr-static.jiazhengye.cn/0002.2d012d206bdecc31.jpg',
            componentList: []
          },
        ]
      })
    }

    onMounted(() => {
      initData();
      console.log(dataSource, 'dataSource')
    })

    return () => {
      return (
        <el-container class={classes.container}>
          <el-header class={classes.header}>
            <EditHeader></EditHeader>
          </el-header>
          <el-container>
            <el-main class={classes.main}>
              {
                dataSource.value.pageList.map((item: any, index: number) => {
                  return (
                    <PageContent
                      pageIndex={index}
                    ></PageContent>
                  )
                })
              }
            </el-main>
            <el-aside width="200px" class={classes.leftAside}>
              <AddedControl></AddedControl>
            </el-aside>
            <el-aside width="250px" class={classes.rightAside}>
              <EditProperty></EditProperty>
            </el-aside>
          </el-container>
        </el-container>
      )
    }
  }
})
