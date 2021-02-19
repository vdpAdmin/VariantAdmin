<template>
  <el-container>
    <el-aside class="left-tree-panel">
      <el-tree
              :data="treeData"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps">
      </el-tree>
    </el-aside>

    <el-container>
      <el-header class="list-search-panel">
        <div class="search-panel-left">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addUser">新建用户</el-button>
          <!--
          <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
          -->
          <el-button size="small">修改登录密码</el-button>
        </div>
        <div class="search-panel-right">
          <el-input type="text" size="small" placeholder="请输入关键词搜索" :clearable="true" class="v-middle"
                    v-model="keyword" @keyup.enter.native="searchData" @clear="clearSearch">
            <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          </el-input>
        </div>
      </el-header>

      <el-main ref="tableContainer">
        <div style="height: 100%">
          <SimpleTable :columns="columns" :data="tableData" :pagination="page" :show-check-box="true" :height="tableHeight + 'px'"
                       @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                       table-size="small" table-width="100% !important">
            <el-table-column slot="table_operation" align="center" label="操作" width="150" :resizable="false">
              <template slot-scope="scope">
                <el-button type="text" size="mini" icon="el-icon-edit" @click="editTableData(scope.row)">修改</el-button>
                <el-button type="text" size="mini" icon="el-icon-delete-solid" @click="deleteTableData(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </SimpleTable>
        </div>

        <!-- 注意：必须同时设置v-if和close-on-press-escape属性，保证FormWidget在每一次对话框显示时都重新初始化！！ -->
        <el-dialog :title="formTitle" :visible.sync="showFormDialogFlag" :show-close="true"
                   :destroy-on-close="true" :close-on-click-modal="false"
                   v-if="showFormDialogFlag" :close-on-press-escape="false">
          <FormWidget :entity="entity" :layout="layout" :form-model="formModel" :field-props-map="fieldPropsMap"
                      :labels-model="labelsModel" :form-state="formState" :extra-rules="extraRules"
                      ref="formWidget">
            <template v-slot:Slot01>
              <div>Hello, Slot!</div>
            </template>
            <template #Slot02="{formModel}">
              <!--
              <div>Hello, {{formModel.workDirection}}!</div>
              -->
              <el-input v-model="formModel.workDirection" @change="myChange(formModel)"></el-input>
            </template>
            <template #Slot03="{formModel}">
              <div>Hello, {{formModel.workDirection}}!</div>
            </template>
          </FormWidget>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveFormData" size="small" style="width: 90px">保 存</el-button>
            <el-button @click="showFormDialogFlag = false" size="small">取 消</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Vue from "vue"
  import {formatRefColumn, formatRefListColumn, formatOptionColumn,
    isEmptyStr, arrayContain} from '@/utils/util'
  import { getDepartmentTree } from '@/api/user'
  import { getDataList } from '@/api/crud'
  import { getFormLayout } from '@/api/system-manager'
  import { formCreateQuery, formUpdateQuery, saveRecord } from '@/api/crud'
  import { createLayoutObj } from '@/views/system/layout/form-layout-object.js'
  import FormState from '@/views/system/form-state-variables'
  import FormWidget from '@/views/system/field-widget/form-widget'

  export default {
    name: "UserTreeTable",
    components: {FormWidget},
    data() {
      return {
        entity: 'User',
        fieldsList: 'userName, loginName, createdOn, createdBy, modifiedOn, modifiedBy, departmentId',
        showFormDialogFlag: false,
        layout: {},
        formState: 1,
        formModel: {},
        labelsModel: {},
        curUserId: null,
        fieldPropsMap: {},

        columns: [
          {prop: 'userName', label: '用户名称', width: '130', align: 'left'},
          {prop: 'loginName', label: '登录名', width: '120', align: 'center'},
          {prop: 'createdOn', label: '创建时间', width: '160', align: 'center'},
          {prop: 'createdBy', label: '创建用户', align: 'center', formatter: formatRefColumn},
          {prop: 'modifiedOn', label: '修改时间', width: '160', align: 'center'},
          {prop: 'modifiedBy', label: '修改用户', align: 'center', formatter: formatRefColumn},
          {prop: 'departmentId', label: '归属部门', align: 'center', formatter: formatRefColumn},
        ],
        tableData: [],
        page: {
          pageNo: 1,
          limit: 20,
          sizes: [10, 20, 30, 50, 100],
          total: 0
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        tableHeight: 100,

        keyword: '',
        searchFilter: '',

        extraRules: {
          loginName: {
            max: 20, message: '不能超过20个字符长度', trigger: 'blur'
          },

          profile: [
            {min: 5, message: '请至少输入5个字符', trigger: 'blur'}
          ],

        }

      }
    },
    computed: {
      formTitle() {
        if (this.formState === FormState.NEW) {
          return '新建用户'
        } else if (this.formState === FormState.EDIT) {
          return '编辑用户'
        } else {
          return '用户详情'
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

      this.initTreeData()
      this.initTableData()
    },
    methods: {
      resizeTableHeight() {  /* table自适应高度 */
        this.tableHeight = this.$refs.tableContainer.$el.offsetHeight - 42
      },

      // 改变分页大小处理
      handleSizeChange(val) {
        this.page.limit = val
        this.loadTableData(this.searchFilter, this.page.limit, 1)
      },

      // 翻页处理
      handleCurrentChange(val) {
        this.page.pageNo = val
        this.loadTableData(this.searchFilter, this.page.limit, this.page.pageNo)
      },

      editTableData(row) {
        //console.log(row.userId)

        this.curUserId  = row.userId
        formUpdateQuery(this.entity, this.curUserId).then(res => {
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
            console.log('set formState: ' + this.formState)
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

      deleteTableData(row) {
        //TODO
      },

      loadTableData(filter, pageSize, pageNo) {
        let realFilter = isEmptyStr(filter) ? '(1=1)' : filter
        getDataList('User', this.fieldsList, filter, pageSize, pageNo).then(res => {
          if (res.error != null) {
            this.$message({message: res.error, type: 'error'})
          } else {
            this.tableData = res.data.dataList
            this.page.total = res.data.pagination.total
            //console.log(res.data)
          }
        }).catch(res => {
          this.$message({message: res.message, type: 'error'})
        })
      },

      initTreeData() {
        getDepartmentTree().then(res => {
          if (res.error != null) {
            this.$message({message: res.error, type: 'error'})
          } else {
            this.treeData = res.data
          }
        }).catch(res => {
          this.$message({message: res.message, type: 'error'})
        })
      },

      initTableData() {
        this.loadTableData('(1=1)', this.page.limit, 1)
      },

      buildLayoutObj() {
        let eventHub = new Vue()
        let layoutObj = createLayoutObj(eventHub)
        return layoutObj
      },

      addUser() {
        formCreateQuery(this.entity).then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
            return
          }

          if ((!!res.data) && (!!res.data.layoutJson)) {
            this.curUserId = null
            this.layout = this.buildLayoutObj()
            this.layout.setLayoutPropsFromServer(res)
            this.handleDeletedFields(res) /* 处理表单已删除字段！！ */
            this.formModel = res.data.formData
            this.labelsModel = res.data.labelData
            this.fieldPropsMap = res.data.fieldPropsMap
            this.formState = FormState.NEW
            console.log('set formState: ' + this.formState)
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
        //console.log(this.formModel)

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

        saveRecord(this.entity, this.formState === FormState.NEW ? '' : this.curUserId,
            this.formModel).then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
            return
          } else {
            this.formModel = res.data.formData
            this.labelsModel = res.data.labelData
            this.$message({ message: '保存成功', type: 'success' })
            this.showFormDialogFlag = false
          }
        }).catch(res => {
          this.$message({ message: res.message, type: 'error' })
        })
      },

      searchData() {
        if (isEmptyStr(this.keyword)) {
          if (!isEmptyStr(this.searchFilter)) {
            this.loadTableData('(1=1)', this.page.limit, 1)
          }

          return
        }

        let searchContent = this.keyword.trim()
        this.searchFilter = `([userName] like '%${searchContent}%') or ([loginName] like '%${searchContent}%') or ([departmentId.departmentName] like '%${searchContent}%')`
        this.loadTableData(this.searchFilter, this.page.limit, 1)
      },

      clearSearch() {
        if (isEmptyStr(this.searchFilter)) {
          return
        }

        this.searchFilter = ''
        this.loadTableData('(1=1)', this.page.limit, 1)
      },

      myChange(formModel) {
        console.log(formModel.workDirection)
        console.log(this.formModel.workDirection)
      }

    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-main {
    padding: 0;
  }

  .el-aside {
    background-color: #ffffff;
  }

  .left-tree-panel {
    width: 300px;
    margin-right: 0;
    border-right: 2px dotted #EBEEF5;
  }

  .list-search-panel {
    height: 62px !important;
    line-height: 62px;
    border-left: 1px solid #EBEEF5;
    /* border-bottom: 2px dotted #EBEEF5; */
    /*margin-bottom: 2px;*/
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

    .el-input.v-middle { /* 借鉴.el-button样式，解决IE垂直居中问题 */
      display: inline-table;
      padding: 15px 20px 0 0;
    }
  }

  ::v-deep .el-table th.gutter { /* 解决表头与内容列不对齐差1个像素的问题！！ */
    display: table-cell !important;
  }

  ::v-deep .el-dialog__header {
    /*border-bottom: 1px #cac6c6 solid;*/
    text-align: center;
    padding-top: 15px;

    .el-dialog__title {
      font-size: 16px;
    }
  }

  ::v-deep .el-dialog__body {
    padding: 12px 10px;
  }

  ::v-deep #simpleTableFooter.el-footer {
    border-left: 1px solid #EBEEF5;
    //height: 48px !important;
    //padding-top: 8px !important;
  }
</style>
