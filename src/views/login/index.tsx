import { defineComponent, reactive, onMounted, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router';
import classes from './index.module.scss'
import { login } from '@/apis/user';
export default defineComponent({
  name: "Login",
  setup() {

    const ruleFormRef: any = ref()
    const router = useRouter();
    const state: any = reactive({
      loginForm: {
        mobile: '',
        password: ''
      },
      btnLoading: false
    });

    const rules = reactive({
      mobile: [{ required: true, message: '请输入手机号', max: 11, trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    })

    const submit = () => {
      localStorage.setItem('token', '123456')
      router.push('/record');
      // state.btnLoading = true;
      // ruleFormRef.value.validate( async (valid: any) => {
      //   if (valid) {
      //     const res: any = await login(state.loginForm)
      //     if (res.code === 1) {
      //       localStorage.setItem('authInfo', JSON.stringify(res.data))
      //       localStorage.setItem('token', JSON.stringify(res.data.authKey))
      //       router.push('/');
      //     }
      //     console.log(res);
      //   } else {
      //     console.log('出错了')
      //   }
      //   state.btnLoading = false;
      // })
    }

    onMounted(() => {
    })

    return () => {
      return (
        <div class={classes.loginContainer}>
          <div class={classes.homeBg}>
            <div class={classes.logoBg}></div>
          </div>
          <div class={classes.rightContainer}>
            <div class={classes.loginFormContainer}>
              <h1 >
                欢迎登录小熊客景管理系统
              </h1>
              <el-form 
                model={state.loginForm}
                ref={ruleFormRef}
                rules={rules}
              >
                <el-form-item prop="mobile">
                  <el-input
                    vModel={state.loginForm.mobile}
                    type="text"
                    placeholder="请输入用户名"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    vModel={state.loginForm.password}
                    type="password"
                    placeholder="请输入密码"
                  >
                  </el-input>
                </el-form-item>
              </el-form>
              <el-button  
                onClick={() => {
                  submit();
                }} 
                type="primary"
                loading={state.btnLoading}
              >登录</el-button>
            </div>
          </div>
          
        </div>
      )
    }
  }
})
