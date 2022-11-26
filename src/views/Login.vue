<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avarat_box">
        <img src="../assets/logo.gif" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        class="login_form"
        :rules="loginFormRules"
        :model="loginForm"
        ref="loginFormRef"
      >
        <!-- name -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- upwd -->
        <el-form-item prop="password">
          <el-input
            :type="upwdHide ? 'password' : 'text'"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      upwdHide: true,
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //  表单验证规则对象
      loginFormRules: {
        // 验证用户名
        uname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度为3-10字符之间",
            trigger: "blur",
          },
        ],
        // 验证密码
        upwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度为3-10字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await this.$axios.post("login", this.loginForm);
        // console.log(res);
        if(res.data.meta.status !== 200){
            return this.$message.error('登陆失败了');
        }else{
            this.$message.success('登录成功');
        }
        // 1.将登陆成功的token保存在客户端sessionStorage中
        // 项目中除了登陆之外的api都需要token  token只应当在当前网站打开期间生效 所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token',res.data.data.token)
        // 2.通过编程式导航跳转到后台主页 路由地址是/home
        this.$router.push('/home')
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(88, 198, 231);
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 24px gray;

  .avarat_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 3px;
    box-shadow: 0 0 10px #bbb;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 30px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: space-between;
  .el-button {
    margin: 0 15px;
  }
}
</style>
