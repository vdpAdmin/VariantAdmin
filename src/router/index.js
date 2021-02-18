import Vue from 'vue'
import VueRouter from 'vue-router'
import UIFrame from '@/components/UIFrame'
import dynamicRouter from './modules/dynamic'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/newLogin/index'),
    hidden: true
  },

  {
    path: '/',
    name: 'Blank',
    component: UIFrame,
    meta: { title: '功能展示', icon: 'el-icon-notebook-2'},
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('@/components/NestedView'),
        meta: { group: true, title: '二级菜单' },
        children: [
          {
            path: 'home',
            name: 'Home',
            component: () => import('@/views/home'),
            meta: { title: '系统首页', icon: 'el-icon-reading'},
          },

        ]
      },

      {
        path: 'business',
        name: 'Business',
        component: () => import('@/components/NestedView'),
        meta: { group: true, title: '业务相关' },
        children: [
          {
            path: 'account-list',
            name: 'AccountList',
            component: () => import('@/views/business/data-list-view'),
            props: {entity: 'Account'},
            meta: { title: '客户管理', icon: 'el-icon-s-custom'}
          },
        ]
      },

    ]
  },

  dynamicRouter, /* 动态路由分离到单独的文件中 */

  {
    path: '/system',
    name: 'SystemManager',
    component: UIFrame,
    meta: { title: '系统管理', icon: 'el-icon-setting', svgIcon: 'setting' },
    children: [
      {
        path: 'entity-manager/:entity',
        name: 'EntityManager',
        component: () => import('@/views/system/entity-manager'),
        props: true,
        hidden: true, /* 此页面已废弃，用entity-field-table替代！！ */
        meta: { title: '实体字段管理', icon: '' }
      },

      {
        path: 'field-manager/:entity',
        name: 'FieldManager',
        component: () => import('@/views/system/entity-field-table'),
        props: true,
        hidden: true,
        meta: { title: '字段管理', icon: '', activeRoute: '/system/metadata/entity-list' },
      },

      {
        path: 'form-layout/:entity',
        name: 'FormLayout',
        component: () => import('@/views/system/form-layout'),
        hidden: true,
        props: true,
        meta: { title: '表单设计', icon: '', /*, keepAlive: false */ activeRoute: '/system/metadata/entity-list' }
      },

      {
        path: 'list-setting/:entity',
        name: 'ListSetting',
        component: () => import('@/views/business/data-list-view'),
        hidden: true,
        props: true,
        meta: { title: '列表设计', icon: '', /*, keepAlive: false */ activeRoute: '/system/metadata/entity-list' }
      },

      {
        path: 'metadata',
        name: 'Metadata',
        component: () => import('@/components/NestedView'),
        meta: { group: true, title: '元数据设置' },
        children: [
          {
            path: 'entity-list',
            name: 'EntityList',
            component: () => import('@/views/system/entity-list'),
            meta: { title: '实体管理', icon: 'el-icon-coin' }
          },

          {
            path: 'entity-relation',
            name: 'EntityRelation',
            hidden: true, /* 尚未实现，暂时隐藏 */
            component: () => import('@/views/system/entity-list'),
            meta: { title: '实体关系', icon: 'el-icon-connection' }
          },
        ]
      },

      {
        path: 'user-manager',
        name: 'UserManager',
        component: () => import('@/components/NestedView'),
        meta: { group: true, title: '组织架构' },
        children: [
          {
            path: 'user-list',
            name: 'UserList',
            component: () => import('@/views/user/user-tree-table'),
            meta: { title: '用户管理', icon: 'el-icon-user'}
          },

          {
            path: 'role-list',
            name: 'RoleList',
            component: () => import('@/views/user/role-list-view'),
            meta: { title: '权限角色', icon: 'el-icon-key'}
          },
        ]
      },

      {
        path: 'data-dict',
        name: 'DataDict',
        component: () => import('@/components/NestedView'),
        meta: { group: true, title: '数据字典' },
        children: [
          {
            path: 'option-manager',
            name: 'OptionManager',
            component: () => import('@/views/system/data-dict/option-manager'),
            meta: { title: '单选项管理', icon: 'el-icon-s-operation' }
          },

          {
            path: 'tag-manager',
            name: 'TagManager',
            component: () => import('@/views/system/data-dict/tag-manager'),
            meta: { title: '多选项管理', icon: 'el-icon-files' }
          },
        ]
      },


    ]
  },



]

const router = new VueRouter({
  routes
})

export default router
