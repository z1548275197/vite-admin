import { defineComponent, onMounted, reactive, ref } from 'vue'
import classes from './index.module.scss'
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {

    const state: any = reactive({
    });

    return () => {
      return (
        <div class={cx('container')}>
          这是我的内容111
        </div>
      )
    }
  }
})
