<template>
  <el-header>
    <div class="nav-menu-fold">
      <a v-if="isCollapse" title="展开导航" @click="toggleCollapse">
        <svg-icon icon-class="menu-unfold" /></a>
      <a v-else title="收起导航" @click="toggleCollapse">
        <svg-icon icon-class="menu-fold" /></a>
    </div>
    <Breadcrumb />
    <el-dropdown style="float: right">
      <i class="el-icon-user-solid" style="margin-right: 15px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="true">{{currentUserName}}在线</el-dropdown-item>
        <el-dropdown-item @click.native="modifyPwd"><i class="el-icon-key"></i>修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="logout"><svg-icon icon-class="logout" />退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>

<script>
  import EventBus from '@/components/EventBus/index'
  import Breadcrumb from '@/components/Breadcrumb/index'
  import {logout} from "@/api/user" /* request.js中import { MessageBox, Message } from 'element-ui'这一行代码，
  引入的css样式，会导致左侧SideBar导航栏在IE浏览器中出现水平、垂直滚动条！！ */

  export default {
    name: 'NavBar',
    components: {Breadcrumb},
    data() {
      return {
        isCollapse: false,
        currentUserName: null,
      }
    },
    mounted() {
      if (sessionStorage.getItem('user') != null) {
        this.currentUserName = sessionStorage.getItem('user')
      }
    },
    methods: {
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
        EventBus.$emit('nav-collapse', this.isCollapse)
      },

      modifyPwd() {
        this.$message('暂未实现:-p', 'info')
      },

      logout() {
        this.$confirm('确定退出登录?', '提示').then(() => {
          logout().then(res => {
            if (res.error != null) {
              this.$message({ message: res.error, type: 'error' })
              return
            }

            /* 注意：使用setItem('xxx', null)方法，(sessionStorage.getItem('userId') != null)表达式的值为true, 导致
               router-guard.js中是否已登录判断出现错误，原因在于setItem('xxx', null)之后，sessionStorage.getItem返回的
               是字符串'null'而不是null对象！！所以应避免使用setItem('xxx', null)方法，改用改用removeItem方法！！
               改用removeItem('xxx')方法，(sessionStorage.getItem('userId') != null)表达式的值为false */
            /*
            sessionStorage.setItem('user', null)
            sessionStorage.setItem('userId', null)
            */
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('userId')
            this.$router.push('/login')
          }).catch(res => {
            this.$message({ message: res.message, type: 'error' })
          })
        }).catch(() => {
          //
        })

      },

    }
  }
</script>

<style lang="scss" scoped>
  .el-header {
    background-color: #ffffff;
    color: #333;
    height: 54px !important;
    line-height: 54px;
    font-size: 12px;
    padding-left: 0;
  }

  ::v-deep .svg-icon {
    margin-left: 0 !important;
  }

  .nav-menu-fold {
    float: left;
    //outline: 1px solid #409EFF;
    a {
      border-left: 2px solid #edf1f7;
      padding-left: 3px;
      font-size: 16px;
    }
  }
</style>
