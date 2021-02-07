import Vue from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'
import App from './App.vue'
import router from './router'
import store from './store'
import './icons'
import 'babel-polyfill'
import './ieMouseEventFix'  /* 解决：NavMenu组件折叠之后，鼠标滑过menu，在IE环境下报错! */
import './plugins/element.js'
import './plugins/simple-table.js'
import './plugins/custom-form-components.js'
import './router-guard'
import '@/styles/index.scss' // global css
import "perfect-scrollbar/css/perfect-scrollbar.css"

Vue.config.productionTip = false

/**
 * @description 为自定义滚动条全局注入自定义指令。自动判断该更新PerfectScrollbar还是创建它
 * @param {Element} el - 必填。dom元素
 */
const el_scrollBar = (el) => {
  //在元素上加点私货，名字随便取，确保不会和已有属性重复即可，我取名叫做_ps_
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update();
  } else {
    //el上挂一份属性
    //el._ps_ = new PerfectScrollbar(el, { suppressScrollX: true }); /* suppressScrollX会禁用横向滚动条滚动 */
    el._ps_ = new PerfectScrollbar(el, { suppressScrollX: false });
  }
};

Vue.directive("scrollBar",{
  inserted(el, binding){
    const { value } = binding;
    //console.log(binding)
    //console.log(value)
    if(value === "elTable"){
      el = el.querySelector(".el-table__body-wrapper");
      if(!el){
        return console.warn("未发现className为el-table__body-wrapper的dom");
      }
      //console.log(el)
    }
    const rules = ["fixed", "absolute", "relative"];
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`)
    }
    el_scrollBar(el);
  },
  componentUpdated(el, binding, vnode) {
    const { value } = binding;
    if (value === "elTable") {
      el = el.querySelector(".el-table__body-wrapper");
      if(!el){
        return console.warn("未发现className为el-table__body-wrapper的dom");
      }
    }
    vnode.context.$nextTick(
        () => {
          try {
            el_scrollBar(el);
          } catch (error) {
            console.error(error);
          }
        }
    )
  },
})
/* 以上代码添加v-scrollBar指令，美化IE11中Table组件滚动条样式 */


Vue.directive('focus',{
  inserted(el) {
    el.querySelector('input').focus()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
