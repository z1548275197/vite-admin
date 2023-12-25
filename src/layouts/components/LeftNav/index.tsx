import { defineComponent, toRefs } from 'vue'
import classes from './index.module.scss'
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: 'LeftNav',
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { menuList }: any = toRefs(props)

    return () => {
      return (
        <div class={classes.container}>
          <div class={classes.menuBox}>
            
          </div>
        </div>
      )
    }
  }
})
