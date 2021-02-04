<template>
  <el-form ref="loginForm" :model="loginForm" :rules="fieldRules" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
        <span class="tool-bar">
            <!-- 主题切换 -->
            <theme-picker style="float:right;" class="theme-picker" @onThemeChange="onThemeChange"/>
          <!-- :default="themeColor"
                          @onThemeChange="onThemeChange"/> -->
          <!-- 语言切换 -->
          <!-- <lang-selector class="lang-selector"></lang-selector>    -->
        </span>
    <h2 class="title" style="padding-left:22px;">系统登录</h2>
    <el-form-item prop="account">
      <el-input v-model="loginForm.account" type="text" auto-complete="off" placeholder="账号"/>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"/>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-form-item prop="captcha">
          <el-input v-model="loginForm.captcha" type="test" auto-complete="off" placeholder="验证码, 单击图片刷新"
                    style="width: 100%;"/>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="1">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
          <img style="width: 100%;" class="pointer" :src="loginForm.src" @click="refreshCaptcha">
        </el-form-item>
      </el-col>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:48%;" @click.native.prevent="reset">重 置</el-button>
      <el-button type="primary" style="width:48%;" :loading="loading" @click.native.prevent="login">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from 'js-cookie'
import ThemePicker from '@/components/ThemePicker'
import LangSelector from '@/components/LangSelector'
import { login } from '@/api/user'

export default {
  name: 'Login',
  components: {
    ThemePicker,
    LangSelector
  },
  data () {
    return {
      loading: false,
      loginForm: {
        account: 'admin',
        password: 'admin',
        captcha: '',
        src: ''
      },
      fieldRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
        // ,
        // captcha: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' }
        // ]
      },
      checked: true
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.app.themeColor
    })
  },
  mounted () {
    this.refreshCaptcha()
  },
  methods: {
    login () {
      this.loading = true
      // let userInfo = {userName: this.loginForm.account, password: this.loginForm.password, captcha: this.loginForm.captcha}
      const userInfo = {
        user: this.loginForm.account,
        password: this.loginForm.password
      }
      login(userInfo)
        .then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
          } else {
            Cookies.set('uid', res.data) // 放置用户Id到Cookie
            sessionStorage.setItem('user', userInfo.user) // 保存用户到本地会话
            sessionStorage.setItem('userId', res.data) // 保存用户Id到本地会话
            // this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
            this.$router.push('/') // 登录成功，跳转到主页
          }
          this.loading = false
        })
        .catch(res => {
          this.$message({ message: res.message, type: 'error' })
        })
    },
    refreshCaptcha: function () {
      // this.loginForm.src = this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
    },
    reset () {
      this.$refs.loginForm.resetFields()
    },
    // 切换主题
    onThemeChange: function (themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
      margin: 0 auto 30px auto;
      text-align: center;
      color: #505458;
    }

    .remember {
      margin: 0 0 35px 0;
    }
  }
</style>
