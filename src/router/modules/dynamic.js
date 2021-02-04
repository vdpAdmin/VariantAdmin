import UIFrame from "@/components/UIFrame/index";

const dynamicRouter = {
  //这里可以添加自定义的路由

  path: '/',
  name: 'Dynamic',
  component: UIFrame,
  meta: { title: '自定义页面', icon: 'el-icon-suitcase-1'},
  children: [
    {
      path: 'demo',
      name: 'Demo',
      component: () => import('@/views/HelloWorld'),
      meta: { title: '动态路由1', icon: 'el-icon-reading'},
    },
  ]

}

export default dynamicRouter

