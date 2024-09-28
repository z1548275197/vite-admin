import { defineComponent, onMounted, reactive, ref } from 'vue'
import classes from './index.module.scss'
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default defineComponent({
  setup() {

    const state: any = reactive({
    });

    return () => {
      return (
        <div>
          这是我的内容
        </div>
      )
    }
  }
})
