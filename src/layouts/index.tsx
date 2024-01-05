import { defineComponent, reactive, onMounted } from 'vue'
import classes from './index.module.scss'
import { getAuthMenu } from '@/apis/user';
import TopNav from './components/TopNav';
import LeftNav from './components/LeftNav';

export default defineComponent({
  name: 'layout',
  setup() {

    const state: any = reactive({
      menuList: [],
    });

    const getMenuList = async () => {
      const res = await getAuthMenu();
      if (res) {
        state.menuList = res
      }
    }

    onMounted(() => {
      getMenuList()
    })

    return () => {
      return (
        <div class={classes.container}>
          <div class={classes.topContent}>
            <TopNav />
          </div>
          <div class={classes.leftContent}>
            <LeftNav menuList={state.menuList} />
          </div>
          <div class={classes.centerContent}>
            <router-view />
          </div>
        </div>
      )
    }
  }
})
