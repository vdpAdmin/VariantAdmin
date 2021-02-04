import ca from "element-ui/src/locale/lang/ca";

const FormValidators = {
  /* 数字 */
  number(rule, value, callback) {
    let reg = /^[0-9]+.?[0-9]*$/
    if (!reg.test(value)) {
      callback(new Error('[' + rule.label + ']包含非数字字符'))
    } else {
      callback()
    }
  },

  /* 手机号码 */
  mobile(rule, value, callback) {
    let reg = /^[1][3456789][0-9]{9}$/
    if (!reg.test(value)) {
      callback(new Error('[' + rule.label + ']手机号码格式有误'))
    } else {
      callback()
    }
  },

  /* 禁止输入中文 */
  noChinese(rule, value, callback) {
    let reg = /[\u4e00-\u9fa5]/
    if (reg.test(value)) {
      callback(new Error('[' + rule.label + ']不能输入中文字符'))
    } else {
      callback()
    }
  },

  /* 电子邮箱 */
  email(rule, value, callback) {
    let reg = /^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/
    if (!reg.test(value)) {
      callback(new Error('[' + rule.label + ']邮箱格式有误'))
    } else {
      callback()
    }
  },

  /* URL网址 */
  url(rule, value, callback) {
    let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
    if (!reg.test(value)) {
      callback(new Error('[' + rule.label + ']URL格式有误'))
    } else {
      callback()
    }
  },

  /*测试
  test(rule, value, callback) {
    if (value < 100) {
      callback(new Error('[' + rule.label + ']不能小于100'))
    } else {
      callback()
    }
  },
  */

}

export default FormValidators
