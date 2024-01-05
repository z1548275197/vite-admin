import { defineComponent, onMounted, reactive, ref } from 'vue'
import classes from './index.module.scss'
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const componetType: any = {
  1: '文本'
}

export default defineComponent({
  setup() {
    const printRef = ref()

    const state: any = reactive({
      componentList: [
        {
          id: 'test1111',
          type: 1,
          x: 0,
          y: 0,
          value: '111',
          width: 120,
          height: 30,
        },
        {
          id: 'test2222',
          type: 1,
          x: 0,
          y: 1050,
          value: '222',
          width: 120,
          height: 30,
        },
        {
          id: 'test3333',
          type: 1,
          x: 750,
          y: 800,
          value: '333',
          width: 120,
          height: 30,
        },
      ],
      typeList: [
        {
          type: 1,
          name: '文本'
        }
      ],
      backgroundUrl: 'https://fr-static.jiazhengye.cn/0001.0388eb5ca865f91f.jpg',
      currentComponentIndex: -1,
    });


    // 开始拖拽工具栏组件事件
    const startDragUtil = (event: any, item: any) => {
      // 设置拖动的数据
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: item.type }));
    }

    const startDragComponent = (event: any, item: any) => {
      const element: any = document.getElementById(item.id);
      const boundingRect = element.getBoundingClientRect();
      const offsetX = event.clientX - boundingRect.left;
      const offsetY = event.clientY - boundingRect.top;
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: item.type, id: item.id, point_box_x: offsetX, point_box_y: offsetY }));
    }

    // 拖拽进入画布事件 包括从工具栏拖和在画布内拖
    const handleDrop = (event: any) => {
      event.preventDefault();
      event.stopPropagation()
      const canvasEle: any = document.getElementById('canvas');
      const { type, id, point_box_x = 0, point_box_y = 0 } = JSON.parse(event.dataTransfer.getData('text/plain'));
      const offsetX = event.clientX - canvasEle.getBoundingClientRect().left - point_box_x;
      const offsetY = event.clientY - canvasEle.getBoundingClientRect().top - point_box_y;
      if (id) {
        changeComponent(id, offsetX, offsetY)
      } else {
        addComponent(type, offsetX, offsetY);
      }
    }

    // 拖拽进入画布后，改变组件坐标
    const changeComponent = (id: any, x: any, y: any) => {
      const index = state.componentList.findIndex((item: any) => {
        return item.id === id
      })
      state.componentList[index].x = x;
      state.componentList[index].y = y
    }

    // 拖拽进入画布后，增加组件
    const addComponent = (type: any, x: any, y: any) => {
      // 根据组件ID将组件添加到画布上的指定位置
      const tempComponent = { id: new Date().getTime(), x, y, type, value: '默认值', width: 120, height: 30 };
      state.componentList.push(tempComponent);
    }

    const handleDragOver = (event: any) => {
      event.preventDefault();
    }

    const resize = (event: any, index: any, direction: any) => {
      const tempComponent = state.componentList[index]
      if (!tempComponent.resizing) return;
      const canvasEle: any = document.getElementById('canvas');
      const mousemoveX = event.clientX - canvasEle.getBoundingClientRect().left
      const mousemoveY = event.clientY - canvasEle.getBoundingClientRect().top

      if (!tempComponent.resizing) return;
      if (direction === 'leftTop') {
        const tempWidth = tempComponent.x - mousemoveX + tempComponent.width;
        const tempHeight = tempComponent.y - mousemoveY + tempComponent.height;
        if ((tempWidth < 10) || (tempHeight < 10)) {
          return
        } else {
          state.componentList[index].width = tempComponent.x - mousemoveX + tempComponent.width;
          state.componentList[index].height = tempComponent.y - mousemoveY + tempComponent.height;
          state.componentList[index].x = mousemoveX;
          state.componentList[index].y = mousemoveY;
        }
      }
    }

    const startResize = (event: any, index: any, direction: any) => {
      event.preventDefault();
      const tempComponent = state.componentList[index]
      tempComponent.resizing = true;
      window.addEventListener('mousemove', (event) => {
        resize(event, index, direction);
      });
      window.addEventListener('mouseup', () => {
        const tempComponent = state.componentList[index]
        tempComponent.resizing = false;
      });
    };

    // 生成pdf并打开
    const addPdf = () => {

      const doc = new jsPDF({
        // orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });


      html2canvas(document.querySelector('#canvas') as any, {
        useCORS: true,
      }).then(canvas => {
        // 将 canvas 元素转换为图像数据
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        // 将图像数据添加到 PDF 文档中
        doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, 'image', 'FAST');
        // doc.addPage()
        // doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, 'image', 'FAST');
        // doc.addPage()
        // doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, 'image', 'FAST');
        // 下载 PDF 文件
        doc.save('html-to-pdf.pdf');
        doc.output('dataurlnewwindow');
      });
    }
    // 保存合同
    // 
    const saveContract = () => {

    }


    // 工具栏渲染
    const renderHeader = () => {
      return (
        <div class={classes.typeList}>
          {
            state.typeList.map((item: any) => {
              return (
                <div class={classes.typeBox} draggable onDragstart={(event: any) => startDragUtil(event, item)}>
                  <div class={classes.typeName}>{item.name}</div>
                </div>
              )
            })
          }
          <el-button onClick={addPdf}>生成PDF</el-button>
          <el-button onClick={saveContract}>保存合同</el-button>
        </div>
      )
    }

    // 画布渲染
    const renderCanvas = () => {
      return (
        <div id='canvas' class={classes.canvasContent} onDrop={handleDrop} onDragover={handleDragOver} onClick={() => {
          state.currentComponentIndex = -1
        }}>
          {/* 背景图 */}
          <img src={state.backgroundUrl} class={classes.backUrl} alt="" crossOrigin="anonymous" draggable="false" />
          {/* 组件列表 */}
          {
            state.componentList.map((item: any, index: number) => {
              if (item.type === 1) {
                return <div
                  id={item.id}
                  class={index === state.currentComponentIndex ? [classes.dragItem, classes.active] : classes.dragItem}
                  style={{ left: item.x + 'px', top: item.y + 'px', width: item.width + 'px', height: item.height + 'px' }}
                  draggable
                  onClick={(e: any) => {
                    e.stopPropagation();
                    state.currentComponentIndex = index;
                  }}
                  onDragstart={(e: any) => {
                    startDragComponent(e, item);
                  }}
                >
                  <div class={[classes.leftTopPoint, classes.point]} onMousedown={(e: any) => startResize(e, index, 'leftTop')}></div>
                  {/* <div class={[classes.rightTopPoint, classes.point]}></div>
                    <div class={[classes.leftBottomPoint, classes.point]}></div>
                    <div class={[classes.rightBottomPoint, classes.point]}></div> */}
                  {item.value}
                </div>
              }
              return null
            })
          }
          {/* 坐上拖拽点 */}

        </div>
      )
    }

    // 右侧组件内容渲染
    const renderRightContent = () => {
      return (
        <div>
          组件{state.currentComponentIndex + 1}
          <div>值</div>
          <div>
            <el-input key={state.currentComponentIndex} vModel={state.componentList[state.currentComponentIndex].value}></el-input>
          </div>
        </div>
      )
    }

    // 左侧组件列表渲染
    const renderLeftContent = () => {
      return (
        <div>
          {
            state.componentList.map((item: any) => {
              return (
                <div>
                  {componetType[item.type]}
                </div>
              )
            })
          }
        </div>
      )
    }



    return () => {
      return (
        <el-container class={classes.container}>
          <el-header class={classes.header}>
            {renderHeader()}
          </el-header>
          <el-container>
            <el-aside width="200px" class={classes.leftAside}>
              {renderLeftContent()}
            </el-aside>
            <el-main class={classes.main}>
              {renderCanvas()}
            </el-main>
            <el-aside width="200px" class={classes.rightAside}>
              {state.currentComponentIndex >= 0 && renderRightContent()}
            </el-aside>
          </el-container>
        </el-container>
      )
    }
  }
})
