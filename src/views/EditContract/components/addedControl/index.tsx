import { defineComponent, onMounted, reactive, ref, computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import { ComponentItem, MaterialItem } from '@/store/types/contract';
import classNames from 'classnames/bind';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const store = useStore();
    const componentList: ComputedRef<ComponentItem[]> = computed(() => {
      if (store.getters.currentPageData) {
        return store.getters.currentPageData.componentList
      }
      return []
    });
    const materialList: ComputedRef<MaterialItem[]> = computed(() => store.state.contract.materialList);
    const currentComponentIndex: ComputedRef<number> = computed(() => store.state.contract.currentComponentIndex);
    const currentPageIndex: ComputedRef<number> = computed(() => store.state.contract.currentPageIndex);
    const fieldList: ComputedRef<any[]> = computed(() => {
      return store.state.contract.fieldList.map((v: any) => {
        return v.list
      }).flat();
    });

    const selectComponent = (item: ComponentItem, componentIndex: number) => {
      store.dispatch('SELECT_COMPONENT', {
        componentIndex,
        pageIndex: currentPageIndex.value
      })
      document.getElementById('mainContainer')?.scrollTo({
        top: item.y + currentPageIndex.value * 1131,
        left: item.x,
        behavior: 'smooth' // 添加平滑滚动效果
      });
    }

    const getIcon = (type: any) => {
      const findItem = materialList.value.find((item: MaterialItem) => {
        return item.type === type
      });
      if (findItem) return findItem.icon;
      return '';
    }

    const getKeyName = (key: any) => {
      if (!key) return '未关联字段';
      return fieldList.value.find((v: any) => v.relationKey === key).name;
    }

    return () => {
      return (
        <div class={cx('container')}>
          <div class={cx('title')}>
            当前已添加控件
          </div>
          {
            componentList.value.map((item: ComponentItem, index: number) => {
              return (
                <div
                  key={item.id + '_control'}
                  class={
                    cx('controlItem', { active: currentComponentIndex.value === index })
                  }
                  onClick={() => {
                    selectComponent(item, index);
                  }}
                >
                  <div class={cx('controlTitle')}>
                    <img class={cx('iconImg')} src={getIcon(item.type)} alt="" />
                    {item.componentName || item.type}
                  </div>
                  <div class={cx('tip')}>
                    {getKeyName(item.relationKey)}
                  </div>
                </div>
              )
            })
          }
          {!componentList.value.length && (
            <el-empty description="暂无控件" />
          )}
        </div>
      )
    }
  }
})
