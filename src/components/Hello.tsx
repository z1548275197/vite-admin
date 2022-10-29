import { defineComponent } from 'vue'
import classes from './index.module.scss'
export default defineComponent({
  setup() {
    console.log(classes)
    return () => {
      return <div class={classes.container}>
        测试111
        <div class={classes.content}>
          测试2222
        </div>
      </div>
    }
  }
})
