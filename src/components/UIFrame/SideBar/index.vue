<template>
  <el-aside class="main-side-bar" :style="{width: !isCollapse ? '280px' : '52px'}">
    <AppLogo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar class="side-scrollbar">
      <el-menu :default-openeds="openedMenus" :router="true" :default-active="activeRoute"
               :collapse="isCollapse" @select="handleMenuSelect" class="main-nav-menu">

        <template v-for="(item, idx) in navMenu"> <!-- 目前只考虑到3级菜单嵌套, group只考虑2级!! -->
          <el-submenu :index="item.index + ''" v-if="!item.isLeaf && !item.isGroup">
            <template slot="title"><i v-if="!item.svgIcon" :class="item.icon"></i><svg-icon v-else :icon-class="item.svgIcon" />{{item.title}}</template>
            <template v-for="(childItem, childIdx) in item.children">
              <el-submenu :index="childItem.index + ''" v-if="!childItem.isLeaf && !childItem.isGroup">
                <template slot="title"><i v-if="!childItem.svgIcon" :class="childItem.icon"></i><svg-icon v-else :icon-class="childItem.svgIcon" />{{childItem.title}}</template>
                <el-menu-item v-for="(grandchildItem, grandchildIdx) in childItem.children"
                              :index="grandchildItem.path" :key="grandchildItem.path">
                  <i v-if="!grandchildItem.svgIcon" :class="grandchildItem.icon"></i><svg-icon v-else :icon-class="grandchildItem.svgIcon" />{{grandchildItem.title}}
                </el-menu-item>
              </el-submenu>
              <el-menu-item-group v-else-if="!!childItem.isGroup" :title="childItem.title">
                <el-menu-item v-for="(grandchildItem, grandchildIdx) in childItem.children"
                              :index="grandchildItem.path" :key="grandchildItem.path">
                  <i v-if="!grandchildItem.svgIcon" :class="grandchildItem.icon"></i><svg-icon v-else :icon-class="grandchildItem.svgIcon" />{{grandchildItem.title}}
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item v-else :index="childItem.path">
                <i v-if="!childItem.svgIcon" :class="childItem.icon"></i><svg-icon v-else :icon-class="childItem.svgIcon" />{{childItem.title}}
              </el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item-group v-else-if="!!item.isGroup" :title="item.title">
            <template v-for="(childItem, childIdx) in item.children">
              <el-submenu :index="childItem.index + ''" v-if="!childItem.isLeaf && !childItem.isGroup">
                <template slot="title"><i v-if="!childItem.svgIcon" :class="childItem.icon"></i><svg-icon v-else :icon-class="childItem.svgIcon" />{{childItem.title}}</template>
                <el-menu-item v-for="(grandchildItem, grandchildIdx) in childItem.children"
                              :index="grandchildItem.path" :key="grandchildItem.path">
                  <i v-if="!childItem.svgIcon" :class="childItem.icon"></i><svg-icon v-else :icon-class="childItem.svgIcon" />{{grandchildItem.title}}
                </el-menu-item>
              </el-submenu>
              <el-menu-item-group v-else-if="!!childItem.isGroup" :title="childItem.title">
                <el-menu-item v-for="(grandchildItem, grandchildIdx) in childItem.children"
                              :index="grandchildItem.path" :key="grandchildItem.path">
                  <i v-if="!grandchildItem.svgIcon" :class="grandchildItem.icon"></i><svg-icon v-else :icon-class="grandchildItem.svgIcon" />{{grandchildItem.title}}
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item v-else :index="childItem.path">
                <i v-if="!childItem.svgIcon" :class="childItem.icon"></i><svg-icon v-else :icon-class="childItem.svgIcon" />{{childItem.title}}
              </el-menu-item>
            </template>
          </el-menu-item-group>
          <el-menu-item v-else :index="item.path">
            <i v-if="!item.svgIcon" :class="item.icon"></i><svg-icon v-else :icon-class="item.svgIcon" />{{item.title}}
          </el-menu-item>
        </template>

      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script>
import AppLogo from './logo'
import EventBus from '@/components/EventBus/index'

