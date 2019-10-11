<template>
  <div class="login-container">
    <div class="title">
        <span>源码漏洞扫描系统</span>
      </div>
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="80px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" id="lab" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 底部按钮组 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="valid">登录</el-button>
          <el-button type="success" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLogin } from '@/api/login/api.js'
export default {
  // 这里面写data methods computed这些...
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      //表单验证规则
      loginFormRules: {
        //验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在3到5个字符', trigger: 'blur' }
        ],
        //验证密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '请输入3~16位密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted(){
    
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    valid() {
      this.$refs.loginFormRef.validate( valid => {
        if (!valid) {
          this.$message.error('请完善表单信息')
        }else{
          // 发送请求验证用户名和密码是否正确
          getLogin(this.loginForm).then((res) => {
            console.log(res);
            if(res.code == -6){
              return this.$message.success('用户名或者密码不正确') 
            }
            if(res.code == 0){
               this.$message.success('登陆成功')
               window.sessionStorage.setItem('isLogin', 'true')
               this.$router.push('/home')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// 写样式 lang 选择用的css语法 css less scss stylus
// scoped : 局部样式
.title{
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-top: 150px;
  text-shadow: 0 0 10px rgb(200, 221, 131);
}
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
}
.login-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
}
.avatar_box {
  height: 130px;
  width: 130px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px#ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgb(231, 230, 230);
  }
}
.login_form {
  position: absolute;
  bottom: 20px;
  width: 100%;
  padding-right: 20px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
