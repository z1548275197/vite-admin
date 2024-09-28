import { defineComponent } from 'vue';
import classes from './index.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class={cx('container')}>
          测试内容元件
          <el-button type="primary">测试内容</el-button>
        </div>
      )
    }
  }
})