export default {
  name: 'SideBar',
  components: { AppLogo },
  data() {
    return {
      openedMenus: ['1'],
      navMenu: [],
      isCollapse: false,
    }
  },
  computed: {
    showLogo () {
      return true
    },

    activeRoute() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeRoute) {
        return meta.activeRoute
      }
      return path
    },

  },
  mounted() {
    this.initNavMenu()
    EventBus.$on('nav-collapse', (value) => {
      this.isCollapse = value
    })
  },
  methods: {
    //TODO: router增加菜单权限属性，根据登录用户权限加载导航菜单！！

    buildNavMenuItem(rootPath, routeItem, itemIndex) {
      let navMenuItem = {}
      navMenuItem.isLeaf = !!!routeItem.children
      navMenuItem.isGroup = !!routeItem.meta ? (!!routeItem.meta.group && !!routeItem.children
          && (routeItem.children.length > 0)): false
      navMenuItem.index = itemIndex
      navMenuItem.title = !!routeItem.meta ? routeItem.meta.title : routeItem.name
      navMenuItem.icon = !!routeItem.meta ? routeItem.meta.icon : ''
      navMenuItem.svgIcon = !!routeItem.meta ? routeItem.meta.svgIcon : ''
      navMenuItem.path = rootPath + routeItem.path
      let newRootPath = navMenuItem.path.endsWith('/') ? rootPath + routeItem.path :
          rootPath + routeItem.path + '/'

      if (!!routeItem.children && (routeItem.children.length > 0)) {
        navMenuItem.children = []
        routeItem.children.forEach( (item, index) => {
          if (!item.hidden) {
            let childItem = this.buildNavMenuItem(newRootPath, item, index)
            navMenuItem.children.push(childItem)
          }
        })
      }

      return navMenuItem
    },

    initNavMenu() {
      let firstLevelMenuIndex = 1
      this.$router.options.routes.forEach((item, index) => {
        if (!item.hidden) {
          let navMenuItem = this.buildNavMenuItem('', item, firstLevelMenuIndex)
          this.navMenu.push(navMenuItem)
          firstLevelMenuIndex += 1
        }
      })

      this.openedMenus.push( this.navMenu.length + '')  //展开最后一个一级菜单
    },

    handleMenuSelect(menuIndex) { /* 导航菜单重复点击强制刷新AppMain组件视图！！ */
      if (menuIndex === this.$route.path) {
        EventBus.$emit('route-reload')
      }
    },

  }
}
</script>

<style lang="scss" scoped>
  .main-side-bar.el-aside {
    color: #333;
    width: 280px;
    height: 100%;
    //overflow-y: hidden;
    background-color: #ffffff;
  }

  .el-scrollbar.side-scrollbar {
    height: calc(100% - 54px);
  }

  .el-menu {
    border-right-width: 0; /* 隐藏菜单项1像素右边框 */
  }

  .el-submenu [class^=el-icon-], .el-menu-item [class^=el-icon-] {
    margin-right: 10px;
  }

  .el-menu--collapse > .el-menu-item [class^=el-icon-],
  .el-menu--collapse > .el-submenu > .el-submenu__title [class^=el-icon-] {
    margin-right: 10px;
  }

  /* TODO: 在IE浏览器中展开或收起一级菜单项时，会出现滚动条闪烁问题，待解决。 */


  ::v-deep .el-scrollbar__wrap {  /* 解决IE浏览器中导航菜单默认显示水平、垂直滚动条的问题！！ */
    //overflow: hidden !important;
    overflow-x: hidden;
    overflow-y: auto;  /* TODO: 待解决问题——IE浏览器垂直方向会生成两个滚动条：虚拟滚动条和真实滚动条 */
  }

  ::v-deep .el-scrollbar__view {  /* 隐藏最后化导航菜单后的横向滚动条！！ */
    overflow-x: hidden;
  }

  ::v-deep .svg-icon {
    width: 1.4em !important;
    height: 1.4em !important;
    margin-left: 2px !important;
    margin-right: 12px !important;
  }
</style>
