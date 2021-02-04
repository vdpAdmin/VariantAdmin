import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  //baseURL: '/api',
  withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
  timeout: 500000, // long time just for java debug
  headers: {
    'Cache-Control': 'no-cache', /* 禁止缓存 */
  },
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    /* 添加时间戳，禁止IE浏览器缓存json请求！！ */
    config.params = {...config.params, timestamp: Date.now()}

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    if (sessionStorage.getItem('userId') != null) {
      config.headers.ruId = sessionStorage.getItem('userId')
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // if (res.code !== 20000) {

      console.log(res)
      /*
      Message({
        message: res.error || 'Error', // message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      */

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // 403: session expired
      if (
        res.code === 50008 ||
        res.code === 50012 ||
        res.code === 50014 ||
        res.code === 403
      ) {
        // to re-login

        if (!!store.state.reLoginFlag) {  //禁止弹出多个超时提醒消息框！！
          return res
        }
        store.commit({type: 'setReLoginFlag', reLoginFlag: true})

        MessageBox.confirm(
          '因为太长时间没有操作，会话已失效, 点“取消”按钮留在当前页面, 或者重新登录后继续操作。',
          '超时提醒',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          /*
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
          */

          //重定向到登录页
          let curPath = router.currentRoute.fullPath
          //console.log(curPath)
          sessionStorage.removeItem('userId')
          router.replace({path: `/newLogin?redirect=${curPath}`})
        }).catch(() => {
          //
        })
      }
      //return Promise.reject(new Error(res.message || 'Error'))
      return res
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
