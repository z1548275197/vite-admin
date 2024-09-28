import { defineComponent, reactive, onMounted, ComputedRef, computed } from 'vue'
import classes from './index.module.scss'
import { getAuthMenu } from '@/apis/user';
import TopNav from './components/TopNav';
import LeftNav from './components/LeftNav';
import classNames from 'classnames/bind';
import { useStore } from 'vuex';
import { useElementPlusTheme } from "use-element-plus-theme"

const cx = classNames.bind(classes);

export default defineComponent({
  name: 'layout',
  setup() {
    const store = useStore();
    const currentThemeColor: ComputedRef<string> = computed(() => {
      return store.state.user.themeColor
    });
    useElementPlusTheme(currentThemeColor.value);



    const getMenuList = async () => {
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
              {/* <LeftNav menuList={state.menuList} /> */}
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
