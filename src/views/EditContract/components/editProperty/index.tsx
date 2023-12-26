import { defineComponent, onMounted, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import { ComponentItem } from '@/store/types/contract';
import { fontSizeList } from './interface';


export default defineComponent({
  setup() {
    const store = useStore();
    const currentComponent = computed(() => {
      return store.getters.currentComponent;
    });

    const changePropertyHandle = (key: any, val: any) => {
      store.dispatch('EDIT_COMPONENT', {
        pageIndex: store.state.contract.currentPageIndex,
        componentIndex: store.state.contract.currentComponentIndex,
        component: {
          ...currentComponent.value,
          [key]: val
        }
      })
    }


    return () => {
      if (!currentComponent.value) return null
      return (
        <div class={classes.container}>
          <div class={classes.title}>控件属性</div>

          <div class={classes.propertyItem}>
            <div class={classes.propertyName}>控件名称:</div>
            <div class={classes.propertyValue}>
              <el-input
                size="small"
                style={{ width: '80%' }}
                clearable
                modelValue={currentComponent.value.componentName}
                placeholder="请输入控件名称"
                maxlength={30}
                onInput={(val: any) => {
                  changePropertyHandle('componentName', val)
                }}
              ></el-input>
            </div>

          </div>

          <div class={classes.propertyItem}>
            <div class={classes.propertyName}>提示文案:</div>
            <div class={classes.propertyValue}>
              <el-input
                size="small"
                style={{ width: '80%' }}
                clearable
                modelValue={currentComponent.value.placeholderTxt}
                placeholder="请输入提示文案"
                maxlength={30}
                onInput={(val: any) => {
                  changePropertyHandle('placeholderTxt', val)
                }}
              ></el-input>
            </div>
          </div>

          <div class={classes.propertyItem}>
            <div class={classes.propertyName}>字号:</div>
            <div class={classes.propertyValue}>
              <el-select
                size="small"
                style={{ width: '80%' }}
                clearable
                modelValue={currentComponent.value.fontSize || 16}
                placeholder="请选择字号"
                onChange={(val: any) => {
                  changePropertyHandle('fontSize', val)
                }}
              >
                {
                  fontSizeList.map((item: any) => {
                    return (
                      <el-option key={item} label={item} value={item}></el-option>
                    )
                  })
                }
              </el-select>
            </div>
          </div>

          <div class={classes.propertyItem}>
            <div class={classes.propertyName}>横向间距:</div>
            <div class={classes.propertyValue}>
              <el-select
                size="small"
                style={{ width: '80%' }}
                clearable
                modelValue={currentComponent.value.letterSpace || 16}
                placeholder="请选择字号"
                onChange={(val: any) => {
                  changePropertyHandle('letterSpace', val)
                }}
              >
                {
                  fontSizeList.map((item: any) => {
                    return (
                      <el-option key={item} label={item} value={item}></el-option>
                    )
                  })
                }
              </el-select>
            </div>
          </div>
        </div>
      )
    }
  }
})
