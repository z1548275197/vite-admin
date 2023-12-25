import { defineComponent } from 'vue'
import classes from './index.module.scss'
export default defineComponent({
  name: 'TopNav',
  setup() {
    console.log(classes)
    return () => {
      return (
        <div class={classes.container}>
          <div class={classes.leftContianer}>
            <div class={classes.logoBox}>
              <img class={classes.logo} src='https://fr-static.jiazhengye.cn/logo.dc1ea8c160be81ad.png' alt="" />
            </div>
          </div>
        </div>
      )
    }
  }
})
