import { defineComponent, onMounted, reactive, ref } from 'vue'
import classes from './index.module.scss'
import classNames from 'classnames/bind';
import { useRouter } from 'vue-router';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const router = useRouter();
    const state: any = reactive({
    });

    return () => {
      return (
        <div class={cx('container')} onClick={() => {
          router.push('/test3')
        }}>
          这是我的内容111
        </div>
      )
    }
  }
})
