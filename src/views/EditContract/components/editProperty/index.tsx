import { defineComponent, onMounted, reactive, ref, computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import { ComponentItem, MaterialTypeMap } from '@/store/types/contract';
import { fontSizeList, letterSpaceList, timeFormatList, lineHeightList } from './interface';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const store = useStore();
    const currentComponent: ComputedRef<ComponentItem | null> = computed(() => {
      return store.getters.currentComponent;
    });

    const changePropertyHandle = (key: string, val: any) => {
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
      if (!currentComponent.value) return null;
      return (
        <div class={cx('container')}>
          <div class={cx('title')}>控件属性</div>

          <div class={cx('propertyItem')}>
            <div class={cx('propertyName')}>控件名称:</div>
            <div class={cx('propertyValue')}>
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

          {
            [MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.DATE].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>提示文案:</div>
                <div class={cx('propertyValue')}>
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
            )
          }

          {
            [MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.DATE].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>字号:</div>
                <div class={cx('propertyValue')}>
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
                          <el-option key={item} label={item + 'px'} value={item}></el-option>
                        )
                      })
                    }
                  </el-select>
                </div>
              </div>
            )
          }

          {
            [MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.DATE].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>横向间距:</div>
                <div class={cx('propertyValue')}>
                  <el-select
                    size="small"
                    style={{ width: '80%' }}
                    clearable
                    modelValue={currentComponent.value.letterSpace}
                    placeholder="请选择横向间距"
                    onChange={(val: any) => {
                      changePropertyHandle('letterSpace', val)
                    }}
                  >
                    {
                      letterSpaceList.map((item: any) => {
                        return (
                          <el-option key={item} label={item + 'px'} value={item}></el-option>
                        )
                      })
                    }
                  </el-select>
                </div>
              </div>
            )
          }

          {
            [MaterialTypeMap.MORE_LINE].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>行高:</div>
                <div class={cx('propertyValue')}>
                  <el-select
                    size="small"
                    style={{ width: '80%' }}
                    clearable
                    modelValue={currentComponent.value.lineHeight || 1.2}
                    placeholder="请选择行高"
                    onChange={(val: any) => {
                      changePropertyHandle('lineHeight', val)
                    }}
                  >
                    {
                      lineHeightList.map((item: any) => {
                        return (
                          <el-option key={item} label={item} value={item}></el-option>
                        )
                      })
                    }
                  </el-select>
                </div>
              </div>
            )
          }

          {
            [MaterialTypeMap.DATE].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>日期格式:</div>
                <div class={cx('propertyValue')}>
                  <el-select
                    size="small"
                    style={{ width: '80%' }}
                    clearable
                    modelValue={currentComponent.value.timeFormatType}
                    placeholder="请选择日期格式"
                    onChange={(val: any) => {
                      changePropertyHandle('timeFormatType', val)
                    }}
                  >
                    {
                      timeFormatList.map((item: any) => {
                        return (
                          <el-option key={item} label={item} value={item}></el-option>
                        )
                      })
                    }
                  </el-select>
                </div>
              </div>
            )
          }

          <div class={cx('propertyItem')}>
            <div class={cx('propertyName')}>坐标:</div>
            <div class={cx('propertyValue')}>
              横向:
              <el-input
                size="small"
                type="number"
                class={cx('numInput')}
                style={{ width: '70px' }}
                max={10000}
                min={0}
                modelValue={currentComponent.value.x}
                onInput={(val: any) => {
                  changePropertyHandle('x', val || 0)
                }}
              ></el-input>
              &nbsp;
              纵向:
              <el-input
                size="small"
                type="number"
                class={cx('numInput')}
                style={{ width: '70px' }}
                max={10000}
                min={0}
                modelValue={currentComponent.value.y}
                onInput={(val: any) => {
                  changePropertyHandle('y', val)
                }}
              ></el-input>
            </div>
          </div>
        </div>
      )
    }
  }
})
