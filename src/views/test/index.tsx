import { defineComponent } from 'vue';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import { useRouter } from 'vue-router';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const router = useRouter();
    return () => {
      return (
        <div class={cx('container')}>
          测试内容元件
          <el-button type="primary" onClick={() => {
            router.push('/test2')
          }}>测试内容</el-button>
        </div>
      )
    }
  }
})
