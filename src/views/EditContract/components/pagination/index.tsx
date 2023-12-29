import { defineComponent, onMounted, reactive, ref, computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ArrowRightBold } from '@element-plus/icons-vue';
import { MaterialItem, PageItem } from '@/store/types/contract';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const store = useStore();
    const currentPageIndex: ComputedRef<number> = computed(() => store.state.contract.currentPageIndex);
    const pageList: ComputedRef<PageItem[]> = computed(() => store.state.contract.pageList);

    const currentChangeHandle = (val: number) => {
      store.dispatch('SELECT_COMPONENT', {
        componentIndex: -1,
        pageIndex: val
      });
      document.getElementById('mainContainer')?.scrollTo({
        top: currentPageIndex.value * 1131,
        left: 0,
        behavior: 'smooth' // 添加平滑滚动效果
      });
    }

    return () => {
      return (
        <div class={cx('footerContainer')}>
          <div
            class={cx('prev', { disabled: currentPageIndex.value === 0 })}
            onClick={() => {
              if (currentPageIndex.value === 0) return;
              currentChangeHandle(currentPageIndex.value - 1);
            }}
          >上一页</div>
          <div class={cx('numBox')}>
            <div class={cx('num')}>
              {
                currentPageIndex.value + 1
              }
            </div>
            /
            <div class={cx('num', { disabled: currentPageIndex.value === pageList.value.length })}>
              {
                pageList.value.length
              }
            </div>

          </div>
          <div
            class={cx('next', { disabled: currentPageIndex.value === pageList.value.length - 1 })}
            onClick={() => {
              if (currentPageIndex.value === pageList.value.length - 1) return;
              currentChangeHandle(currentPageIndex.value + 1)
            }}
          >下一页</div>
        </div>
      )
    }
  }
})
