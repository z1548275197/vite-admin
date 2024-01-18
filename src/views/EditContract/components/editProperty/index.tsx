import { defineComponent, onMounted, reactive, ref, computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import { ComponentItem, MaterialTypeMap } from '@/store/types/contract';
import { ArrowRightBold } from '@element-plus/icons-vue';
import { fontSizeList, letterSpaceList, timeFormatList, lineHeightList, alignList, zoomList } from './interface';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const store = useStore();
    const state: any = reactive({
      isShow: false,
      currentKey: '',
      currentKeyFullName: '',
    })
    const currentComponent: ComputedRef<ComponentItem | null> = computed(() => {
      return store.getters.currentComponent;
    });
    const fieldList: ComputedRef<any[]> = computed(() => {
      return store.state.contract.fieldList;
    });
    const currentKeyName: ComputedRef<any> = computed(() => {
      if (currentComponent.value?.relationKey && fieldList.value) {
        state.currentKey = currentComponent.value?.relationKey || '';
        return fieldList.value.map((v: any) => {
          return v.list
        }).flat().find((v: any) => v.relationKey === currentComponent.value?.relationKey).name;
      } else {
        return '不关联';
      }
    })

    const getDatePlaceTxt = (type: any) => {
      const dateMap: any = {
        'DD/MM/YYYY': 'Date',
        'DD': 'Day',
        'MM': 'Month',
        'YYYY': 'Year'
      }
      return dateMap[type]
    }

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

    const renderFieldList = () => {
      return (
        <el-dialog
          vModel={state.isShow}
          title="选择关联的字段"
          width="70%"
          close-on-click-modal={false}
          close-on-press-escape={false}
        >
          {{
            default: () => {
              return (
                <div class={cx('radioList')}>
                  <div
                    class={cx('radioBtn', { active: !state.currentKey })}
                    onClick={() => {
                      state.currentKey = ''
                    }}
                  >不关联</div>
                  {
                    fieldList.value.map((fieldItem: any) => {
                      return (
                        <div class={cx('radioGroup')}>
                          <div class={cx('radioTitle')}>{fieldItem.name}</div>
                          <div class={cx('radioBox')}>
                            {
                              fieldItem && fieldItem.list.map((keyItem: any) => {
                                return (
                                  <div
                                    class={cx(
                                      'radioBtn', {
                                      active: state.currentKey === keyItem.relationKey,
                                      disabled: !keyItem.component_type.includes(currentComponent.value?.type)
                                    })}
                                    key={keyItem.relationKey}
                                    onClick={() => {
                                      if (!keyItem.component_type.includes(currentComponent.value?.type)) return;
                                      state.currentKey = keyItem.relationKey;
                                      state.currentKeyFullName = keyItem.full_name;
                                    }}
                                  >{keyItem.name}</div>
                                )
                              })
                            }
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            },
            footer: () => {
              return (
                <span>
                  <el-button onClick={() => {
                    state.isShow = false;
                    state.currentKey = currentComponent.value?.relationKey || '';
                  }}>取消</el-button>
                  <el-button type="primary" onClick={() => {
                    changePropertyHandle('relationKey', state.currentKey);
                    state.isShow = false;
                    state.currentKey = currentComponent.value?.relationKey || '';
                    changePropertyHandle('componentName', state.currentKeyFullName);
                  }}>
                    确认
                  </el-button>
                </span>
              )
            }
          }}
        </el-dialog>
      )
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
            [MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.DATE, MaterialTypeMap.SELECT].includes(currentComponent.value.type) && (
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
            [MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>默认值:</div>
                <div class={cx('propertyValue')}>
                  <el-input
                    size="small"
                    style={{ width: '80%' }}
                    clearable
                    modelValue={currentComponent.value.value}
                    placeholder="请输入默认值"
                    maxlength={30}
                    onInput={(val: any) => {
                      changePropertyHandle('value', val)
                    }}
                  ></el-input>
                </div>
              </div>
            )
          }

          {
            [
              MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.CHECKBOX,
              MaterialTypeMap.DATE, MaterialTypeMap.SELECT
            ].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>是否可编辑:</div>
                <div class={cx('propertyValue')}>
                  <el-select
                    size="small"
                    style={{ width: '80%' }}
                    clearable
                    modelValue={currentComponent.value.disabled}
                    placeholder="是否可编辑"
                    onChange={(val: any) => {
                      changePropertyHandle('disabled', val)
                    }}
                  >
                    <el-option label="是" value={false}></el-option>
                    <el-option label="否" value={true}></el-option>
                  </el-select>
                </div>
              </div>
            )
          }

          {
            [
              MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.DATE,
              MaterialTypeMap.SELECT, MaterialTypeMap.IMAGE
            ].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>关联字段:</div>
                <div class={cx('propertyValue')}>
                  <el-button size="small" class={cx('customBtn')} onClick={() => {
                    state.isShow = true;
                  }}>
                    {currentKeyName.value}
                  </el-button>
                </div>
              </div>
            )
          }

          {
            [MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.DATE, MaterialTypeMap.SELECT].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>字号:</div>
                <div class={cx('propertyValue')}>
                  <el-select
                    size="small"
                    style={{ width: '80%' }}
                    clearable
                    modelValue={currentComponent.value.fontSize || 14}
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
            [MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.DATE, MaterialTypeMap.SELECT].includes(currentComponent.value.type) && (
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
            [
              MaterialTypeMap.SINGLE_LINE, MaterialTypeMap.MORE_LINE, MaterialTypeMap.DATE,
              MaterialTypeMap.IMAGE, MaterialTypeMap.SELECT
            ].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>对齐方式:</div>
                <div class={cx('propertyValue')}>
                  <el-select
                    size="small"
                    style={{ width: '80%' }}
                    clearable
                    modelValue={currentComponent.value.align || 'left'}
                    placeholder="请选择对齐方式"
                    onChange={(val: any) => {
                      changePropertyHandle('align', val)
                    }}
                  >
                    {
                      alignList.map((item: any) => {
                        return (
                          <el-option key={item.id} label={item.name} value={item.id}></el-option>
                        )
                      })
                    }
                  </el-select>
                </div>
              </div>
            )
          }

          {
            [
              MaterialTypeMap.IMAGE
            ].includes(currentComponent.value.type) && (
              <div class={cx('propertyItem')}>
                <div class={cx('propertyName')}>缩放方式:</div>
                <div class={cx('propertyValue')}>
                  <el-select
                    size="small"
                    style={{ width: '80%' }}
                    clearable
                    modelValue={currentComponent.value.zoom || 'fixWidth'}
                    placeholder="请选择缩放方式"
                    onChange={(val: any) => {
                      changePropertyHandle('zoom', val)
                    }}
                  >
                    {
                      zoomList.map((item: any) => {
                        return (
                          <el-option key={item.id} label={item.name} value={item.id}></el-option>
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
                      changePropertyHandle('timeFormatType', val);
                      changePropertyHandle('placeholderTxt', getDatePlaceTxt(val));
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
                  changePropertyHandle('x', Number(val) || 0)
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
                  changePropertyHandle('y', Number(val) || 0)
                }}
              ></el-input>
            </div>
          </div>
          {state.isShow && renderFieldList()}
        </div>
      )
    }
  }
})
