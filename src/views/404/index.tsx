import { defineComponent } from 'vue';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import NotFountImg from '@/assets/images/404.png';
import { useRouter } from 'vue-router';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const router = useRouter();

    return () => {
      return (
        <div class={cx('container')}>
          <div class={cx('http404-container')}>
            <img
              class={cx('pic')}
              src={NotFountImg}
              alt="" />
            <div class={cx("title")}>抱歉，您要访问的页面丢失了</div>
            <div class={cx("desc")}>请检查您输入的网址是否正确，请点击以下按钮返回首页</div>
            <div class={cx('btn')} onClick={() => {
              router.push('/');
            }}>返回首页</div>
          </div>
        </div>
      )
    }
  }
})
