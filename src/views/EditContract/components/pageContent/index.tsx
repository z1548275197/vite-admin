import { computed, defineComponent, onMounted, reactive, ref, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import { cloneDeep } from 'lodash';
import { CircleCloseFilled } from '@element-plus/icons-vue';
import { PageItem, ComponentItem } from '@/store/types/contract';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const cx = classNames.bind(classes);

const componentMap: any = {
  1: {
    value: '',
    width: 150,
    height: 30,
    placeholderTxt: '请输入单行文本',
    componentName: '单行文本'
  },
  2: {
    value: '',
    width: 150,
    height: 60,
    placeholderTxt: '请输入多行文本',
    componentName: '多行文本'
  },
  3: {
    value: false,
    width: 30,
    height: 30,
    componentName: '复选框'
  },
  4: {
    value: '',
    width: 150,
    height: 30,
    timeFormatType: 'DD/MM/YYYY',
    componentName: '填写日期'
  }
}

export default defineComponent({
  props: {
    pageIndex: Number
  },
  setup(props: any) {
    const store = useStore();
    const pageData: PageItem = computed(() => store.state.contract.pageList[props.pageIndex]).value;
    const currentComponentIndex = computed(() => store.state.contract.currentComponentIndex);
    const state: any = reactive({

    });

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
          ...pageData.componentList,
          tempComponent
        ]
      })
    }

    const deleteComponent = (index: any) => {
      const tempList = cloneDeep(pageData.componentList);
      tempList.splice(index, 1);
      store.dispatch('UPDATE_COMPONENT', {
        pageIndex: props.pageIndex,
        componentList: tempList
      })
    }

    // 拖拽进入画布后，改变组件坐标
    const changeComponent = (id: any, x: any, y: any) => {
      const index = pageData.componentList.findIndex((item: any) => {
        return item.id === id
      })
      store.dispatch('EDIT_COMPONENT', {
        pageIndex: props.pageIndex,
        componentIndex: index,
        component: {
          ...pageData.componentList[index],
          x,
          y
        }
      })
    }

    // 拖拽进入画布事件 包括从工具栏拖和在画布内拖
    const handleDrop = (event: any) => {
      event.preventDefault();
      event.stopPropagation()
      const { type, id, point_box_x = 0, point_box_y = 0, pagePointIndex } = JSON.parse(event.dataTransfer.getData('text/plain'));
      const canvasEle: any = document.getElementById('contractCanvas' + props.pageIndex);
      if (typeof pagePointIndex === 'number' && pagePointIndex !== props.pageIndex) return;
      const offsetX = event.clientX - canvasEle.getBoundingClientRect().left - point_box_x;
      const offsetY = event.clientY - canvasEle.getBoundingClientRect().top - point_box_y;
      if (id) {
        changeComponent(id, offsetX, offsetY)
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
    }



    const startResize = (event: any, index: any, direction: any) => {
      event.preventDefault();
      store.dispatch('EDIT_COMPONENT', {
        pageIndex: props.pageIndex,
        componentIndex: index,
        component: {
          ...pageData.componentList[index],
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
            ...pageData.componentList[index],
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
      const tempComponent = cloneDeep(pageData.componentList[index]);
      if (!tempComponent.resizing) return;
      const canvasEle: any = document.getElementById('contractCanvas' + props.pageIndex);
      const mousemoveX = event.clientX - canvasEle.getBoundingClientRect().left;
      const mousemoveY = event.clientY - canvasEle.getBoundingClientRect().top;
      if (direction === 'leftTop') {
        const tempWidth = tempComponent.x - mousemoveX + tempComponent.width;
        const tempHeight = tempComponent.y - mousemoveY + tempComponent.height;
        if ((tempWidth < 10) || (tempHeight < 10)) {
          return
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.componentList[index],
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
        if ((tempWidth < 10) || (tempHeight < 10)) {
          return
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.componentList[index],
              width: tempWidth,
              height: tempHeight,
              x: mousemoveX,
            }
          });
        }
      } else if (direction === 'rightBottom') {
        const tempWidth = mousemoveX - tempComponent.x;
        const tempHeight = mousemoveY - tempComponent.y;
        if ((tempWidth < 10) || (tempHeight < 10)) {
          return
        } else {
          store.dispatch('EDIT_COMPONENT', {
            pageIndex: props.pageIndex,
            componentIndex: index,
            component: {
              ...pageData.componentList[index],
              width: tempWidth,
              height: tempHeight,
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
      if (item.type === 1) {
        return (
          <div class={cx('singleLine')}>{item.value || item.placeholderTxt}</div>
        )
      }

      if (item.type === 2) {
        return (
          <div class={cx('moreLine')}>{item.value || item.placeholderTxt}</div>
        )
      }

      if (item.type === 3) {
        return (
          <el-checkbox style={{ marginLeft: '7px', marginTop: '6px' }} model-value={item.value}></el-checkbox>
        )
      }
      if (item.type === 4) {
        return <span>{item.value || item.timeFormatType}</span>
      }

    }

    return () => {
      return (
        <div
          id={'contractCanvas' + props.pageIndex}
          class={cx('canvasContent')}
          onDrop={handleDrop}
          onDragover={handleDragOver}
          onClick={() => {
            selectComponent(-1)
          }}
        >
          <img src={pageData.backgroundUrl} class={cx('backUrl')} alt="" crossorigin="anonymous" draggable="false" />
          {/* 组件列表 */}
          {
            pageData.componentList.map((item: ComponentItem, index: number) => {
              return <div
                id={item.id + ''}
                class={cx('dragItem', { active: index === currentComponentIndex.value })}
                style={{
                  left: item.x + 'px',
                  top: item.y + 'px',
                  width: item.width + 'px',
                  height: item.height + 'px',
                  color: item.value ? '#000' : '#bebebe',
                  fontSize: `${item.fontSize || 16}px`
                }}
                draggable
                onClick={(e: any) => {
                  e.stopPropagation();
                  selectComponent(index);
                }}
                onDragstart={(e: any) => {
                  startDragComponent(e, item);
                }}
              >
                {
                  index === currentComponentIndex.value && (
                    <div class={cx('leftTopPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'leftTop')}></div>
                  )
                }
                {
                  index === currentComponentIndex.value && (
                    <div class={cx('leftBottomPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'leftBottom')}></div>
                  )
                }
                {
                  index === currentComponentIndex.value && (
                    <div class={cx('rightBottomPoint', 'point')} onMousedown={(e: any) => startResize(e, index, 'rightBottom')}></div>
                  )
                }
                {
                  index === currentComponentIndex.value && (
                    <el-icon
                      class={cx('rightTopPoint')}
                      onMousedown={(e: any) => {
                        e.stopPropagation();
                        e.preventDefault()
                      }}
                      size={16}
                      onClick={() => {
                        deleteComponent(index);
                      }}
                    ><CircleCloseFilled /></el-icon>
                  )
                }
                {renderComponent(item)}
              </div>
            })
          }
        </div>
      )
    }
  }
})
