import { computed, defineComponent, onMounted, reactive, ref, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import { cloneDeep } from 'lodash';
import { CircleCloseFilled } from '@element-plus/icons-vue';
import { PageItem, ComponentItem, MaterialTypeMap } from '@/store/types/contract';

const cx = classNames.bind(classes);

const componentMap: any = {
  [MaterialTypeMap.SINGLE_LINE]: {
    value: '',
    width: 150,
    height: 30,
    placeholderTxt: '请输入单行文本',
    componentName: '单行文本',
    relationKey: ''
  },
  [MaterialTypeMap.MORE_LINE]: {
    value: '',
    width: 150,
    height: 60,
    placeholderTxt: '请输入多行文本',
    componentName: '多行文本',
    relationKey: ''
  },
  [MaterialTypeMap.CHECKBOX]: {
    value: false,
    width: 30,
    height: 30,
    componentName: '复选框',
    relationKey: ''
  },
  [MaterialTypeMap.DATE]: {
    value: '',
    width: 150,
    height: 30,
    timeFormatType: 'DD/MM/YYYY',
    componentName: '填写日期',
    relationKey: ''
  }
}

export default defineComponent({
  props: {
    pageIndex: Number
  },
  setup(props: any) {
    const store = useStore();
    const state: any = reactive({
      dragIndex: -1,
      virtualX: 0,
      virtualY: 0,
      victuryItem: null
    });

    const pageData: ComputedRef<PageItem> = computed(() => store.state.contract.pageList[props.pageIndex]);
    const currentComponentIndex: ComputedRef<number> = computed(() => store.state.contract.currentComponentIndex);
    const specification: ComputedRef<'A3' | 'A4'> = computed(() => store.state.contract.specification);
    const resizeSchema: ComputedRef<1 | 2> = computed(() => store.state.contract.resizeSchema);

    // 拖拽进入画布后，增加组件
    const addComponent = (type: any, x: any, y: any) => {
      // 根据组件ID将组件添加到画布上的指定位置
      const tempComponent: ComponentItem = {
        id: new Date().getTime(),
        x,
        y,
        type,
        ...componentMap[type]
      };
      store.dispatch('UPDATE_COMPONENT', {
        pageIndex: props.pageIndex,
        componentList: [
          ...pageData.value.componentList,
          tempComponent
        ]
      });
      selectComponent(pageData.value.componentList.length - 1)
    }

    const deleteComponent = (index: any) => {
      const tempList = cloneDeep(pageData.value.componentList);
      tempList.splice(index, 1);
      store.dispatch('UPDATE_COMPONENT', {
        pageIndex: props.pageIndex,
        componentList: tempList
      });
      selectComponent(-1)
    }

    // 拖拽进入画布后，改变组件坐标
    const changeComponent = (id: any, x: any, y: any) => {
      const index = pageData.value.componentList.findIndex((item: any) => {
        return item.id === id
      });
      store.dispatch('EDIT_COMPONENT', {
        pageIndex: props.pageIndex,
        componentIndex: index,
        component: {
          ...pageData.value.componentList[index],
          x,
          y
        }
      });
      selectComponent(index);
    }

    // 拖拽进入画布事件 包括从工具栏拖和在画布内拖
    const handleDrop = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      const { type, id, point_box_x = 0, point_box_y = 0, pagePointIndex } = JSON.parse(event.dataTransfer.getData('text/plain'));
      const canvasEle: any = document.getElementById('contractCanvas' + props.pageIndex);
      if (typeof pagePointIndex === 'number' && pagePointIndex !== props.pageIndex) return;
      const offsetX = event.clientX - canvasEle.getBoundingClientRect().left - point_box_x;
      const offsetY = event.clientY - canvasEle.getBoundingClientRect().top - point_box_y;
      if (id) {
        changeComponent(id, offsetX, offsetY);
      } else {
        addComponent(type, offsetX, offsetY);
      }
    }

    const handleDragOver = (event: any) => {
      event.preventDefault();
    }

    const startDragComponent = (event: any, item: any) => {
      const element: any = document.getElementById(item.id);
      const boundingRect = element.getBoundingClientRect();
      const offsetX = event.clientX - boundingRect.left;
      const offsetY = event.clientY - boundingRect.top;
      event.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          type: item.type,
          id: item.id,
          point_box_x: offsetX,
          point_box_y: offsetY,
          pagePointIndex: props.pageIndex
        })
      );
      state.victuryItem = {
        ...item,
        point_X: offsetX,
        point_Y: offsetY
      }
    }

    const dragComponentHandle = (e: any) => {
      const canvasEle: any = document.getElementById('contractCanvas' + props.pageIndex);
      const offsetX = e.clientX - canvasEle.getBoundingClientRect().left - state.victuryItem.point_X;
      const offsetY = e.clientY - canvasEle.getBoundingClientRect().top - state.victuryItem.point_Y;
      state.victuryItem.x = offsetX;
      state.victuryItem.y = offsetY;
    }

    const startResize = (event: any, index: any, direction: any) => {
      event.preventDefault();
      store.dispatch('EDIT_COMPONENT', {
        pageIndex: props.pageIndex,
        componentIndex: index,
        component: {
          ...pageData.value.componentList[index],
          resizing: true
        }
      });

      const resizeMousemoveHandle = (event: any) => {
        resize(event, index, direction);
      };
      const resizeMouseupHandle = (event: any) => {
        store.dispatch('EDIT_COMPONENT', {
          pageIndex: props.pageIndex,
          componentIndex: index,
          component: {
            ...pageData.value.componentList[index],
            resizing: false
          }
        });
        // 解绑事件处理函数
        window.removeEventListener('mousemove', resizeMousemoveHandle);
        window.removeEventListener('mouseup', resizeMouseupHandle);
      }

      window.addEventListener('mousemove', resizeMousemoveHandle);
      window.addEventListener('mouseup', resizeMouseupHandle);
    };

    const resize = (event: any, index: any, direction: any) => {
      const tempComponent = cloneDeep(pageData.value.componentList[index]);
      if (!tempComponent.resizing) return;
      const canvasEle: any = document.getElementById('contractCanvas' + props.pageIndex);
      const mousemoveX = event.clientX - canvasEle.getBoundingClientRect().left;
      const mousemoveY = event.clientY - canvasEle.getBoundingClientRect().top;
      if (direction === 'leftTop') {
        const tempWidth = tempComponent.x - mousemoveX + tempComponent.width;
        const tempHeight = tempComponent.y - mousemoveY + tempComponent.height;
        if ((tempWidth < 20) || (tempHeight < 20)) {
          return
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.value.componentList[index],
              width: tempWidth,
              height: tempHeight,
              x: mousemoveX,
              y: mousemoveY
            }
          });
        }
      } else if (direction === 'leftBottom') {
        const tempWidth = tempComponent.x - mousemoveX + tempComponent.width;
        const tempHeight = mousemoveY - tempComponent.y;
        if ((tempWidth < 20) || (tempHeight < 20)) {
          return
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.value.componentList[index],
              width: tempWidth,
              height: tempHeight,
              x: mousemoveX,
            }
          });
        }
      } else if (direction === 'rightBottom') {
        const tempWidth = mousemoveX - tempComponent.x;
        const tempHeight = mousemoveY - tempComponent.y;
        if ((tempWidth < 20) || (tempHeight < 20)) {
          return
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.value.componentList[index],
              width: tempWidth,
              height: tempHeight,
            }
          });
        }
      } else if (direction === 'left') {
        const tempWidth = tempComponent.x - mousemoveX + tempComponent.width;
        if (tempWidth < 20) {
          return;
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.value.componentList[index],
              width: tempWidth,
              x: mousemoveX,
            }
          });
        }
      } else if (direction === 'right') {
        const tempWidth = mousemoveX - tempComponent.x;
        if (tempWidth < 20) {
          return
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.value.componentList[index],
              width: tempWidth,
            }
          });
        }
      } else if (direction === 'top') {
        const tempHeight = tempComponent.y - mousemoveY + tempComponent.height;
        if (tempHeight < 20) {
          return;
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.value.componentList[index],
              height: tempHeight,
              y: mousemoveY
            }
          });
        }
      } else if (direction === 'bottom') {
        const tempHeight = mousemoveY - tempComponent.y;
        if (tempHeight < 20) {
          return;
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.value.componentList[index],
              height: tempHeight
            }
          });
        }
      }
    }

    const selectComponent = (componentIndex: any) => {
      store.dispatch('SELECT_COMPONENT', {
        componentIndex,
        pageIndex: props.pageIndex
      })
    }

    const renderComponent = (item: ComponentItem) => {
      if (item.type === MaterialTypeMap.SINGLE_LINE) {
        return (
          <div class={cx('singleLine')}>{item.value || item.placeholderTxt}</div>
        )
      }

      if (item.type === MaterialTypeMap.MORE_LINE) {
        return (
          <div
            class={cx('moreLine')}
            style={{
              lineHeight: item.lineHeight || 1.2,
            }}
          >{item.value || item.placeholderTxt}</div>
        )
      }

      if (item.type === MaterialTypeMap.CHECKBOX) {
        return (
          <el-checkbox style={{ marginLeft: '7px', marginTop: '6px' }} model-value={item.value}></el-checkbox>
        )
      }
      if (item.type === MaterialTypeMap.DATE) {
        return (
          <div class={cx('singleLine')}>{item.value || item.timeFormatType}</div>
        )
      }

    }

    return () => {
      return (
        <div
          id={'contractCanvas' + props.pageIndex}
          class={cx('canvasContent', { a3Page: specification.value === 'A3' })}
          onDrop={handleDrop}
          onDragover={handleDragOver}
        >
          <img src={pageData.value.backgroundUrl} class={cx('backUrl')} alt="" crossorigin="anonymous" draggable="false" />
          {/* 组件列表 */}
          {
            pageData.value.componentList.map((item: ComponentItem, index: number) => {
              return <div
                id={item.id + ''}
                class={cx('dragItem', { active: index === currentComponentIndex.value })}
                style={{
                  left: item.x + 'px',
                  top: item.y + 'px',
                  width: item.width + 'px',
                  height: item.height + 'px',
                  color: item.value ? '#000' : '#bebebe',
                  fontSize: `${item.fontSize || 16}px`,
                  letterSpacing: item.letterSpace + 'px',
                  opacity: state.victuryItem && state.victuryItem.id === item.id ? 0 : 1
                }}
                draggable
                onClick={(e: any) => {
                  e.stopPropagation();
                  selectComponent(index);
                }}
                onDragstart={(e: any) => {
                  startDragComponent(e, item);
                }}
                onDrag={(e: any) => {
                  dragComponentHandle(e);
                }}
                onDragend={() => {
                  state.victuryItem = null;
                }}
              >
                {
                  (index === currentComponentIndex.value && resizeSchema.value === 1) && (
                    <div class={cx('leftTopPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'leftTop')}></div>
                  )
                }
                {
                  (index === currentComponentIndex.value && resizeSchema.value === 1) && (
                    <div class={cx('leftBottomPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'leftBottom')}></div>
                  )
                }
                {
                  (index === currentComponentIndex.value && resizeSchema.value === 1) && (
                    <div class={cx('rightBottomPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'rightBottom')}></div>
                  )
                }

                {
                  (index === currentComponentIndex.value && resizeSchema.value === 2) && (
                    <div class={cx('leftPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'left')}></div>
                  )
                }
                {
                  (index === currentComponentIndex.value && resizeSchema.value === 2) && (
                    <div class={cx('rightPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'right')}></div>
                  )
                }
                {
                  (index === currentComponentIndex.value && resizeSchema.value === 2) && (
                    <div class={cx('topPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'top')}></div>
                  )
                }
                {
                  (index === currentComponentIndex.value && resizeSchema.value === 2) && (
                    <div class={cx('bottomPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'bottom')}></div>
                  )
                }

                {
                  index === currentComponentIndex.value && (
                    <el-icon
                      class={cx('rightTopBtn')}
                      onMousedown={(e: any) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      size={16}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        e.preventDefault();
                        deleteComponent(index);
                      }}
                    ><CircleCloseFilled /></el-icon>
                  )
                }
                {renderComponent(item)}
              </div>
            })
          }
          {/* 虚拟拖拽内容 */}
          {
            state.victuryItem && (
              <div
                id={state.victuryItem.id + 'virtual'}
                class={cx('dragItem', 'victuryItem')}
                style={{
                  left: state.victuryItem.x + 'px',
                  top: state.victuryItem.y + 'px',
                  width: state.victuryItem.width + 'px',
                  height: state.victuryItem.height + 'px',
                  color: state.victuryItem.value ? '#000' : '#bebebe',
                  fontSize: `${state.victuryItem.fontSize || 16}px`,
                  letterSpacing: state.victuryItem.letterSpace + 'px'
                }}
              >
                {renderComponent(state.victuryItem)}
              </div>
            )
          }
        </div>
      )
    }
  }
})
