<template>
  <el-container direction="horizontal">
    <data-list ref="dataList" :entity="entity" :custom-add-action="true" @addTableRecord="addNewRole"
               :custom-edit-action="true" @editTableRow="editRole"
               :custom-delete-action="true" @deleteTableRow="deleteRole"
               :custom-data-load="true" :page="page" @handleSizeChange="handleSizeChange"
               @handleCurrentChange="handleCurrentChange" @searchData="searchRole" @clearSearch="clearSearch"></data-list>

    <el-dialog :title="formTitle" :visible.sync="showRoleFormDialogFlag" v-if="showRoleFormDialogFlag"
               :destroy-on-close="true" :close-on-click-modal="false" class="small-padding"
               :show-close="true" :close-on-press-escape="false">
      <el-form label-position="left" :label-width="'120px'" size="mini" ref="roleForm"
               :model="formModel" :rules="formRules">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="formModel.roleName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否禁用">
              <el-radio-group v-model="formModel.disabled">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item label="角色说明">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3}" v-model="formModel.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="entity-right-setting">
          <el-col :offset="0" :span="4">实体权限设置</el-col>
          <el-col :span="5" class="text-align-center bold">查看权限</el-col>
          <el-col :span="5" class="text-align-center bold">新建权限</el-col>
          <el-col :span="5" class="text-align-center bold">修改权限</el-col>
          <el-col :span="5" class="text-align-center bold">删除权限</el-col>
        </el-row>
        <el-row><hr style="border: 0;border-top: 1px dotted #cccccc" /></el-row>
        <el-row :gutter="12" v-for="(rightEntity, entityIdx) in rightEntityList" :key="entityIdx" class="entity-right-row">
          <el-col :offset="0" :span="4">{{rightEntity.label}}</el-col>
          <el-col :span="5">
            <el-select v-model="formModel.rightValueMap['r' + rightEntity.entityCode + '-1']" size="mini">
              <el-option
                      v-for="item in getRightLevels(rightEntity)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="formModel.rightValueMap['r' + rightEntity.entityCode + '-2']" size="mini">
              <el-option
                      v-for="item in getRightLevels(rightEntity)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="formModel.rightValueMap['r' + rightEntity.entityCode + '-3']" size="mini">
              <el-option
                      v-for="item in getRightLevels(rightEntity)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="formModel.rightValueMap['r' + rightEntity.entityCode + '-4']" size="mini">
              <el-option
                      v-for="item in getRightLevels(rightEntity)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row :gutter="12" class="function-right-setting">
          <el-col :offset="0" :span=4>功能权限设置</el-col>
        </el-row>
        <el-row><hr style="border: 0;border-top: 1px dotted #cccccc" /></el-row>
        <el-row :gutter="12" class="function-right-row">
          <el-col :span="12">
            <el-form-item label="允许管理实体">
              <el-radio-group v-model="formModel.rightValueMap['r6001']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="允许删除实体">
              <el-radio-group v-model="formModel.rightValueMap['r6002']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="function-right-row">
          <el-col :span="12">
            <el-form-item label="允许设计表单布局">
              <el-radio-group v-model="formModel.rightValueMap['r6003']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="允许设计数据列表">
              <el-radio-group v-model="formModel.rightValueMap['r6004']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="function-right-row">
          <el-col :span="12">
            <el-form-item label="允许设置单选项">
              <el-radio-group v-model="formModel.rightValueMap['r6005']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="允许设置多选项">
              <el-radio-group v-model="formModel.rightValueMap['r6006']">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRole" size="small" style="width: 90px">保 存</el-button>
        <el-button @click="showRoleFormDialogFlag = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import DataList from '@/components/business/DataList'
  import {copyNew, formatRefColumn, isEmptyStr} from "@/utils/util";
  import {getDataList} from "@/api/crud";
  import {getBlankRoleData, saveRoleData} from "@/api/user";

  export default {
    name: "RoleListView",
    components: { DataList },
    props: {
      entity: {
        type: String,
        default: 'Role'
      },
    },
    data() {
      return {
        fieldsList: 'roleName, disabled, description',

        columns: [
          {prop: 'roleName', label: '用户名称', width: '180', type: 'Text', align: 'center'},
          {prop: 'disabled', label: '是否禁用', width: '120', type: 'Boolean', align: 'left'},
          {prop: 'description', label: '角色描述', type: 'TextArea', align: 'center'},
        ],

        page: {
          pageNo: 1,
          limit: 20,
          sizes: [10, 20, 30, 50, 100],
          total: 0
        },

        showRoleFormDialogFlag: false,

        rowRightLevels: [
          {label: '无权限', value: 0},
          {label: '本人', value: 10},
          {label: '本部门', value: 20},
          {label: '本部门及以下', value: 30},
          {label: '上级部门及以下', value: 40},
          {label: '全部数据', value: 50},
        ],

        simpleRightLevels: [
          {label: '无权限', value: 0},
          {label: '全部数据', value: 50},
        ],

        formModel: {
          roleId: '',
          roleName: '',
          disabled: false,
          description: '',
          rightValueMap: {
            'r101-1': 20,
            'r101-2': 30,
            'r101-3': 50,
            'r101-4': 0,

            'r6001': false,
            'r6002': false,
            'r6003': false,
            'r6004': false,
            'r6005': false,
            'r6006': false,

          },
        },

        rightEntityList: [],

        formRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {pattern: /^[A-Za-z\d\u4e00-\u9fa5]+[_-]*/, message: '请以中文、英文字母、数字开头，中间可输入下划线或横杠', trigger: 'blur'},
            {min: 2, max: 30, message: '请输入至少两个字符', trigger: 'blur'},
          ],
        },
      }
    },
    computed: {
      formTitle() {
        return '新建/编辑权限角色'
      },
    },
    mounted() {
      this.loadRoleData()
    },
    methods: {
      getRightLevels(rightEntity) {
        if (rightEntity.authorizable === true) {
          return this.rowRightLevels
        } else {
          return this.simpleRightLevels
        }
      },

      loadRoleData(filter) {
        let realFilter = isEmptyStr(filter) ? '(1=1)' : filter
        getDataList(this.entity, this.fieldsList, realFilter, this.page.limit, this.page.pageNo).then(res => {
          if (res.error != null) {
            this.$message({message: res.error, type: 'error'})
          } else {
            this.$refs['dataList'].loadTableData(this.columns, res.data.dataList)
            this.page.total = res.data.pagination.total
            //console.log(res.data)
          }
        }).catch(res => {
          this.$message({message: res.message, type: 'error'})
        })

      },

      addNewRole() {
        console.log('add new role!!')

        getBlankRoleData().then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
            return
          }

          this.formModel.roleName = res.data.roleName
          this.formModel.disabled = res.data.disabled
          this.formModel.description = res.data.description
          this.formModel.rightValueMap = res.data.rightValueMap
          this.rightEntityList = copyNew(res.data.rightEntityList)
          this.showRoleFormDialogFlag = true
        }).catch(res => {
          this.$message({ message: res.message, type: 'error' })
        })
      },

      saveRole() {
        console.log(this.formModel)

        let validResult = false
        this.$refs['roleForm'].validate( (valid) => {
          validResult = valid
          if (!!!valid) {
            return false
          }
        })
        if (!!!validResult) {
          return
        }

        saveRoleData(this.formModel).then(res => {
          if (res.error != null) {
            this.$message({ message: res.error, type: 'error' })
            return
          }

          this.$message.success('保存成功')
          this.showRoleFormDialogFlag = false
        }).catch(res => {
          this.$message({ message: res.message, type: 'error' })
        })
      },

      editRole(row) {
        console.log(row)
      },

      deleteRole(row) {
        console.log(row)
      },

      handleSizeChange(val) {
        console.log(val)
      },

      handleCurrentChange(val) {

      },

      searchRole(keyword) {
        console.log(keyword)
      },

      clearSearch() {
        console.log('clear search...')
      },

    },
  }
</script>

<style lang="scss" scoped>
  .el-container {
    width: 100% !important;
    overflow-x: hidden;  /* 注意：IE浏览器中会出现水平滚动条，暂未找到原因！！ */
  }

  .small-padding ::v-deep .el-dialog__body {
    padding: 18px;
  }

  .el-row.entity-right-row {
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .el-row.function-right-row {
    margin-top: 0;
    margin-bottom: 0;

    ::v-deep .el-form-item--mini.el-form-item {
      margin-bottom: 6px;
    }
  }

  .el-row.entity-right-setting {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 12px;
    //font-style: italic;

    .el-col.text-align-center {
      text-align: center;
    }

    .bold {
      //font-weight: 600;
      //text-decoration: underline;
    }
  }

  .el-row.function-right-setting {
    margin-top: 15px;
    margin-bottom: 0;
    font-size: 12px;
  }

</style>
