import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import { cloneDeep } from 'lodash';
import { CircleCloseFilled } from '@element-plus/icons-vue';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default defineComponent({
  props: {
    pageIndex: Number
  },
  setup(props: any) {
    const store = useStore();
    const pageData: any = computed(() => store.state.contract.pageList[props.pageIndex]);
    const currentComponentIndex = computed(() => store.state.contract.currentComponentIndex);
    const state: any = reactive({

    });

    // 拖拽进入画布后，增加组件
    const addComponent = (type: any, x: any, y: any) => {
      // 根据组件ID将组件添加到画布上的指定位置
      const tempComponent = { id: new Date().getTime(), x, y, type, value: '默认值', width: 120, height: 30 };
      store.dispatch('UPDATE_COMPONENT', {
        pageIndex: props.pageIndex,
        componentList: [
          ...pageData.value.componentList,
          tempComponent
        ]
      })
    }

    const deleteComponent = (index: any) => {
      const tempList = cloneDeep(pageData.value.componentList);
      tempList.splice(index, 1);
      store.dispatch('UPDATE_COMPONENT', {
        pageIndex: props.pageIndex,
        componentList: tempList
      })
    }

    // 拖拽进入画布后，改变组件坐标
    const changeComponent = (id: any, x: any, y: any) => {
      const index = pageData.value.componentList.findIndex((item: any) => {
        return item.id === id
      })
      store.dispatch('EDIT_COMPONENT', {
        pageIndex: props.pageIndex,
        componentIndex: index,
        component: {
          ...pageData.value.componentList[index],
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
          ...pageData.value.componentList[index],
          resizing: true
        }
      });
      window.addEventListener('mousemove', (event) => {
        resize(event, index, direction);
      });
      window.addEventListener('mouseup', () => {
        store.dispatch('EDIT_COMPONENT', {
          pageIndex: props.pageIndex,
          componentIndex: index,
          component: {
            ...pageData.value.componentList[index],
            resizing: false
          }
        });
      });
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
        if ((tempWidth < 10) || (tempHeight < 10)) {
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
        if ((tempWidth < 10) || (tempHeight < 10)) {
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
        if ((tempWidth < 10) || (tempHeight < 10)) {
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
      }
    }

    const selectComponent = (componentIndex: any) => {
      store.dispatch('SELECT_COMPONENT', {
        componentIndex,
        pageIndex: props.pageIndex
      })
    }


    console.log(pageData, 'pageData')

    return () => {
      return (
        <div
          id={'contractCanvas' + props.pageIndex}
          class={classes.canvasContent}
          ondrop={handleDrop}
          ondragover={handleDragOver}
          onClick={() => {
            selectComponent(-1)
          }}
        >
          <img src={pageData.value.backgroundUrl} class={classes.backUrl} alt="" crossOrigin="anonymous" draggable="false" />
          {/* 组件列表 */}
          {
            pageData.value.componentList.map((item: any, index: number) => {
              if (item.type === 1) {
                return <div
                  id={item.id}
                  class={index === currentComponentIndex.value ? [classes.dragItem, classes.active] : classes.dragItem}
                  style={{ left: item.x + 'px', top: item.y + 'px', width: item.width + 'px', height: item.height + 'px' }}
                  draggable
                  onClick={(e: any) => {
                    e.stopPropagation();
                    selectComponent(index);
                  }}
                  ondragstart={(e: any) => {
                    startDragComponent(e, item);
                  }}
                >
                  {
                    index === currentComponentIndex.value && (
                      <div class={[classes.leftTopPoint, classes.point]} onMousedown={(e: any) => startResize(e, index, 'leftTop')}></div>
                    )
                  }
                  {
                    index === currentComponentIndex.value && (
                      <div class={[classes.leftBottomPoint, classes.point]} onMousedown={(e: any) => startResize(e, index, 'leftBottom')}></div>
                    )
                  }

                  <div class={[classes.rightBottomPoint, classes.point]} onMousedown={(e: any) => startResize(e, index, 'rightBottom')}></div>
                  <el-icon
                    class={classes.rightTopPoint}
                    onMousedown={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault()
                    }}
                    size={16}
                    onClick={() => {
                      deleteComponent(index);
                    }}
                  ><CircleCloseFilled /></el-icon>
                  {item.value}
                </div>
              }
              return null
            })
          }
        </div>
      )
    }
  }
})
