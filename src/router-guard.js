import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/about'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()

  //console.log( typeof(sessionStorage.getItem('userId')) )
  //console.log( sessionStorage.getItem('userId') + '_0')
  /* 注意：sessionStorage.setItem('xxx', null)之后， sessionStorage.getItem('xxx')返回的
     是字符串'null'而不是null对象！！！ */
  const sessionUserId = sessionStorage.getItem('userId')
  const loginFlag = (sessionUserId !== 'null') && (sessionUserId != null)

  if (loginFlag) {
    if (to.path === 'login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    /* has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      //console.log( to.path )
      if (!!to.path && (to.path !== '/')) {
        next(`/login?redirect=${to.path}`)
      } else {
        next('/login')
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
