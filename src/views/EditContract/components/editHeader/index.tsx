import { defineComponent, onMounted, reactive, ref, computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ArrowRightBold } from '@element-plus/icons-vue';
import { MaterialItem } from '@/store/types/contract';

const cx = classNames.bind(classes);

export default defineComponent({
  setup() {
    const store = useStore();
    const materialList: ComputedRef<MaterialItem[]> = computed(() => store.state.contract.materialList);

    // 开始拖拽工具栏组件事件
    const startDragUtil = (event: any, item: MaterialItem) => {
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
      console.log(store.state.contract.pageList)
    }

    return () => {
      return (
        <div class={cx('headerContainer')}>
          <div class={cx('toolBox')}>
            {
              materialList.value.map((item: MaterialItem) => {
                return (
                  <div
                    key={item.type}
                    class={cx('toolItem')}
                    draggable
                    onDragstart={(event: any) => startDragUtil(event, item)}
                  >
                    <img class={cx('toolImg')} src={item.icon} alt="" draggable="false" />
                    <div class={cx('toolName')}>{item.name}</div>
                  </div>
                )
              })
            }
          </div>
          <div class={cx('btnBox')}>
            {/* <el-button onClick={addPdf}>生成PDF</el-button> */}
            <el-button onClick={saveContract} class={cx('btn')}>
              规格: {store.state.contract.specification}
            </el-button>
            <el-button onClick={saveContract} class={cx('btn')}>
              状态: 审核
              <el-icon size={12} class={cx('btnIcon')}><ArrowRightBold /></el-icon>
            </el-button>
            <el-button onClick={saveContract} type="primary" class={cx('btn')}>保存</el-button>
            <el-button onClick={saveContract} type="primary" class={cx('btn')}>保存并关闭</el-button>
          </div>
        </div>
      )
    }
  }
})
