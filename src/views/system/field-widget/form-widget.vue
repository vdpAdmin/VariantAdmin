<template>
  <el-form size="mini" ref="dataForm" :label-position="layout.labelPosition" :model="formModel" :rules="rules"
           :validate-on-rule-change="false">
    <el-tabs type="card" ref="formTabs" :value="layout.activeTabName">
      <el-tab-pane v-for="tabItem in layout.formTabs" :key="tabItem.id" :name="tabItem.name" :label="tabItem.title">
        <layout-section accordion v-for="sectionItem in tabItem.sections" :key="sectionItem.id" :value="['001']">
          <layout-section-item :title="sectionItem.title" :disabled="false" name="001">
            <el-row v-for="rowItem in sectionItem.rows " :key="rowItem.id" :gutter="rowItem.gutter"
                    :style="{'margin-bottom': !!layout.lineSpacing ? layout.lineSpacing + 'px' : '16px'}"
                    style="margin-top: 2px;margin-right: 2px;margin-left: 2px">
              <el-col class="grid-cell" v-for="cellItem in rowItem.cells" :key="cellItem.id"
                      :span="cellItem.span">
                <template v-if="!!cellItem.fields && (cellItem.fields.length > 0)">
                  <!-- 实体已删除字段 -->
                  <template v-if="cellItem.fields[0].deleted === true">
                    <div class="blank-cell">{{cellItem.fields[0].name}}已删除</div>
                  </template>
                  <!-- 表单插槽 -->
                  <template v-else-if="cellItem.fields[0].type === 'Slot'">
                    <slot :name="cellItem.fields[0].name" v-bind:formModel="formModel">
                      <div class="blank-cell">未设置插槽{{cellItem.fields[0].name}}</div>
                    </slot>
                  </template>
                  <!-- 表单自定义组件 -->
                  <template v-else-if="cellItem.fields[0].type === 'Custom'">
                    <component :is="cellItem.fields[0].componentName" :form-model="formModel" :form-state="formState"
                               :data-fields="cellItem.fields[0].fields" :field-props-map="fieldPropsMap"
                               :label-align="labelAlign" :component-label="cellItem.fields[0].label"
                               :label-width="!!layout.labelWidth ? layout.labelWidth : 75"></component>
                  </template>
                  <!-- 此处可增加更多非数据绑定的表单组件，比如静态HTML内容、文字描述等等 -->
                  <field-widget v-else :entity="entity" :field="cellItem.fields[0]" :form-model="formModel"
                                :labels-model="labelsModel" :form-state="formState" :label-align="labelAlign"
                                :field-props="fieldPropsMap[cellItem.fields[0].name]"
                                :label-width="(!!cellItem.fields[0].labelWidth) ? cellItem.fields[0].labelWidth : (!!layout.labelWidth ? layout.labelWidth : 75)"
                                @fieldValidate="(validatorRule) => addFieldValidator(cellItem.fields[0].name, validatorRule)">
                  </field-widget>
                </template>
                <template v-else-if="isPreview">
                  <div class="blank-cell">--空白栅格--</div>
                </template>
                <template v-else>
                  <div class="blank-cell"></div>
                </template>
              </el-col>
            </el-row>
          </layout-section-item>
        </layout-section>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
  import LayoutSection from '@/components/LayoutSection/'
  import LayoutSectionItem from '@/components/LayoutSection/src/collapse-item'
  import FieldWidget from '@/views/system/field-widget/field-widget'
  import FormState from '@/views/system/form-state-variables'
  import { isNotNull, isEmptyStr } from '@/utils/util'
  import FormValidators from '@/utils/validators'

  export default {
    props: {
      entity: String,
      layout: Object,
      formModel: {
        type: Object,
        default: () => {}
      },
      labelsModel: {
        type: Object,
        default: () => {}
      },
      fieldPropsMap: Object,
      formState: {
        type: Number,
        default: null,
      },

      //传入的表单验证规则
      extraRules: {
        type: Object,
        default: () => {}
      }
    },
    name: "FormWidget",
    components: { LayoutSection, LayoutSectionItem, FieldWidget },
    data() {
      return {
        rules: {},
        fieldRules: {},
      }
    },
    computed: {
      labelAlign() {
        return (!!this.layout && !!this.layout.labelAlign) ? this.layout.labelAlign : 'label-left-align'
      },

      isPreview() {
        return this.formState === FormState.PREVIEW
      }
    },

    mounted() {
      this.buildFormRules()

      console.log(this.rules)
    },

    methods: {
      buildFormRules() {
        //console.log('formState: ' + this.formState)

        // const requiredValidator = (rule, value, callback) => {
        //   console.log('rule')
        //   console.log(rule)
        //   //console.log(this.formModel[rule.field])
        //
        //   /* 当字段为Boolean类型时，字段值false，isEmptyStr函数返回true，故须增加!==false判断 */
        //   if ((isEmptyStr(this.formModel[rule.field]) && (this.formModel[rule.field] !== false))
        //       || (this.formModel[rule.field] === null)) {
        //     //console.log( this.fieldPropsMap[rule.field] )
        //     //console.log( this.formModel[rule.field] )
        //     callback(new Error('[' + rule.label + ']不能为空'))
        //   } else {
        //     callback()
        //   }
        // }

        const result = {}
        //const result = this.rules
        if (!!this.fieldPropsMap) {
          let propsMap = this.fieldPropsMap
          //console.log( propsMap )
          for (let fieldName in propsMap) {
            if (!propsMap.hasOwnProperty(fieldName)) {
              continue
            }

            if ((this.formState === FormState.PREVIEW) || (this.formState === FormState.VIEW)
                || ((this.formState === FormState.NEW) && !!!propsMap[fieldName].creatable)
                || ((this.formState === FormState.EDIT) && !!!propsMap[fieldName].updatable)) {
              continue
            }

            /* 添加字段内置的校验函数 */
            if ((!!this.fieldRules) && (this.fieldRules.hasOwnProperty(fieldName))) {
              if (!result[fieldName]) {
                result[fieldName] = new Array(0)
              }

              if (!Array.isArray(this.fieldRules[fieldName])) {
                result[fieldName].push(this.fieldRules[fieldName])
              } else {
                this.fieldRules[fieldName].forEach( fRule => {
                  result[fieldName].push(fRule)
                })
              }
            }

            // /* 添加空值校验函数 */
            // if (isNotNull(propsMap[fieldName].nullable) && (propsMap[fieldName].nullable === false)) {
            //   //console.log('fieldName: ' + fieldName)
            //
            //   if (!result[fieldName]) {
            //     result[fieldName] = new Array(0)
            //   }
            //
            //   let newRule = {
            //     required: true,
            //     validator: requiredValidator,
            //     trigger: ['blur'],
            //     label: propsMap[fieldName].label, /* 传入字段label用于错误提示！ */
            //   }
            //   if (propsMap[fieldName].type === 'Tag') {  /* Tag字段需要设置校验对象type属性为array!! */
            //     newRule.type = 'array'
            //     //console.log(newRule)
            //   }
            //   result[fieldName].push(newRule)
            // }

            /* 添加字段自定义校验函数 */
            if (!!propsMap[fieldName].fieldViewModel && !!propsMap[fieldName].fieldViewModel.validators) {
              //console.log(propsMap[fieldName].fieldViewModel.validators)
              if (!result[fieldName]) {
                result[fieldName] = new Array(0)
              }

              propsMap[fieldName].fieldViewModel.validators.forEach( vdt => {
                if (FormValidators.hasOwnProperty(vdt)) {
                  result[fieldName].push({
                    validator: FormValidators[vdt],
                    trigger: ['blur'],
                    label: propsMap[fieldName].label,
                  })
                }
              })
            }

            /* 添加表单附加的校验函数 */
            if ((!!this.extraRules) && (this.extraRules.hasOwnProperty(fieldName))) {
              if (!result[fieldName]) {
                result[fieldName] = new Array(0)
              }

              if (!Array.isArray(this.extraRules[fieldName])) {
                result[fieldName].push(this.extraRules[fieldName])
              } else {
                this.extraRules[fieldName].forEach( fRule => {
                  result[fieldName].push(fRule)
                })
              }
            }
          }
        }

        //console.log('rules is: ')
        //console.log(result)
        this.rules = result
      },

      validateForm(callback) {
        this.$refs['dataForm'].validate(callback)
      },

      clearFormValidate() {
        this.$refs['dataForm'].clearValidate()
      },

      /* 接收单个字段组件传入的校验规则 */
      addFieldValidator(fieldName, validatorRule) {
        //console.log('KKKKKKKKKKKK')
        if (!this.fieldRules[fieldName]) {
          this.fieldRules[fieldName] = new Array(0)
        }
        this.fieldRules[fieldName].push(validatorRule)
      }

    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-tabs__nav-scroll {
    padding-left: 15px;
  }
  ::v-deep .el-tabs__header {
    margin-bottom: 0;
  }

  ::v-deep .el-tabs__item {
    font-size: 13px;
  }

  ::v-deep .el-tabs__content {
    padding: 2px 5px 0 5px;
  }

  ::v-deep .el-collapse {
    border-width: 0;
    margin-top: 5px;
    margin-bottom: 0;
    position: relative;
  }

  ::v-deep .el-collapse-item__header {
    font-size: 11px;
    font-style: italic;
    height: 30px;
    line-height: 30px;
    padding-bottom: -2px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 6px;
  }

  ::v-deep .el-collapse-item__content {
    padding-bottom: 0;
  }

  ::v-deep .el-collapse-item__wrap {
    border-bottom-width: 0;
  }

  ::v-deep .el-form-item {
    margin-bottom: 3px;
  }

  ::v-deep .el-form-item__label {
    font-size: 12px;
    white-space: nowrap;
  }

  ::v-deep .label-left-align .el-form-item__label {
    text-align: left;
  }

  ::v-deep .label-center-align .el-form-item__label {
    text-align: center;
  }

  ::v-deep .label-right-align .el-form-item__label {
    text-align: right;
  }

  .blank-cell {
    text-align: center;
    vertical-align: middle;
    height: 28px;
    line-height: 28px;
    color: #cccccc;
    font-style: italic;
  }

</style>
