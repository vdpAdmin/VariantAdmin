<template>
  <el-container>
    <el-header class="list-search-panel">
      <div class="search-panel-left">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addNewRecord">新建{{entityLabel}}</el-button>
        <!--
        <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
        <el-button size="small">修改登录密码</el-button>
        -->
      </div>
      <div class="search-panel-right">
        <el-input type="text" size="small" placeholder="请输入关键词搜索" :clearable="true" class="v-middle"
                  v-model="keyword" @keyup.enter.native="searchData" @clear="clearSearch"
                  suffix-icon="el-icon-search">
          <!--
          <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          -->
          <el-button slot="append" icon="el-icon-refresh-right" @click="" title="刷新"></el-button>
        </el-input>
      </div>
    </el-header>

    <el-main ref="tableContainer">
      <div style="height: 100%">
        <SimpleTable :columns="columns" :data="tableData" :pagination="page" :show-check-box="true" :height="tableHeight + 'px'"
                     @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                     table-size="small" table-width="100% !important">
          <el-table-column slot="table_operation" align="center" label="操作" width="150" :resizable="false" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-edit" @click="editTableData(scope.row)">修改</el-button>
              <el-button type="text" size="mini" icon="el-icon-delete-solid" @click="deleteTableData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </SimpleTable>
      </div>

      <!-- 注意：必须同时设置v-if和close-on-press-escape属性，保证FormWidget在每一次对话框显示时都重新初始化！！ -->
      <el-dialog :title="formTitle" :visible.sync="showFormDialogFlag" v-if="showFormDialogFlag"
                 :destroy-on-close="true" :close-on-click-modal="false"
                 :show-close="true" :close-on-press-escape="false">
        <FormWidget :entity="entity" :layout="layout" :form-model="formModel" :field-props-map="fieldPropsMap"
                    :labels-model="labelsModel" :form-state="formState" ref="formWidget"></FormWidget>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveFormData" size="small" style="width: 90px">保 存</el-button>
          <el-button @click="showFormDialogFlag = false" size="small">取 消</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import FormWidget from "@/views/system/field-widget/form-widget";
  import FormState from "@/views/system/form-state-variables";
  import {initDataList, formCreateQuery, formUpdateQuery, saveRecord} from "@/api/crud";
  import {arrayContain, setColumnFormatter} from "@/utils/util";
  import Vue from "vue";
  import {createLayoutObj} from "@/views/system/layout/form-layout-object";

  export default {
    name: "DataList",
    components: { FormWidget },
    props: {
      entity: String,
      customAddAction: {
        type: Boolean,
        default: false
      },
      customEditAction: {
        type: Boolean,
        default: false
      },
      customDeleteAction: {
        type: Boolean,
        default: false
      },
      customDataLoad: {
        type: Boolean,
        default: false
      },
      page: {
        type: Object,
        default: () => {
          return {
            pageNo: 1,
            limit: 20,
            sizes: [10, 20, 30, 50, 100],
            total: 0
          }
        }
      },
    },
    data() {
      return {
        entityLabel: '',
        idFieldName: null,
        curRecordId: null,

        keyword: '',

        columns: [],
        tableData: [],
        // page: {
        //   pageNo: 1,
        //   limit: 20,
        //   sizes: [10, 20, 30, 50, 100],
        //   total: 0
        // },

        showFormDialogFlag: false,
        layout: {},
        formState: 1,
        formModel: {},
        labelsModel: {},
        fieldPropsMap: {},

        tableHeight: 200
      }
    },
    computed: {
      formTitle() {
        if (this.formState === FormState.NEW) {
          return '新建' + this.entityLabel
        } else if (this.formState === FormState.EDIT) {
          return '编辑' + this.entityLabel
        } else {
          return this.entityLabel + '详情'
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.resizeTableHeight()
      })
      window.onresize = () => {
        this.resizeTableHeight()
      }

      this.initTable()
    },
    methods: {
      resizeTableHeight() {  /* table自适应高度 */
        this.tableHeight = this.$refs.tableContainer.$el.offsetHeight - 42
        //console.log(this.tableHeight)
      },

      initTable() {
        if (!this.entity) {
          this.$message.error('entity of prop is null')
          return
        }

        if (this.customDataLoad === true) {
          return
        }

        initDataList(this.entity).then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
            return
          }

          this.loadTableData(res.data.columnList, res.data.dataList)
          this.page.total = res.data.pagination.total
          this.entityLabel = res.data.entityBasicInfo.label
          this.idFieldName = res.data.entityBasicInfo.idField
        }).catch(res => {
          this.$message({ message: res.message, type: 'error' })
        })
      },

      /*  */
      loadTableData(columnList, recordList) {
        this.columns = columnList
        this.columns.forEach(col => {
          setColumnFormatter(col)
        })
        this.tableData = recordList
      },

      getTableData(filter, pageSize, pageNo) {
        //TODO!!!
        //TODO!!!
      },

      // 改变分页大小处理
      handleSizeChange(val) {
        if (this.customDataLoad === true) {
          this.$emit('handleSizeChange', val)  //父组件发出消息，由父组件处理
          return
        }

        this.page.limit = val
        this.getTableData(this.searchFilter, this.page.limit, 1)
      },

      // 翻页处理
      handleCurrentChange(val) {
        if (this.customDataLoad === true) {
          this.$emit('handleCurrentChange', val)  //父组件发出消息，由父组件处理
          return
        }

        this.page.pageNo = val
        this.getTableData(this.searchFilter, this.page.limit, this.page.pageNo)
      },

      searchData() {
        if (this.customDataLoad === true) {
          this.$emit('searchData', this.keyword)  //父组件发出消息，由父组件处理
          return
        }

        //TODO
      },

      clearSearch() {
        if (this.customDataLoad === true) {
          this.keyword = ''
          this.$emit('clearSearch')  //父组件发出消息，由父组件处理
          return
        }

        //TODO
      },

      addNewRecord() {
        if (this.customAddAction === true) {
          this.$emit('addTableRecord')  //父组件发出消息，由父组件处理
          return
        }

        formCreateQuery(this.entity).then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
            return
          }

          if ((!!res.data) && (!!res.data.layoutJson)) {
            this.curRecordId = null
            this.layout = this.buildLayoutObj()
            this.layout.setLayoutPropsFromServer(res)
            this.handleDeletedFields(res) /* 处理表单已删除字段！！ */
            this.formModel = res.data.formData
            this.labelsModel = res.data.labelData
            this.fieldPropsMap = res.data.fieldPropsMap
            this.formState = FormState.NEW
            //console.log('set formState: ' + this.formState)
            this.showFormDialogFlag = true;
            if (!!this.$refs['formWidget']) {
              this.$refs['formWidget'].clearFormValidate()
            }
          } else {
            this.$message({ message: '加载表单布局出错', type: 'error' })
          }
        }).catch(res => {
          this.$message({ message: res.message, type: 'error' })
        })
      },

      buildLayoutObj() {
        let eventHub = new Vue()
        return createLayoutObj(eventHub)
      },

      handleDeletedFields(res) {
        let deletedFields = res.data.deletedFields
        if (!!deletedFields && Array.isArray(deletedFields)) {
          let layoutFieldWrappers = this.layout.getAllLayoutFieldWrappers()
          if (!!layoutFieldWrappers && Array.isArray(layoutFieldWrappers)) {
            layoutFieldWrappers.forEach(fw => {
              let deletedFlag = arrayContain(deletedFields, fw.name)
              if (!!deletedFlag) {
                fw.deleted = true  /* 设置已删除字段标志 */
              }
            })
          }
        }
      },

      editTableData(row) {
        if (this.customEditAction === true) {
          this.$emit('editTableRow', row)  //向父组件发出消息，由父组件处理
          return
        }

        this.curRecordId  = row[this.idFieldName]
        formUpdateQuery(this.entity, this.curRecordId).then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
            return
          }

          if ((!!res.data) && (!!res.data.layoutJson)) {
            this.layout = this.buildLayoutObj()
            this.layout.setLayoutPropsFromServer(res)
            this.handleDeletedFields(res) /* 处理表单已删除字段！！ */
            this.formModel = res.data.formData
            this.labelsModel = res.data.labelData
            this.fieldPropsMap = res.data.fieldPropsMap
            this.formState = FormState.EDIT //编辑记录状态
            //console.log('set formState: ' + this.formState)
            this.showFormDialogFlag = true;
            if (!!this.$refs['formWidget']) {
              this.$refs['formWidget'].clearFormValidate()
            }
          } else {
            this.$message({ message: '加载表单布局出错', type: 'error' })
          }
        }).catch(res => {
          this.$message({ message: res.message, type: 'error' })
        })
      },

      saveFormData() {
        let validResult = false
        this.$refs['formWidget'].validateForm( (valid) => {
          validResult = valid
          if (!!!valid) {
            return false
          }
        })
        if (!!!validResult) {
          return
        }

        saveRecord(this.entity, this.formState === FormState.NEW ? '' : this.curRecordId,
            this.formModel).then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
            return
          }

          this.formModel = res.data.formData
          this.labelsModel = res.data.labelData
          this.$message({ message: '保存成功', type: 'success' })
          this.showFormDialogFlag = false
        }).catch(res => {
          this.$message({ message: res.message, type: 'error' })
        })
      },

      deleteTableData(row) {
        if (this.customDeleteAction === true) {
          this.$emit('deleteTableRow', row)  //向父组件发出消息，由父组件处理
          return
        }

        //TODO
      },


    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-main {
    padding: 0;
  }

  .list-search-panel {
    height: 62px !important;
    line-height: 62px;
    border-left: 1px solid #EBEEF5;
    margin-bottom: 0;
  }

  .list-search-panel:after {
    content: "";
    display: block;
    clear: both;
  }

  .search-panel-left {
    float: left;
  }

  .search-panel-right {
    float: right;
    width: 360px;

    /* 解决IE浮动元素垂直居中问题 begin */
    position: relative;
    height: 62px;

    //.el-input.v-middle { /* 借鉴.el-button样式，解决IE垂直居中问题 */
    //  display: inline-table;
    //  padding: 15px 20px 0 0;
    //}


    //div.relative-wrapper {
    //  height: 62px;
    //  position: relative;
    //}

    ::v-deep .el-input.v-middle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    /* end */
  }
</style>
