import { defineComponent, onMounted, reactive, ref, computed, ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import classes from './index.module.scss';
import classNames from 'classnames/bind';
import { ElMessage } from 'element-plus';
import { ArrowDownBold } from '@element-plus/icons-vue';
import { MaterialItem } from '@/store/types/contract';
import { createContract } from '@/apis/contract';

const cx = classNames.bind(classes);

const statusMap: any = {
  0: '删除',
  1: '未审核',
  2: '已审核'
}

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const materialList: ComputedRef<MaterialItem[]> = computed(() => store.state.contract.materialList);
    const pageStatus: ComputedRef<any> = computed(() => store.state.contract.status);

    // 开始拖拽工具栏组件事件
    const startDragUtil = (event: any, item: MaterialItem) => {
      // 设置拖动的数据
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: item.type }));
    }

    // 保存合同
    const saveContract = async (type: any) => {
      console.log(store.state.contract.pageList)
      const res = await createContract({
        contract_template_uuid: router.currentRoute.value.query.contract_template_uuid,
        template_page_data: JSON.stringify(store.state.contract.pageList),
        status: pageStatus.value,
        is_delete: pageStatus.value === 0 ? 1 : 0
      });
      if (res) {
        ElMessage.success('保存成功');
        if (type) {
          window.close();
        }
      }
    }

    const getBtnTxt = (val: any) => {
      const txtMap: any = {
        '1': 'A3 横向',
        '2': 'A4 横向',
        '3': 'A3 直向',
        '4': 'A4 直向',
      }
      return txtMap[val];
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
            <el-button class={cx('btn')}>
              规格:  {getBtnTxt(store.state.contract.specification)}
            </el-button>
            <el-dropdown
              size="large"
              trigger="click"
              onCommand={(val: any) => {
                store.dispatch('UPDATE_STATUS', {
                  status: val
                })
              }}
            >
              {{
                default: () => {
                  return (
                    <el-button class={cx('btn')} size="small">
                      状态: {statusMap[pageStatus.value]}  <el-icon size={10} ><ArrowDownBold /></el-icon>
                    </el-button>
                  );
                },
                dropdown: () => {
                  return (
                    <el-dropdown-menu>
                      {
                        Object.keys(statusMap).map((item: any) => {
                          return (
                            <el-dropdown-item key={item} command={item}>{statusMap[item]}</el-dropdown-item>
                          )
                        })
                      }
                    </el-dropdown-menu>
                  );
                },
              }}
            </el-dropdown>
            <el-button onClick={() => saveContract(0)} type="primary" class={cx('btn')}>保存</el-button>
            <el-button onClick={() => saveContract(1)} type="primary" class={cx('btn')}>保存并关闭</el-button>
          </div>
        </div>
      )
    }
  }
})
