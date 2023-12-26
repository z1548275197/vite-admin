import { defineComponent, onMounted, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import { ComponentItem } from '@/store/types/contract';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default defineComponent({
  setup() {
    const store = useStore();
    const componentList = computed(() => {
      if (store.getters.currentPageData) {
        return store.getters.currentPageData.componentList
      }
      return []
    });
    const currentComponentIndex = computed(() => store.state.contract.currentComponentIndex);
    const currentPageIndex = computed(() => store.state.contract.currentPageIndex);

    const selectComponent = (item: ComponentItem, componentIndex: any) => {
      store.dispatch('SELECT_COMPONENT', {
        componentIndex,
        pageIndex: currentPageIndex.value
      })
      document.getElementById(item.id + '')?.scrollIntoView();
    }

    return () => {
      return (
        <div class={classes.container}>
          <div class={classes.title}>
            当前已添加控件
          </div>
          {
            componentList.value.map((item: ComponentItem, index: number) => {
              return (
                <div
                  key={item.id + '_control'}
                  class={
                    currentComponentIndex.value === index ? [classes.controlItem, classes.active] : classes.controlItem
                  }
                  onClick={() => {
                    selectComponent(item, index);
                  }}
                >
                  <div class={classes.controlTitle}>
                    {item.componentName || item.type}
                  </div>
                  <div class={classes.tip}>
                    雇主姓名
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
  }
})
