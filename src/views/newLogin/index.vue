<template>
  <el-container>
    <el-header>
      <p class="">
        <!--
        —— 私活利器，轻松实现你的睡后收入！
        -->
      </p>
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </el-header>

    <el-main>
      <el-container>
        <el-main class="login-main">
          <div class="login-panel">
            <!-- logo -->
            <div class="login-title">
              <img src="../../assets/logo.png">
              <div class="app-title">灵动快速开发平台</div>
            </div>
            <!-- form -->
            <div>
              <el-card shadow="never">
                <el-form
                        ref="loginForm"
                        label-position="top"
                        :rules="rules"
                        :model="formLogin"
                        size="default">
                  <el-form-item prop="username">
                    <el-input
                            type="text"
                            v-model="formLogin.username"
                            placeholder="用户名">
                      <i slot="prepend" class="el-icon-user"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                            type="password"
                            v-model="formLogin.password"
                            @keyup.enter.native="login"
                            placeholder="密码">
                      <i slot="prepend" class="el-icon-key"></i>
                    </el-input>
                  </el-form-item>
                  <el-button
                          size="default"
                          @click="login"
                          type="primary"
                          class="button-login">登 录</el-button>
                  <div class="login-hint">
                    <p>
                      用户名：admin，密码：admin
                    </p>
                  </div>
                </el-form>
              </el-card>

            </div>
          </div>
        </el-main>

        <el-footer class="external-link">
          <div>
            <p>
              <a href="https://github.com/vdpAdmin/VariantAdmin" target="_blank"><svg-icon icon-class="github" />GitHub</a>
              <a href="https://www.yuque.com/variantdev/atxy8t" target="_blank"><svg-icon icon-class="document" />文档</a>
              <a href="javascript:void(0)">Q群：836657858</a>
            </p>
          </div>
        </el-footer>
      </el-container>
    </el-main>

    <el-footer>
      <div class="">
        <p class="page-login--content-footer-copyright">
          版权所有  ©2020-现在  granitech出品
        </p>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
  import { login } from '@/api/user'
  import Cookies from "js-cookie";
  import store from "@/store";

  export default {
    data () {
      return {
        timeInterval: null,
        redirect: null,
        otherQuery: {},

        // 表单
        formLogin: {
          username: 'admin',
          password: 'admin',
          code: 'v9am'
        },
        // 表单校验
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ],
        }
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true
      },

    },
    methods: {
      login() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            const userInfo = {
              user: this.formLogin.username,
              password: this.formLogin.password
            }
            login(userInfo).then(res => {
              if (res.error != null) {
                this.$message({ message: '登录失败: ' + res.error, type: 'error' })
                return
              } else {
                Cookies.set('uid', res.data) // 放置用户Id到Cookie
                sessionStorage.setItem('user', userInfo.user) // 保存用户到本地会话
                sessionStorage.setItem('userId', res.data) // 保存用户Id到本地会话
                // this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
                this.$router.push({ path: this.redirect || '/welcome/home', query: this.otherQuery })
                store.commit({type: 'setReLoginFlag', reLoginFlag: false})
              }
            }).catch(res => {
              this.$message({ message: '登录失败: 请检查用户名、密码', type: 'error' })
            })
          } else {
            //this.$message.error('登录信息有误，请检查')
          }
        })
      },

      getOtherQuery(query) { /* 复制url参数值 */
        return Object.keys(query).reduce((all, cur) => {
          if (cur !== 'redirect') {
            all[cur] = query[cur]
          }
          return all
        }, {})
      },

    }
  }
</script>

<style lang="scss" scoped>
  .el-header, .el-container {
    background-color: #f8f8f8;
  }

  .el-header {
    height: 36px;
    line-height: 36px;
    color: #aaaaaa;
  }

  .el-container, .el-main {
    padding-bottom: 3px;
  }

  .login-main {
    position: relative;
    text-align: center;
  }

  .login-panel {
    background-color: #f8f8f8 !important;
    width: 420px;
    //position: absolute;
    //left: 50%;
    //top: 50%;
    //transform: translate(-50%, -75%);
    position: relative;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 100px rgba(0,0,0,.08);

    .login-title {
      text-align: center;
      font-size: 18px;
      margin: 12px;

      img {
        width: 56px;
        height: 36px;
        position: absolute;
        top: 11px;
        left: 106px;
      }

      .app-title {
        margin: 0 0 0 60px;
        padding-top: 12px;
        height: 38px;
        line-height: 38px;
      }
    }

    .el-card {
      background-color: #f8f8f8;
    }
  }

  .el-header, .el-footer {
    text-align: center;
    font-size: 13px;
    color: #aaaaaa;
  }

  .el-footer {
    height: 36px !important;
    line-height: 36px;

    p {
      margin-block-start: 0;
      margin-block: 0;
      margin: 0; /* IE11中p标记默认上下margin 13px */

      a {
        margin: 0 10px 0 10px;
      }
    }
  }

  .login-logo {
    width: 36px;
  }

  .button-login {
    width: 100%;
  }

  .login-hint {
    text-align: center;
    font-size: 13px;
    color: #cccccc;
  }

  .external-link {
    z-index: 999;
    a {
      text-decoration: none;
    }
  }

  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
</style>
