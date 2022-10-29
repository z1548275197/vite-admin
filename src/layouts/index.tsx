import { defineComponent, reactive, onMounted } from 'vue'
import classes from './index.module.scss'
import { getAuthMenu } from '@/apis/user';
export default defineComponent({


  setup() {

    const state: any = reactive({
      topMenuList: [],
    });

    console.log(classes)
    const getMenuList = async () => {
      const res = await getAuthMenu();
      if (res) {
        const {
          data: { auth_list }
        }: any = res;
        console.log(auth_list)
        state.topMenuList = auth_list;
      }
    }

    

    return () => {
      return (
        <div class={classes.container}>
          <div class={classes.topContent}>
            {/* <TopNav @changeLeftMenu="getChangeLeftMenu" :topMenuList="topMenuList" /> */}
          </div>
          <div class={classes.leftContent}>
            {/* <LeftNav :menuData="menu" /> */}
          </div>
          <div class={classes.centerContent}>
            <router-view />
          </div>
        </div>
      )
    }
  }
})
