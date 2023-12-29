import { defineComponent, onMounted, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import EditHeader from './components/editHeader';
import PageContent from './components/pageContent';
import AddedControl from './components/addedControl';
import EditProperty from './components/editProperty';
import Pagination from './components/pagination';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const store = useStore();
    const dataSource: any = computed(() => store.state.contract);

    // 获取页面尺寸
    const getPageSize = () => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
          const width = img.width;
          const height = img.height;
          resolve(width > height ? 'A3' : 'A4')
        };
        img.src = 'https://fr-static.jiazhengye.cn/658551d686dad-1.bb60bcc151c2fafd.jpg'
      })
    }

    const initData = async () => {
      const res = await getPageSize();
      store.dispatch('UPDATE_SPECIFICATION', {
        specification: res
      })
      store.dispatch('INIT_CONTRACT', {
        pageList: [
          {
            backgroundUrl: 'https://fr-static.jiazhengye.cn/658551d686dad-1.bb60bcc151c2fafd.jpg',
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
                y: 800,
                value: '222',
                width: 150,
                height: 30,
                componentName: '单行文本'
              },
              {
                id: 'test3333',
                type: 1,
                x: 500,
                y: 800,
                value: '333',
                width: 150,
                height: 30,
                componentName: '单行文本'
              },
            ]
          },
          {
            backgroundUrl: 'https://fr-static.jiazhengye.cn/658551d686dad-2.3ce920bc76b3d683.jpg',
            componentList: []
          },
        ]
        // pageList: [
        //   {
        //     backgroundUrl: 'https://fr-static.jiazhengye.cn/0001.0388eb5ca865f91f.jpg',
        //     componentList: [
        //       {
        //         id: 'test1111',
        //         type: 1,
        //         x: 0,
        //         y: 0,
        //         value: '111',
        //         width: 150,
        //         height: 30,
        //         componentName: '单行文本'
        //       },
        //       {
        //         id: 'test2222',
        //         type: 1,
        //         x: 0,
        //         y: 800,
        //         value: '222',
        //         width: 150,
        //         height: 30,
        //         componentName: '单行文本'
        //       },
        //       {
        //         id: 'test3333',
        //         type: 1,
        //         x: 500,
        //         y: 800,
        //         value: '333',
        //         width: 150,
        //         height: 30,
        //         componentName: '单行文本'
        //       },
        //     ]
        //   },
        //   {
        //     backgroundUrl: 'https://fr-static.jiazhengye.cn/0002.2d012d206bdecc31.jpg',
        //     componentList: []
        //   },
        // ]
      })
    }

    const debouncedScroll = debounce(() => {
      const ele: any = document.getElementById('mainContainer');
      const focusPage = Math.floor(ele.scrollTop / 900);
      if (dataSource.value.currentPageIndex !== focusPage) {
        store.dispatch('SELECT_COMPONENT', {
          componentIndex: -1,
          pageIndex: focusPage
        });
      }
    }, 500)

    onMounted(() => {
      document.addEventListener('keydown', function (event) {
        if ((event.shiftKey && event.key === 'R') || (event.shiftKey && event.code === 'KeyR')) {
          console.log('Shift + R 被按下');
          store.dispatch('UPDATE_RESIZESCHEMA', {
            resizeSchema: dataSource.value.resizeSchema === 1 ? 2 : 1
          })
        }
      });

      initData();
    })

    return () => {
      return (
        <el-container class={cx('container')}>
          <el-header class={cx('header')}>
            <EditHeader></EditHeader>
          </el-header>
          <el-container>
            <el-container class={cx('content')}>
              <el-main class={cx('main')} id="mainContainer" onScroll={debouncedScroll}>
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
              <el-footer height="40px" class={cx('footer')}>
                <Pagination></Pagination>
              </el-footer>
            </el-container>
            <el-aside width="200px" class={cx('leftAside')}>
              <AddedControl></AddedControl>
            </el-aside>
            <el-aside width="250px" class={cx('rightAside')}>
              <EditProperty></EditProperty>
            </el-aside>
          </el-container>
        </el-container>
      )
    }
  }
})
