import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default defineComponent({
  setup() {
    const store = useStore();

    const state: any = reactive({
      toolList: [
        {
          type: 1,
          name: '文本'
        }
      ],
    });

    // 开始拖拽工具栏组件事件
    const startDragUtil = (event: any, item: any) => {
      // 设置拖动的数据
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: item.type }));
    }

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

    return () => {
      return (
        <div class={classes.typeList}>
          {
            state.toolList.map((item: any) => {
              return (
                <div class={classes.typeBox} draggable ondragstart={(event: any) => startDragUtil(event, item)}>
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
  }
})
