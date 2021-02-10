<template>
  <el-container>
    <el-main class="welcome">
      <div class="title">欢迎使用{{appTitle}}</div>
    </el-main>
    <el-footer class="external-link">
      <div>
        <div>
          <a href="https://github.com/vdpAdmin/VariantAdmin" target="_blank"><svg-icon icon-class="github" />GitHub</a>
          <a href="https://www.yuque.com/variantdev/atxy8t" target="_blank"><svg-icon icon-class="document" />文档</a>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
  const defaultSettings = require('../settings.js')

  export default {
    name: "Home",
    data() {
      return {
        appTitle: defaultSettings.title,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .welcome {
    font-size: 72px;
    color: #e1e1e1;
    height: 100%;
    line-height: 100%;
    .title {
      height: 100%;
      line-height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .external-link {
    font-size: 12px;
    text-align: center;
    height: 32px !important;
    line-height: 32px !important;
    div {
      margin: 0;
      a {
        text-decoration: none;
        margin-right: 15px;
      }
    }
  }
</style>
