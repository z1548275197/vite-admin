import { defineComponent } from 'vue'
import classes from './index.module.scss'
export default defineComponent({
  setup() {
    console.log(classes)
    return () => {
      return (
        <div class={classes.container}>
         <div class={classes.leftContianer}>
          <img class="logo" src='https://fr-static.jiazhengye.cn/logo.dc1ea8c160be81ad.png' alt="" />
          {/* <div class={[classes.topNavList, { active: true }]}></div> */}
          {/* <div
            class="topNavList"
            :class="{ active: item.id === curTopNav }"
            v-for="(item, index) in topMenuList"
            :key="index"
            @click="changeNavTab(item)"
          >
            <i :class="item.icon"></i>
            {{ item.title }}
          </div> */}
          </div>
        </div>
      )
    }
  }
})
