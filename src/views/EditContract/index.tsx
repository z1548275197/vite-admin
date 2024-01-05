import { defineComponent, onMounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { debounce } from 'lodash';
import Cookies from 'js-cookie';
import { getContractData, getContractField } from '@/apis/contract'
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
    const router = useRouter();
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

    const initPage = async () => {
      const res = await getPageSize();
      store.dispatch('UPDATE_SPECIFICATION', {
        specification: res
      })
    }

    const bindEvent = () => {
      document.addEventListener('keydown', function (event) {
        if ((event.shiftKey && event.key === 'R') || (event.shiftKey && event.code === 'KeyR')) {
          console.log('Shift + R 被按下');
          store.dispatch('UPDATE_RESIZESCHEMA', {
            resizeSchema: dataSource.value.resizeSchema === 1 ? 2 : 1
          })
        }
      });
    }

    const initData = async () => {
      const res: any = await getContractData({
        contract_template_uuid: router.currentRoute.value.query.contract_template_uuid
      });
      if (res) {
        store.dispatch('INIT_CONTRACT', {
          pageList: res.list,
          status: res.status
        })
      }
    }

    const getFields = async () => {
      const res: any = await getContractField();
      if (res) {
        store.dispatch('INIT_CONTRACT_FIELD', {
          fieldList: res.list
        })
      }
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
      bindEvent()
      initPage();
      getFields();
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
