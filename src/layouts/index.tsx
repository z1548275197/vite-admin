import { defineComponent, reactive, onMounted } from 'vue'
import classes from './index.module.scss'
import { getAuthMenu } from '@/apis/user';
import TopNav from './components/TopNav';
import LeftNav from './components/LeftNav';
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);

export default defineComponent({
  name: 'layout',
  setup() {

    const state: any = reactive({
      menuList: [],
    });

    const getMenuList = async () => {
      console.log('触发内容')
      state.menuList = []
      // const res = await getAuthMenu();
      // if (res) {
      //   console.log(res, '菜单')
      //   state.menuList = res
      // }
    }

    onMounted(() => {
      getMenuList()
    })

    return () => {
      return (
        <el-container class={cx('container')}>
          <el-header class={cx('topContent')}>
            <TopNav />
          </el-header>
          <el-container class={cx('leftContent')}>
            <el-aside width="300px">
              <LeftNav menuList={state.menuList} />
            </el-aside>
            <el-main class={cx('centerContent')}>
              <router-view />
            </el-main>
          </el-container>
        </el-container>

      )
    }
  }
})
