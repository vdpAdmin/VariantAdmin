<template>
  <el-container>
    <SideBar />
    <el-container direction="vertical">
      <NavBar />
      <AppMain />
    </el-container>
  </el-container>
</template>

<script>
import SideBar from './SideBar/index'
import NavBar from './NavBar/index'
import AppMain from './AppMain/index'

export default {
  name: 'UIFrame',
  components: { AppMain, NavBar, SideBar },
  methods: {

  }
}
</script>

<style lang="scss">
  .el-container {
    height: 100%;
    width: 100%;
    border-width: 0;
  }
</style>
