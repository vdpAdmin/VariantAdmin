<template>
  <el-container direction="horizontal">
    <data-list ref="dataList" :entity="entity" :custom-data-load="true"
               :custom-add-action="true" @addTableRecord="addNewRole"
               :custom-edit-action="true" @editTableRow="editRole"
               :custom-delete-action="true" @deleteTableRow="deleteRole"
               :custom-pagination="true" :page="page" @handleSizeChange="handleSizeChange"  @handleCurrentChange="handleCurrentChange"
               :custom-search="true" @searchData="searchRole" @clearSearch="clearSearch"></data-list>
  </el-container>
</template>

<script>
  import DataList from '@/components/business/DataList'
  import {formatRefColumn, isEmptyStr} from "@/utils/util";
  import {getDataList} from "@/api/crud";

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


      }
    },
    mounted() {
      this.loadRoleData()
    },
    methods: {
      loadRoleData(filter) {
        let realFilter = isEmptyStr(filter) ? '(1=1)' : filter
        getDataList(this.entity, this.fieldsList, filter, this.page.limit, this.page.pageNo).then(res => {
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
</style>
